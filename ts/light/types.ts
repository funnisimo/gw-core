import { Color, ColorBase, LightValue } from '../color';
import { Range } from '../range';

export interface LightConfig {
    color: ColorBase;
    radius: number;
    fadeTo?: number;
    pass?: boolean;
}

export type LightBase = LightConfig | string | any[];

export interface LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;

    paint(
        map: PaintSite,
        x: number,
        y: number,
        maintainShadows?: boolean,
        isMinersLight?: boolean
    ): boolean;
}

export type LightCb = (x: number, y: number, light: LightType) => void;

// export interface LightSite {
//     readonly width: number;
//     readonly height: number;

//     isVisible: (x: number, y: number) => boolean;
//     hasActor: (x: number, y: number) => boolean;
//     blocksVision: (x: number, y: number) => boolean;

//     anyLightChanged: boolean;
//     staticLightChanged: boolean;

//     startLightUpdate: () => void;
//     eachStaticLight: (cb: LightCb) => void;
//     eachDynamicLight: (cb: LightCb) => void;
//     finishLightUpdate: () => void;

//     addCellLight: (
//         x: number,
//         y: number,
//         light: LightValue,
//         dispelShadows: boolean
//     ) => void;

//     recordGlowLights: () => void;
//     restoreGlowLights: () => void;
// }

export interface PaintSite {
    readonly width: number;
    readonly height: number;

    calcFov(
        x: number,
        y: number,
        radius: number,
        passThroughActors: boolean,
        cb: (x: number, y: number) => void
    ): void;
    addCellLight(
        x: number,
        y: number,
        light: LightValue,
        dispelShadows: boolean
    ): void;
}

export interface LightSystemSite {
    readonly width: number;
    readonly height: number;

    hasXY(x: number, y: number): boolean;

    // isVisible(x: number, y: number): boolean;
    hasActor(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;

    // anyLightChanged: boolean;
    // glowLightChanged: boolean;

    eachGlowLight(cb: LightCb): void;
    eachDynamicLight(cb: LightCb): void;

    // setCellFlag(x: number, y: number, flag: number): void;
    // clearCellFlag(x: number, y: number, flag: number): void;
    // hasCellFlag(x: number, y: number, flag: number): boolean;
}

export interface LightSystemType {
    update(force?: boolean): boolean; // didSomething
    setAmbient(light: LightValue | Color): void;
    getAmbient(): LightValue;

    readonly changed: boolean;

    glowLightChanged: boolean;
    dynamicLightChanged: boolean;

    addStatic(x: number, y: number, light: LightType): void;
    removeStatic(x: number, y: number, light?: LightType): void;

    getLight(x: number, y: number): LightValue;
    lightChanged(x: number, y: number): boolean;

    isLit(x: number, y: number): boolean;
    isDark(x: number, y: number): boolean;
    isInShadow(x: number, y: number): boolean;
}
