import * as Color from "../color";
import { SpriteType } from "./mixer";
export interface SpriteConfig {
    ch?: string | number | null;
    fg?: Color.ColorBase | null;
    bg?: Color.ColorBase | null;
    opacity?: number;
}
export declare class Sprite implements SpriteType {
    ch: string | number;
    fg: number | Color.Color;
    bg: number | Color.Color;
    opacity?: number;
    name?: string;
    constructor(ch?: string | number | null, fg?: Color.ColorBase | null, bg?: Color.ColorBase | null, opacity?: number);
}
export declare const sprites: Record<string, Sprite>;
export declare function makeSprite(): Sprite;
export declare function makeSprite(bg: Color.ColorBase, opacity?: number): Sprite;
export declare function makeSprite(ch: string | null, fg: Color.ColorBase | null, bg: Color.ColorBase | null, opacity?: number): Sprite;
export declare function makeSprite(args: any[]): Sprite;
export declare function makeSprite(info: Partial<SpriteConfig>): Sprite;
export declare function installSprite(name: string, bg: Color.ColorBase, opacity?: number): Sprite;
export declare function installSprite(name: string, ch: string | null, fg: Color.Color | number | string | number[] | null, bg: Color.Color | number | string | number[] | null, opacity?: number): Sprite;
export declare function installSprite(name: string, args: any[]): Sprite;
export declare function installSprite(name: string, info: Partial<SpriteConfig>): Sprite;
