import { cosmetic } from '../rng';
import { clamp } from '../utils';

export type ColorData =
    | [number, number, number]
    | [number, number, number, number];
export type ColorBase = string | number | ColorData | Color;

export type LightValue = [number, number, number];

function toColorInt(r: number, g: number, b: number, base256: boolean) {
    if (base256) {
        r = Math.max(0, Math.min(255, Math.round(r * 2.550001)));
        g = Math.max(0, Math.min(255, Math.round(g * 2.550001)));
        b = Math.max(0, Math.min(255, Math.round(b * 2.550001)));
        return (r << 16) + (g << 8) + b;
    }
    r = Math.max(0, Math.min(15, Math.round((r / 100) * 15)));
    g = Math.max(0, Math.min(15, Math.round((g / 100) * 15)));
    b = Math.max(0, Math.min(15, Math.round((b / 100) * 15)));
    return (r << 8) + (g << 4) + b;
}

export const colors: Record<string, Color> = {};

// All colors are const!!!
export class Color {
    _data: [number, number, number, number];
    _rand: [number, number, number, number] | null = null;
    public dances = false;
    public name?: string;

    // values are 0-100 for normal RGBA
    constructor(r = -1, g = 0, b = 0, a = 100) {
        if (r < 0) {
            a = 0;
            r = 0;
        }
        this._data = [r, g, b, a];
    }

    rgb() {
        return [this.r, this.g, this.b, this.a];
    }

    get r() {
        return Math.round(this._data[0] * 2.550001);
    }
    get _r() {
        return this._data[0];
    }
    get _ra() {
        return Math.round((this._data[0] * this._data[3]) / 100);
    }

    get g() {
        return Math.round(this._data[1] * 2.550001);
    }
    get _g() {
        return this._data[1];
    }
    get _ga() {
        return Math.round((this._data[1] * this._data[3]) / 100);
    }

    get b() {
        return Math.round(this._data[2] * 2.550001);
    }
    get _b() {
        return this._data[2];
    }
    get _ba() {
        return Math.round((this._data[2] * this._data[3]) / 100);
    }

    get a() {
        return this._data[3];
    }
    get _a() {
        return this.a;
    }

    rand(all: number, r = 0, g = 0, b = 0): this {
        this._rand = [all, r, g, b];
        this.dances = false;
        return this;
    }

    dance(all: number, r?: number, g?: number, b?: number): this {
        this.rand(all, r, g, b);
        this.dances = true;
        return this;
    }

    isNull() {
        return this._data[3] === 0;
    }

    alpha(v: number): Color {
        return new Color(
            this._data[0],
            this._data[1],
            this._data[2],
            clamp(v, 0, 100)
        );
    }

    // luminosity (0-100)
    get l() {
        return Math.round(
            0.5 *
                (Math.min(this._r, this._g, this._b) +
                    Math.max(this._r, this._g, this._b))
        );
    }
    // saturation (0-100)
    get s() {
        if (this.l >= 100) return 0;
        return Math.round(
            ((Math.max(this._r, this._g, this._b) -
                Math.min(this._r, this._g, this._b)) *
                (100 - Math.abs(this.l * 2 - 100))) /
                100
        );
    }
    // hue (0-360)
    get h() {
        let H = 0;
        let R = this.r;
        let G = this.g;
        let B = this.b;
        if (R >= G && G >= B) {
            H = 60 * ((G - B) / (R - B));
        } else if (G > R && R >= B) {
            H = 60 * (2 - (R - B) / (G - B));
        } else if (G >= B && B > R) {
            H = 60 * (2 + (B - R) / (G - R));
        } else if (B > G && G > R) {
            H = 60 * (4 - (G - R) / (B - R));
        } else if (B > R && R >= G) {
            H = 60 * (4 + (R - G) / (B - G));
        } else {
            H = 60 * (6 - (B - G) / (R - G));
        }
        return Math.round(H);
    }

