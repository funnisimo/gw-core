import * as Color from "../color";
export interface DrawInfo {
    ch: string | number;
    fg: Color.Color | number;
    bg: Color.Color | number;
}
export interface SpriteType extends DrawInfo {
    opacity?: number;
}
export declare class Mixer implements DrawInfo {
    ch: string | number;
    fg: Color.Color;
    bg: Color.Color;
    constructor();
    protected _changed(): this;
    copy(other: Mixer): this;
    clone(): Mixer;
    equals(other: Mixer): boolean;
    nullify(): this;
    blackOut(): this;
    draw(ch?: string | number, fg?: Color.ColorBase, bg?: Color.ColorBase): this;
    drawSprite(info: SpriteType, opacity?: number): this | undefined;
    invert(): this;
    multiply(color: Color.ColorBase, fg?: boolean, bg?: boolean): this;
    mix(color: Color.ColorBase, fg?: number, bg?: number): this;
    add(color: Color.ColorBase, fg?: number, bg?: number): this;
    separate(): this;
    bake(): {
        ch: string | number;
        fg: number;
        bg: number;
    };
}
