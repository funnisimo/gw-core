import * as XY from '../xy';
import * as Utils from '../utils';
import * as Range from '../range';
import * as Grid from '../grid';
import * as Color from '../color';
import { config as CONFIG } from '../gw';
import * as Types from './types';

// const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little

export const config = (CONFIG.light = {
    INTENSITY_DARK: 20,
    INTENSITY_SHADOW: 50,
}); // less than 20% for highest color in rgb

let LIGHT_COMPONENTS = Color.make();

export class Light implements Types.LightType {
    public color: Color.Color;
    public radius: Range.Range;
    public fadeTo = 0;
    public passThroughActors = false;
    public id: string | null = null;

    constructor(
        color: Color.ColorBase,
        radius: Range.RangeBase = 1,
        fadeTo = 0,
        pass = false
    ) {
        this.color = Color.from(color); /* color */
        this.radius = Range.make(radius);
        this.fadeTo = fadeTo;
        this.passThroughActors = pass; // generally no, but miner light does (TODO - string parameter?  'false' or 'true')
    }

    copy(other: Light) {
        this.color = other.color;
        this.radius.copy(other.radius);
        this.fadeTo = other.fadeTo;
        this.passThroughActors = other.passThroughActors;
    }

    get intensity() {
        return intensity(this.color);
    }

    // Returns true if any part of the light hit cells that are in the player's field of view.
    paint(
        site: Types.PaintSite,
        x: number,
        y: number,
        maintainShadows = false,
        isMinersLight = false
    ) {
        if (!site) return false;

        let k;
        // let colorComponents = [0,0,0];
        let lightMultiplier = 0;

        let radius = this.radius.value();
        let outerRadius = Math.ceil(radius);

        if (outerRadius < 1) return false;

        // calcLightComponents(colorComponents, this);
        LIGHT_COMPONENTS = this.color.bake();

        // console.log('paint', LIGHT_COMPONENTS.toString(true), x, y, outerRadius);

        // the miner's light does not dispel IS_IN_SHADOW,
        // so the player can be in shadow despite casting his own light.
        const dispelShadows =
            !isMinersLight &&
            !maintainShadows &&
            !isDarkLight(LIGHT_COMPONENTS);
        const fadeToPercent = this.fadeTo;

        const grid = Grid.alloc(site.width, site.height, 0);
        site.calcFov(x, y, outerRadius, this.passThroughActors, (i, j) => {
            grid[i][j] = 1;
        });

        // let overlappedFieldOfView = false;
        const lightValue: Color.LightValue = [0, 0, 0];

        grid.forCircle(x, y, outerRadius, (v, i, j) => {
            if (!v) return;
            // const cell = map.cell(i, j);

            lightMultiplier = Math.floor(
                100 -
                    (100 - fadeToPercent) *
                        (XY.distanceBetween(x, y, i, j) / radius)
            );
            for (k = 0; k < 3; ++k) {
                lightValue[k] = Math.floor(
                    (LIGHT_COMPONENTS._data[k] * lightMultiplier) / 100
                );
            }
            site.addCellLight(i, j, lightValue, dispelShadows);

            // if (dispelShadows) {
            //     map.clearCellFlag(i, j, CellFlags.IS_IN_SHADOW);
            // }
            // if (map.isVisible(i, j)) {
            //     overlappedFieldOfView = true;
            // }

            // console.log(i, j, lightMultiplier, cell.light);
        });

        // if (dispelShadows) {
        //     map.clearCellFlag(x, y, CellFlags.IS_IN_SHADOW);
        // }

        Grid.free(grid);
        // return overlappedFieldOfView;
        return true;
    }
}

export function intensity(light: Color.Color | Color.LightValue) {
    let data: number[] | Int16Array = light as number[];
    if (light instanceof Color.Color) {
        data = light._data;
    }
    return Math.max(data[0], data[1], data[2]);
}

export function isDarkLight(
    light: Color.Color | Color.LightValue,
    threshold = 20
): boolean {
    return intensity(light) <= threshold;
}

export function isShadowLight(
    light: Color.Color | Color.LightValue,
    threshold = 40
): boolean {
    return intensity(light) <= threshold;
}

export function make(
    color: Color.ColorBase,
    radius?: Range.RangeBase,
    fadeTo?: number,
    pass?: boolean
): Light;
export function make(light: Types.LightBase): Light;
export function make(...args: any[]) {
    if (args.length == 1) {
        const config = args[0];
        if (typeof config === 'string') {
            const cached = lights[config];
            if (cached) return cached;

            const [color, radius, fadeTo, pass] = config
                .split(/[,|]/)
                .map((t) => t.trim());
            return new Light(
                Color.from(color),
                Range.from(radius || 1),
                Number.parseInt(fadeTo || '0'),
                !!pass && pass !== 'false'
            );
        } else if (Array.isArray(config)) {
            const [color, radius, fadeTo, pass] = config;
            return new Light(color, radius, fadeTo, pass);
        } else if (config && config.color) {
            return new Light(
                Color.from(config.color),
                Range.from(config.radius),
                Number.parseInt(config.fadeTo || '0'),
                config.pass
            );
        } else {
            throw new Error('Unknown Light config - ' + config);
        }
    } else {
        const [color, radius, fadeTo, pass] = args;
        return new Light(color, radius, fadeTo, pass);
    }
}

export const lights: Record<string, Light> = {};

export function from(light: Types.LightBase | Types.LightType): Light;
export function from(...args: any[]) {
    if (args.length != 1)
        Utils.ERROR('Unknown Light config: ' + JSON.stringify(args));
    const arg = args[0];
    if (typeof arg === 'string') {
        const cached = lights[arg];
        if (cached) return cached;
    }
    if (arg && arg.paint) return arg;
    return make(arg);
}

// TODO - USE STRINGS FOR LIGHT SOURCE IDS???
//      - addLightKind(id, source) { LIIGHT_SOURCES[id] = source; }
//      - lights = {};
export function install(
    id: string,
    color: Color.ColorBase,
    radius: Range.RangeBase,
    fadeTo?: number,
    pass?: boolean
): Light;
export function install(id: string, base: Types.LightBase): Light;
export function install(id: string, config: Types.LightConfig): Light;
export function install(id: string, ...args: any[]) {
    let source;
    if (args.length == 1) {
        source = make(args[0]);
    } else {
        source = make(args[0], args[1], args[2], args[3]);
    }
    lights[id] = source;
    source.id = id;
    return source;
}

export function installAll(
    config: Record<string, Types.LightConfig | Types.LightBase>
) {
    const entries = Object.entries(config);
    entries.forEach(([name, info]) => {
        install(name, info);
    });
}

// // TODO - Move?
// export function playerInDarkness(
//     map: Types.LightSite,
//     PLAYER: Utils.XY,
//     darkColor?: Color.Color
// ) {
//     const cell = map.cell(PLAYER.x, PLAYER.y);
//     return cell.isDark(darkColor);
//     // return (
//     //   cell.light[0] + 10 < darkColor.r &&
//     //   cell.light[1] + 10 < darkColor.g &&
//     //   cell.light[2] + 10 < darkColor.b
//     // );
// }