    equals(other: Color | ColorBase) {
        if (typeof other === 'string') {
            if (other.startsWith('#')) {
                if (other.length == 4) {
                    return this.css() === other;
                }
                return this.css(true) === other;
            }
            if (this.name) return this.name === other;
        } else if (typeof other === 'number') {
            return this.toInt() === other || this.toInt(true) === other;
        }
        const O = from(other);
        if (this.isNull()) return O.isNull();
        if (O.isNull()) return false;

        return this._data.every((v: number, i: number) => {
            return v == O._data[i];
        });
    }

    toInt(base256 = false) {
        if (this.isNull()) return -1;
        if (!this._rand || !this.dances) {
            return toColorInt(this._ra, this._ga, this._ba, base256);
        }

        const rand = cosmetic.number(this._rand[0]);
        const redRand = cosmetic.number(this._rand[1]);
        const greenRand = cosmetic.number(this._rand[2]);
        const blueRand = cosmetic.number(this._rand[3]);
        const r = Math.round(((this._r + rand + redRand) * this._a) / 100);
        const g = Math.round(((this._g + rand + greenRand) * this._a) / 100);
        const b = Math.round(((this._b + rand + blueRand) * this._a) / 100);
        return toColorInt(r, g, b, base256);
    }

    toLight(): LightValue {
        return [this._ra, this._ga, this._ba];
    }

    clamp(): Color {
        if (this.isNull()) return this;

        return make(
            this._data.map((v) => clamp(v, 0, 100)) as [
                number,
                number,
                number,
                number
            ]
        );
    }

    blend(other: ColorBase): Color {
        const O = from(other);
        if (O.isNull()) return this;
        if (O.a === 100) return O;

        const pct = O.a / 100;
        const keepPct = 1 - pct;

        const newColor = make(
            Math.round(this._data[0] * keepPct + O._data[0] * pct),
            Math.round(this._data[1] * keepPct + O._data[1] * pct),
            Math.round(this._data[2] * keepPct + O._data[2] * pct),
            Math.round(O.a + this._data[3] * keepPct)
        );
        if (this._rand) {
            newColor._rand = this._rand.map((v) => Math.round(v * keepPct)) as [
                number,
                number,
                number,
                number
            ];
            newColor.dances = this.dances;
        }

        if (O._rand) {
            if (!newColor._rand) {
                newColor._rand = [0, 0, 0, 0];
            }
            for (let i = 0; i < 4; ++i) {
                newColor._rand[i] += Math.round(O._rand[i] * pct);
            }
            newColor.dances = newColor.dances || O.dances;
        }
        return newColor;
    }

    mix(other: ColorBase, percent: number): Color {
        const O = from(other);
        if (O.isNull()) return this;

        const pct = clamp(percent, 0, 100) / 100;
        const keepPct = 1 - pct;

        const newColor = make(
            Math.round(this._data[0] * keepPct + O._data[0] * pct),
            Math.round(this._data[1] * keepPct + O._data[1] * pct),
            Math.round(this._data[2] * keepPct + O._data[2] * pct),
            (this.isNull() ? 100 : this._data[3]) * keepPct + O._data[3] * pct
        );
        if (this._rand) {
            newColor._rand = this._rand.slice() as [
                number,
                number,
                number,
                number
            ];
            newColor.dances = this.dances;
        }

        if (O._rand) {
            if (!newColor._rand) {
                newColor._rand = O._rand.map((v) => Math.round(v * pct)) as [
                    number,
                    number,
                    number,
                    number
                ];
            } else {
                for (let i = 0; i < 4; ++i) {
                    newColor._rand[i] = Math.round(
                        newColor._rand[i] * keepPct + O._rand[i] * pct
                    );
                }
            }
            newColor.dances = newColor.dances || O.dances;
        }
        return newColor;
    }

