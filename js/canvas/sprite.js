import * as Color from "../color";
import { make } from "../gw";
export class Sprite {
    constructor(ch, fg, bg, opacity) {
        if (!ch && ch !== 0)
            ch = -1;
        if (typeof fg !== "number")
            fg = Color.from(fg);
        if (typeof bg !== "number")
            bg = Color.from(bg);
        this.ch = ch;
        this.fg = fg;
        this.bg = bg;
        this.opacity = opacity;
    }
}
export const sprites = {};
export function makeSprite(...args) {
    let ch = null, fg = -1, bg = -1, opacity;
    if (args.length == 0) {
        return new Sprite(null, -1, -1);
    }
    else if (args.length == 1 && Array.isArray(args[0])) {
        args = args[0];
    }
    if (args.length > 3) {
        opacity = args[3];
        args.pop();
    }
    else if (args.length == 2 &&
        typeof args[1] == "number" &&
        args[0].length > 1) {
        opacity = args.pop();
    }
    if (args.length > 1) {
        ch = args[0] || -1;
        fg = args[1];
        bg = args[2];
    }
    else {
        if (typeof args[0] === "string" && args[0].length == 1) {
            ch = args[0];
            fg = "white"; // white is default?
        }
        else if ((typeof args[0] === "string" && args[0].length > 1) ||
            typeof args[0] === "number") {
            bg = args[0];
        }
        else if (args[0] instanceof Color.Color) {
            bg = args[0];
        }
        else {
            const sprite = args[0];
            ch = sprite.ch || -1;
            fg = sprite.fg || -1;
            bg = sprite.bg || -1;
            opacity = sprite.opacity;
        }
    }
    if (typeof fg === "string")
        fg = Color.from(fg);
    else if (Array.isArray(fg))
        fg = Color.make(fg);
    else if (fg === undefined || fg === null)
        fg = -1;
    if (typeof bg === "string")
        bg = Color.from(bg);
    else if (Array.isArray(bg))
        bg = Color.make(bg);
    else if (bg === undefined || bg === null)
        bg = -1;
    return new Sprite(ch, fg, bg, opacity);
}
make.sprite = makeSprite;
export function installSprite(name, ...args) {
    let sprite;
    // @ts-ignore
    sprite = this.makeSprite(...args);
    sprite.name = name;
    sprites[name] = sprite;
    return sprite;
}
//# sourceMappingURL=sprite.js.map