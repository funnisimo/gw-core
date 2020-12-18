import * as Color from "../color";
import { SpriteType } from "./mixer";

export interface SpriteConfig {
  ch?: string | number | null;
  fg?: Color.Color | number | string | null;
  bg?: Color.Color | number | string | null;
  opacity?: number;
}

export class Sprite implements SpriteType {
  public ch: string | number;
  public fg: number | Color.Color;
  public bg: number | Color.Color;
  public opacity?: number;
  public name?: string;

  constructor(
    ch?: string | number | null,
    fg?: Color.Color | number | null,
    bg?: Color.Color | number | null,
    opacity?: number
  ) {
    if (!ch && ch !== 0) ch = -1;
    if (typeof fg !== "number") fg = Color.from(fg);
    if (typeof bg !== "number") bg = Color.from(bg);
    this.ch = ch;
    this.fg = fg;
    this.bg = bg;
    this.opacity = opacity;
  }
}

export const sprites: Record<string, Sprite> = {};

export function makeSprite(): Sprite;
export function makeSprite(bg: Color.ColorBase, opacity?: number): Sprite;
export function makeSprite(
  ch: string | null,
  fg: Color.ColorBase | null,
  bg: Color.ColorBase | null,
  opacity?: number
): Sprite;
export function makeSprite(args: any[]): Sprite;
export function makeSprite(info: Partial<SpriteConfig>): Sprite;
export function makeSprite(...args: any[]) {
  let ch = null,
    fg: Color.ColorBase | null = -1,
    bg: Color.ColorBase | null = -1,
    opacity;

  if (args.length == 0) {
    return new Sprite(null, -1, -1);
  } else if (args.length == 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  const last = args[args.length - 1];
  if (typeof last === "number") {
    opacity = last;
    args.pop();
  }
  if (args.length > 1) {
    ch = args[0] || null;
    fg = args[1];
    bg = args[2];
  } else if (args.length == 1) {
    if (typeof args[0] === "string" || typeof args[0] === "number") {
      bg = args[0];
    } else if (args[0] instanceof Color.Color) {
      bg = args[0];
    } else {
      const sprite = args[0] as SpriteConfig;
      ch = sprite.ch || null;
      fg = sprite.fg || -1;
      bg = sprite.bg || -1;
      opacity = sprite.opacity;
    }
  }
  if (typeof fg === "string") fg = Color.from(fg);
  else if (Array.isArray(fg)) fg = Color.make(fg);
  else if (fg === undefined || fg === null) fg = -1;

  if (typeof bg === "string") bg = Color.from(bg);
  else if (Array.isArray(bg)) bg = Color.make(bg);
  else if (bg === undefined || bg === null) bg = -1;

  return new Sprite(ch, fg, bg, opacity);
}

export function installSprite(
  name: string,
  bg: Color.ColorBase,
  opacity?: number
): Sprite;
export function installSprite(
  name: string,
  ch: string | null,
  fg: Color.Color | number | string | number[] | null,
  bg: Color.Color | number | string | number[] | null,
  opacity?: number
): Sprite;
export function installSprite(name: string, args: any[]): Sprite;
export function installSprite(
  name: string,
  info: Partial<SpriteConfig>
): Sprite;
export function installSprite(name: string, ...args: any[]) {
  let sprite;
  // @ts-ignore
  sprite = this.makeSprite(...args);
  sprite.name = name;
  sprites[name] = sprite;
  return sprite;
}
