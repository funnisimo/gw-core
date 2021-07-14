import { FOV } from '../fov';
import {
    LightSystemType,
    LightSystemSite,
    PaintSite,
    LightType,
    LightValue,
    LightCb,
    LightBase,
} from './types';
import * as Grid from '../grid';
import * as Light from './light';
import { data as DATA } from '../gw';
import * as Utils from '../utils';
import { Cell as CellFlags } from '../map/flags';
import { Color } from '../color';

export interface StaticLightInfo {
    x: number;
    y: number;
    light: LightType;
    next: StaticLightInfo | null;
}

export class LightSystem implements LightSystemType, PaintSite {
    site: LightSystemSite;
    staticLights: StaticLightInfo | null = null;
    ambient: LightValue = [100, 100, 100];

    light: Grid.Grid<LightValue>;
    oldLight: Grid.Grid<LightValue>;
    glowLight: Grid.Grid<LightValue>;

    constructor(map: LightSystemSite) {
        this.site = map;
        this.light = Grid.make(
            map.width,
            map.height,
            () => this.ambient.slice() as LightValue
        );
        this.glowLight = Grid.make(
            map.width,
            map.height,
            () => this.ambient.slice() as LightValue
        );
        this.oldLight = Grid.make(
            map.width,
            map.height,
            () => this.ambient.slice() as LightValue
        );
    }

    setAmbient(light: LightValue | Color) {
        if (light instanceof Color) {
            light = light.toLight();
        }
        for (let i = 0; i < 3; ++i) {
            this.ambient[i] = light[i];
        }
        this.site.glowLightChanged = true;
        this.site.anyLightChanged = true;
    }

    getLight(x: number, y: number): LightValue {
        return this.light[x][y];
    }

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
            next: this.staticLights,
        };
        this.staticLights = info;
        this.site.glowLightChanged = true;
        this.site.anyLightChanged = true;
        return info;
    }

    removeStatic(x: number, y: number, light?: Light.Light) {
        let prev = this.staticLights;
        if (!prev) return;

        function matches(info: StaticLightInfo) {
            if (info.x != x || info.y != y) return false;
            return !light || light === info.light;
        }

        this.site.glowLightChanged = true;
        this.site.anyLightChanged = true;

        while (prev && matches(prev)) {
            prev = this.staticLights = prev.next;
        }

        if (!prev) return;

        let current = prev.next;
        while (current) {
            if (matches(current)) {
                prev.next = current.next;
            } else {
                prev = current;
            }
            current = current.next;
        }
    }

    eachStaticLight(fn: LightCb) {
        Utils.eachChain(this.staticLights, (info: StaticLightInfo) =>
            fn(info.x, info.y, info.light)
        );
        this.site.eachGlowLight((x, y, light) => {
            fn(x, y, light);
        });
    }

    eachDynamicLight(fn: LightCb) {
        this.site.eachDynamicLight(fn);
    }

    update(force = false): boolean {
        if (!force && !this.site.anyLightChanged) return false;
        // Copy Light over oldLight
        this.startLightUpdate();

        if (!this.site.glowLightChanged) {
            this.restoreGlowLights();
        } else {
            // GW.debug.log('painting glow lights.');
            // Paint all glowing tiles.
            this.eachStaticLight((x, y, light) => {
                light.paint(this, x, y);
            });

            this.recordGlowLights();
            this.site.glowLightChanged = false;
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
        const PLAYER = DATA.player;
        if (PLAYER) {
            const PLAYERS_LIGHT = Light.lights.PLAYERS_LIGHT;
            if (PLAYERS_LIGHT && PLAYERS_LIGHT.radius) {
                PLAYERS_LIGHT.paint(this, PLAYER.x, PLAYER.y, true, true);
            }
        }

        this.site.anyLightChanged = false;

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
        this.light.forEach((val, x, y) => {
            for (i = 0; i < 3; ++i) {
                this.oldLight[x][y][i] = val[i];
                val[i] = this.ambient[i];
            }
            this.site.setCellFlag(x, y, CellFlags.IS_IN_SHADOW);
        });
    }

    finishLightUpdate(): void {
        Utils.forRect(this.width, this.height, (x, y) => {
            // clear light flags
            this.site.clearCellFlag(
                x,
                y,
                CellFlags.CELL_LIT | CellFlags.CELL_DARK
            );
            const oldLight = this.oldLight[x][y];
            const light = this.light[x][y];
            if (light.some((v, i) => v !== oldLight[i])) {
                this.site.setCellFlag(x, y, CellFlags.LIGHT_CHANGED);
            }
            if (Light.isDarkLight(light)) {
                this.site.setCellFlag(x, y, CellFlags.CELL_DARK);
            } else if (!this.site.hasCellFlag(x, y, CellFlags.IS_IN_SHADOW)) {
                this.site.setCellFlag(x, y, CellFlags.CELL_LIT);
            }
        });
    }

    recordGlowLights(): void {
        let i = 0;
        this.light.forEach((val, x, y) => {
            const glowLight = this.glowLight[x][y];
            for (i = 0; i < 3; ++i) {
                glowLight[i] = val[i];
            }
        });
    }

    restoreGlowLights(): void {
        let i = 0;
        this.light.forEach((val, x, y) => {
            const glowLight = this.glowLight[x][y];
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
        const map = this.site;
        const fov = new FOV({
            isBlocked(x: number, y: number): boolean {
                if (!passThroughActors && map.hasActor(x, y)) return false;
                return map.blocksVision(x, y);
            },
            setVisible: cb,
            hasXY(x: number, y: number) {
                return map.hasXY(x, y);
            },
        });
        fov.calculate(x, y, radius);
    }

    addCellLight(
        x: number,
        y: number,
        light: LightValue,
        dispelShadows: boolean
    ) {
        const val = this.light[x][y];
        for (let i = 0; i < 3; ++i) {
            val[i] += light[i];
        }
        if (dispelShadows) {
            this.site.clearCellFlag(x, y, CellFlags.IS_IN_SHADOW);
        }
    }
}
