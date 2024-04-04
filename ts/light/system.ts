import { Shadowcast } from '../fov';
import {
    LightSystemType,
    LightSystemSite,
    PaintSite,
    LightType,
    LightCb,
    LightBase,
} from './types';
import * as Grid from '../grid';
import * as Light from './light';
// import { data as DATA } from '../data';
import * as XY from '../xy';
import * as Color from '../color';
import * as FLAG from '../flag';

export interface StaticLightInfo {
    x: number;
    y: number;
    light: LightType;
}

const LightFlags = FLAG.make([
    'LIT',
    'IN_SHADOW',
    'DARK',
    // 'MAGIC_DARK',
    'CHANGED',
]);

export interface LightSystemOptions {
    ambient?: Color.ColorBase | Color.LightValue;
}

export class LightSystem implements LightSystemType, PaintSite {
    site: LightSystemSite;
    staticLights: (StaticLightInfo | null)[] = [];
    ambient: Color.LightValue;
    glowLightChanged: boolean;
    dynamicLightChanged: boolean;
    changed: boolean;

    light: Grid.Grid<Color.LightValue>;
    oldLight: Grid.Grid<Color.LightValue>;
    glowLight: Grid.Grid<Color.LightValue>;
    flags: Grid.NumGrid;

    constructor(map: LightSystemSite, opts: LightSystemOptions = {}) {
        this.site = map;
        this.ambient = Color.from(opts.ambient || 'white').toLight();
        this.changed = false;

        this.glowLightChanged = false;
        this.dynamicLightChanged = false;

        this.light = Grid.make(
            map.width,
            map.height,
            () => this.ambient.slice() as Color.LightValue
        );
        this.glowLight = Grid.make(
            map.width,
            map.height,
            () => this.ambient.slice() as Color.LightValue
        );
        this.oldLight = Grid.make(
            map.width,
            map.height,
            () => this.ambient.slice() as Color.LightValue
        );
        this.flags = Grid.make(map.width, map.height);

        this.finishLightUpdate();
    }

    copy(other: LightSystem) {
        this.setAmbient(other.ambient);
        this.glowLightChanged = true;
        this.dynamicLightChanged = true;
        this.changed = true;

        this.staticLights = [];
        other.staticLights.forEach(
            (info: StaticLightInfo | null) =>
                info && this.addStatic(info.x, info.y, info.light)
        );
    }

    getAmbient(): Color.LightValue {
        return this.ambient;
    }
    setAmbient(light: Color.LightValue | Color.ColorBase) {
        if (light instanceof Color.Color) {
            light = light.toLight();
        } else if (!Array.isArray(light)) {
            light = Color.from(light).toLight();
        }
        for (let i = 0; i < 3; ++i) {
            this.ambient[i] = light[i] as number;
        }
        this.glowLightChanged = true;
    }

    get needsUpdate() {
        return this.glowLightChanged || this.dynamicLightChanged;
    }

    getLight(x: number, y: number): Color.LightValue {
        return this.light.get(x, y) || [0, 0, 0];
    }
    setLight(x: number, y: number, light: Color.LightValue) {
        const val = this.light.get(x, y);
        if (!val) return;
        for (let i = 0; i < 3; ++i) {
            val[i] = light[i];
        }
    }

    _getFlag(x: number, y: number): number {
        return this.flags.get(x, y) || 0;
    }

    isLit(x: number, y: number): boolean {
        return !!(this._getFlag(x, y) & LightFlags.LIT);
    }
    isDark(x: number, y: number): boolean {
        return !!(this._getFlag(x, y) & LightFlags.DARK);
    }
    isInShadow(x: number, y: number): boolean {
        return !!(this._getFlag(x, y) & LightFlags.IN_SHADOW);
    }
    // isMagicDark(x: number, y: number): boolean {
    //     return !!(this.flags.get(x,y) & LightFlags.MAGIC_DARK);
    // }
    lightChanged(x: number, y: number): boolean {
        return !!(this._getFlag(x, y) & LightFlags.CHANGED);
    }

    // setMagicDark(x: number, y: number, isDark = true) {
    //     if (isDark) {
    //         this.flags[x][y] |= LightFlags.MAGIC_DARK;
    //     } else {
    //         this.flags.get(x,y) &= ~LightFlags.MAGIC_DARK;
    //     }
    // }

    get width(): number {
        return this.site.width;
    }
    get height(): number {
        return this.site.height;
    }

    addStatic(x: number, y: number, light: LightType | LightBase) {
        const info: StaticLightInfo = {
            x,
            y,
            light: Light.from(light),
        };
        const index = this.staticLights.indexOf(null);
        if (index < 0) {
            this.staticLights.push(info);
        } else {
            this.staticLights[index] = info;
        }
        this.glowLightChanged = true;
        return info;
    }

    removeStatic(x: number, y: number, light?: Light.Light) {
        let prev = this.staticLights;
        if (!prev) return;

        function matches(info: StaticLightInfo | null) {
            if (!info) return false;
            if (info.x != x || info.y != y) return false;
            return !light || light === info.light;
        }

        this.glowLightChanged = true;

        const index = this.staticLights.findIndex(matches);
        if (index < 0) return;
        this.staticLights[index] = null;
    }

    eachStaticLight(fn: LightCb) {
        this.staticLights.forEach(
            (info: StaticLightInfo | null) =>
                info && fn(info.x, info.y, info.light)
        );
        this.site.eachGlowLight((x, y, light) => {
            fn(x, y, light);
        });
    }

