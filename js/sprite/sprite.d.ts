import * as Color from '../color';
import { SpriteType } from '../types';
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
export declare function make(): Sprite;
export declare function make(bg: Color.ColorBase, opacity?: number): Sprite;
export declare function make(ch: string | null, fg: Color.ColorBase | null, bg: Color.ColorBase | null, opacity?: number): Sprite;
export declare function make(args: any[]): Sprite;
export declare function make(info: Partial<SpriteConfig>): Sprite;
export declare function install(name: string, bg: Color.ColorBase, opacity?: number): Sprite;
export declare function install(name: string, ch: string | null, fg: Color.Color | number | string | number[] | null, bg: Color.Color | number | string | number[] | null, opacity?: number): Sprite;
export declare function install(name: string, args: any[]): Sprite;
export declare function install(name: string, info: Partial<SpriteConfig>): Sprite;