    // Only adjusts r,g,b
    lighten(percent: number): Color {
        if (this.isNull()) return this;
        if (percent <= 0) return this;

        const pct = clamp(percent, 0, 100) / 100;
        const keepPct = 1 - pct;

        return make(
            Math.round(this._data[0] * keepPct + 100 * pct),
            Math.round(this._data[1] * keepPct + 100 * pct),
            Math.round(this._data[2] * keepPct + 100 * pct),
            this._a
        );
    }

    // Only adjusts r,g,b
    darken(percent: number): Color {
        if (this.isNull()) return this;

        const pct = clamp(percent, 0, 100) / 100;
        const keepPct = 1 - pct;

        return make(
            Math.round(this._data[0] * keepPct + 0 * pct),
            Math.round(this._data[1] * keepPct + 0 * pct),
            Math.round(this._data[2] * keepPct + 0 * pct),
            this._a
        );
    }

    bake(clearDancing = false): Color {
        if (this.isNull()) return this;
        if (!this._rand) return this;
        if (this.dances && !clearDancing) return this;

        const d = this._rand;
        const rand = cosmetic.number(d[0]);
        const redRand = cosmetic.number(d[1]);
        const greenRand = cosmetic.number(d[2]);
        const blueRand = cosmetic.number(d[3]);

        return make(
            this._r + rand + redRand,
            this._g + rand + greenRand,
            this._b + rand + blueRand,
            this._a
        );
    }

    // Adds a color to this one
    add(other: ColorBase, percent: number = 100): Color {
        const O = from(other);
        if (O.isNull()) return this;

        const alpha = (O.a / 100) * (percent / 100);
        return make(
            Math.round(this._data[0] + O._data[0] * alpha),
            Math.round(this._data[1] + O._data[1] * alpha),
            Math.round(this._data[2] + O._data[2] * alpha),
            clamp(Math.round(this._a + alpha * 100), 0, 100)
        );
    }

    scale(percent: number): Color {
        if (this.isNull() || percent == 100) return this;

        const pct = Math.max(0, percent) / 100;
        return make(
            Math.round(this._data[0] * pct),
            Math.round(this._data[1] * pct),
            Math.round(this._data[2] * pct),
            this._a
        );
    }

    multiply(other: ColorData | Color): Color {
        if (this.isNull()) return this;

        let data: number[];
        if (Array.isArray(other)) {
            if (other.length < 3)
                throw new Error('requires at least r,g,b values.');
            data = other as number[];
        } else {
            if (other.isNull()) return this;
            data = other._data;
        }

        const pct = (data[3] || 100) / 100;
        return make(
            Math.round(this._ra * (data[0] / 100) * pct),
            Math.round(this._ga * (data[1] / 100) * pct),
            Math.round(this._ba * (data[2] / 100) * pct),
            100
        );
    }

    // scales rgb down to a max of 100
    normalize(): Color {
        if (this.isNull()) return this;

        const max = Math.max(this._ra, this._ga, this._ba);
        if (max <= 100) return this;

        return make(
            Math.round((100 * this._ra) / max),
            Math.round((100 * this._ga) / max),
            Math.round((100 * this._ba) / max),
            100
        );
    }

    /**
     * Returns the css code for the current RGB values of the color.
     * @param base256 - Show in base 256 (#abcdef) instead of base 16 (#abc)
     */
    css(base256 = false): string {
        const v = this.toInt(base256);
        if (v < 0) return 'transparent';
        return '#' + v.toString(16).padStart(base256 ? 6 : 3, '0');
    }

    toString(base256 = false): string {
        if (this.name) return this.name;
        if (this.isNull()) return 'null color';
        return this.css(base256);
    }
}

export function fromArray(vals: ColorData, base256 = false) {
    while (vals.length < 3) vals.push(0);
    if (base256) {
        for (let i = 0; i < 3; ++i) {
            vals[i] = Math.round((((vals[i] as number) || 0) * 100) / 255);
        }
    }
    return new Color(...(vals as number[]));
}