    eachDynamicLight(fn: LightCb) {
        this.site.eachDynamicLight(fn);
    }

    update(force = false): boolean {
        this.changed = false;
        if (!force && !this.needsUpdate) return false;
        // Copy Light over oldLight
        this.startLightUpdate();

        if (!this.glowLightChanged) {
            this.restoreGlowLights();
        } else {
            // GW.debug.log('painting glow lights.');
            // Paint all glowing tiles.
            this.eachStaticLight((x, y, light) => {
                light.paint(this, x, y);
            });

            this.recordGlowLights();
            this.glowLightChanged = false;
        }

        // Cycle through monsters and paint their lights:
        this.eachDynamicLight(
            (x, y, light) => light.paint(this, x, y)
            // if (monst.mutationIndex >= 0 && mutationCatalog[monst.mutationIndex].light != lights['NO_LIGHT']) {
            //     paint(map, mutationCatalog[monst.mutationIndex].light, actor.x, actor.y, false, false);
            // }
            // if (actor.isBurning()) { // monst.status.burning && !(actor.kind.flags & Flags.Actor.AF_FIERY)) {
            // 	paint(map, lights.BURNING_CREATURE, actor.x, actor.y, false, false);
            // }
            // if (actor.isTelepathicallyRevealed()) {
            // 	paint(map, lights['TELEPATHY_LIGHT'], actor.x, actor.y, false, true);
            // }
        );

        // Also paint telepathy lights for dormant monsters.
        // for (monst of map.dormantMonsters) {
        //     if (monsterTelepathicallyRevealed(monst)) {
        //         paint(map, lights['TELEPATHY_LIGHT'], monst.xLoc, monst.yLoc, false, true);
        //     }
        // }

        this.finishLightUpdate();

        // Miner's light:
        this.site.eachMinersLight((x, y, light) => {
            light.paint(this, x, y, true, true);
        });
        // const PLAYER = DATA.player;
        // if (PLAYER) {
        //     const PLAYERS_LIGHT = Light.lights.PLAYERS_LIGHT;
        //     if (PLAYERS_LIGHT) {
        //         PLAYERS_LIGHT.paint(this, PLAYER.x, PLAYER.y, true, true);
        //     }
        // }

        this.dynamicLightChanged = false;
        this.changed = true;

        // if (PLAYER.status.invisible) {
        //     PLAYER.info.foreColor = playerInvisibleColor;
        // } else if (playerInDarkness()) {
        // 	PLAYER.info.foreColor = playerInDarknessColor;
        // } else if (pmap[PLAYER.xLoc][PLAYER.yLoc].flags & IS_IN_SHADOW) {
        // 	PLAYER.info.foreColor = playerInShadowColor;
        // } else {
        // 	PLAYER.info.foreColor = playerInLightColor;
        // }

        return true;
    }

    startLightUpdate(): void {
        // record Old Lights
        // and then zero out Light.
        let i = 0;
        const flag = Light.isShadowLight(this.ambient)
            ? LightFlags.IN_SHADOW
            : 0;
        this.light.forEach((val, x, y) => {
            for (i = 0; i < 3; ++i) {
                this.oldLight._data[x][y][i] = val[i];
                val[i] = this.ambient[i];
            }
            this.flags.set(x, y, flag);
        });
    }

    finishLightUpdate(): void {
        XY.forRect(this.width, this.height, (x, y) => {
            // clear light flags
            // this.flags.get(x,y) &= ~(LightFlags.LIT | LightFlags.DARK);
            const oldLight = this.oldLight.get(x, y) || [0, 0, 0];
            const light = this.light.get(x, y) || [0, 0, 0];
            if (light.some((v, i) => v !== oldLight[i])) {
                this.flags._data[x][y] |= LightFlags.CHANGED;
            }
            if (Light.isDarkLight(light)) {
                this.flags._data[x][y] |= LightFlags.DARK;
            } else if (!Light.isShadowLight(light)) {
                this.flags._data[x][y] |= LightFlags.LIT;
            }
        });
    }

    recordGlowLights(): void {
        let i = 0;
        this.light.forEach((val, x, y) => {
            const glowLight = this.glowLight.get(x, y)!;
            for (i = 0; i < 3; ++i) {
                glowLight[i] = val[i];
            }
        });
    }

    restoreGlowLights(): void {
        let i = 0;
        this.light.forEach((val, x, y) => {
            const glowLight = this.glowLight.get(x, y)!;
            for (i = 0; i < 3; ++i) {
                val[i] = glowLight[i];
            }
        });
    }

    // PaintSite

    calcFov(
        x: number,
        y: number,
        radius: number,
        passThroughActors: boolean,
        cb: (x: number, y: number) => void
    ) {
        const site = this.site;
        const fov = new Shadowcast({
            isBlocked(x: number, y: number): boolean {
                if (!passThroughActors && site.hasActor(x, y)) return false;
                return site.blocksVision(x, y);
            },
            hasXY(x: number, y: number) {
                return site.hasXY(x, y);
            },
        });
        fov.calculate(x, y, radius, cb);
    }

    addCellLight(
        x: number,
        y: number,
        light: Color.LightValue,
        dispelShadows: boolean
    ) {
        const val = this.light.get(x, y)!;
        for (let i = 0; i < 3; ++i) {
            val[i] += light[i];
        }
        if (dispelShadows && !Light.isShadowLight(light)) {
            this.flags._data[x][y] &= ~LightFlags.IN_SHADOW;
        }
    }
}