export function fromCss(css: string) {
    if (!css.startsWith('#')) {
        throw new Error(
            'Color CSS strings must be of form "#abc" or "#abcdef" - received: [' +
                css +
                ']'
        );
    }
    const c = Number.parseInt(css.substring(1), 16);
    let r, g, b;
    if (css.length == 4) {
        r = Math.round(((c >> 8) / 15) * 100);
        g = Math.round((((c & 0xf0) >> 4) / 15) * 100);
        b = Math.round(((c & 0xf) / 15) * 100);
    } else {
        r = Math.round(((c >> 16) / 255) * 100);
        g = Math.round((((c & 0xff00) >> 8) / 255) * 100);
        b = Math.round(((c & 0xff) / 255) * 100);
    }
    return new Color(r, g, b);
}

export function fromName(name: string) {
    const c = colors[name];
    if (!c) {
        throw new Error('Unknown color name: ' + name);
    }
    return c;
}

export function fromNumber(val: number, base256 = false): Color {
    if (val < 0) {
        return new Color();
    } else if (base256 || val > 0xfff) {
        return new Color(
            Math.round((((val & 0xff0000) >> 16) * 100) / 255),
            Math.round((((val & 0xff00) >> 8) * 100) / 255),
            Math.round(((val & 0xff) * 100) / 255),
            100
        );
    } else {
        return new Color(
            Math.round((((val & 0xf00) >> 8) * 100) / 15),
            Math.round((((val & 0xf0) >> 4) * 100) / 15),
            Math.round(((val & 0xf) * 100) / 15),
            100
        );
    }
}

export function make(): Color;
export function make(rgb: number, base256?: boolean): Color;
export function make(color?: ColorBase | null): Color;
export function make(arrayLike: ColorData, base256?: boolean): Color;
export function make(...rgb: number[]): Color; // TODO - Remove!
export function make(...args: any[]): Color {
    let arg = args[0];
    let base256: boolean = args[1];

    if (args.length == 0) return new Color();
    if (args.length > 2) {
        arg = args;
        base256 = false; // TODO - Change this!!!
    }
    if (arg === undefined || arg === null) return new Color(-1);
    if (arg instanceof Color) {
        return arg;
    }
    if (typeof arg === 'string') {
        if (arg.startsWith('#')) {
            return fromCss(arg);
        }
        return fromName(arg);
    } else if (Array.isArray(arg)) {
        return fromArray(arg as ColorData, base256);
    } else if (typeof arg === 'number') {
        return fromNumber(arg, base256);
    }
    throw new Error(
        'Failed to make color - unknown argument: ' + JSON.stringify(arg)
    );
}

export function from(): Color;
export function from(rgb: number, base256?: boolean): Color;
export function from(color?: ColorBase | null): Color;
export function from(arrayLike: ColorData, base256?: boolean): Color;
export function from(...rgb: number[]): Color; // TODO - Remove!
export function from(...args: any[]): Color {
    const arg = args[0];
    if (arg instanceof Color) return arg;
    if (arg === undefined) return new Color(-1);
    if (typeof arg === 'string') {
        if (!arg.startsWith('#')) {
            return fromName(arg);
        }
    }
    return make(arg, args[1]);
}

// adjusts the luminosity of 2 colors to ensure there is enough separation between them
export function separate(a: Color, b: Color): [Color, Color] {
    if (a.isNull() || b.isNull()) return [a, b];

    const A = a.clamp();
    const B = b.clamp();

    // console.log('separate');
    // console.log('- a=%s, h=%d, s=%d, l=%d', A.toString(), A.h, A.s, A.l);
    // console.log('- b=%s, h=%d, s=%d, l=%d', B.toString(), B.h, B.s, B.l);

    let hDiff = Math.abs(A.h - B.h);
    if (hDiff > 180) {
        hDiff = 360 - hDiff;
    }
    if (hDiff > 45) return [A, B]; // colors are far enough apart in hue to be distinct

    const dist = 40;
    if (Math.abs(A.l - B.l) >= dist) return [A, B];

    // Get them sorted by saturation ( we will darken the more saturated color and lighten the other)
    const out: [Color, Color] = [A, B];
    const lo = A.s <= B.s ? 0 : 1;
    const hi = 1 - lo;

    // console.log('- lo=%s, hi=%s', lo.toString(), hi.toString());

    while (out[hi].l - out[lo].l < dist) {
        out[hi] = out[hi].mix(WHITE, 5);
        out[lo] = out[lo].mix(BLACK, 5);
    }

    // console.log('=>', a.toString(), b.toString());
    return out;
}

export function relativeLuminance(a: Color, b: Color) {
    return Math.round(
        (100 *
            ((a.r - b.r) * (a.r - b.r) * 0.2126 +
                (a.g - b.g) * (a.g - b.g) * 0.7152 +
                (a.b - b.b) * (a.b - b.b) * 0.0722)) /
            65025
    );
}

export function distance(a: Color, b: Color) {
    return Math.round(
        (100 *
            ((a.r - b.r) * (a.r - b.r) * 0.3333 +
                (a.g - b.g) * (a.g - b.g) * 0.3333 +
                (a.b - b.b) * (a.b - b.b) * 0.3333)) /
            65025
    );
}

// Draws the smooth gradient that appears on a button when you hover over or depress it.
// Returns the percentage by which the current tile should be averaged toward a hilite color.
export function smoothScalar(rgb: number, maxRgb = 255) {
    return Math.floor(100 * Math.sin((Math.PI * rgb) / maxRgb));
}

export function install(name: string, info: ColorBase): Color;
export function install(name: string, ...rgb: ColorData): Color; // TODO - Remove!
export function install(name: string, ...args: any[]) {
    let info = args;
    if (args.length == 1) {
        info = args[0];
    }
    const c = info instanceof Color ? info : make(info as ColorBase);
    // @ts-ignore
    c._const = true;
    colors[name] = c;
    c.name = name;
    return c;
}

export function installSpread(name: string, info: ColorBase): Color;
export function installSpread(name: string, ...rgb: ColorData): Color; // TODO - Remove!
export function installSpread(name: string, ...args: any[]) {
    let c: Color;
    if (args.length == 1) {
        c = install(name, args[0]);
    } else {
        c = install(name, ...(args as ColorData));
    }
    install('light_' + name, c.lighten(25));
    install('lighter_' + name, c.lighten(50));
    install('lightest_' + name, c.lighten(75));
    install('dark_' + name, c.darken(25));
    install('darker_' + name, c.darken(50));
    install('darkest_' + name, c.darken(75));
    return c;
}

export const NONE = install('NONE', -1);
export const BLACK = install('black', 0x000);
export const WHITE = install('white', 0xfff);

installSpread('teal', [30, 100, 100]);
installSpread('brown', [60, 40, 0]);
installSpread('tan', [80, 70, 55]); // 80, 67,		15);
installSpread('pink', [100, 60, 66]);
installSpread('gray', [50, 50, 50]);
installSpread('yellow', [100, 100, 0]);
installSpread('purple', [100, 0, 100]);
installSpread('green', [0, 100, 0]);
installSpread('orange', [100, 50, 0]);
installSpread('blue', [0, 0, 100]);
installSpread('red', [100, 0, 0]);

installSpread('amber', [100, 75, 0]);
installSpread('flame', [100, 25, 0]);
installSpread('fuchsia', [100, 0, 100]);
installSpread('magenta', [100, 0, 75]);
installSpread('crimson', [100, 0, 25]);
installSpread('lime', [75, 100, 0]);
installSpread('chartreuse', [50, 100, 0]);
installSpread('sepia', [50, 40, 25]);
installSpread('violet', [50, 0, 100]);
installSpread('han', [25, 0, 100]);
installSpread('cyan', [0, 100, 100]);
installSpread('turquoise', [0, 100, 75]);
installSpread('sea', [0, 100, 50]);
installSpread('sky', [0, 75, 100]);
installSpread('azure', [0, 50, 100]);
installSpread('silver', [75, 75, 75]);
installSpread('gold', [100, 85, 0]);
