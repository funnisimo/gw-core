import { cosmetic } from '../random';
// import { make as Make } from './gw';

export type ColorData =
    | [number, number, number]
    | [number, number, number, number, number, number, number]
    | [number, number, number, number, number, number, number, boolean];
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

export class Color extends Int16Array {
    public dances = false;
    public name?: string;

    constructor(
        r = -1,
        g = 0,
        b = 0,
        rand = 0,
        redRand = 0,
        greenRand = 0,
        blueRand = 0,
        dances = false
    ) {
        super(7);
        this.set([r, g, b, rand, redRand, greenRand, blueRand]);
        this.dances = dances;
    }

    get r() {
        return Math.round(this[0] * 2.550001);
    }
    protected get _r() {
        return this[0];
    }
    protected set _r(v: number) {
        this[0] = v;
    }

    get g() {
        return Math.round(this[1] * 2.550001);
    }
    protected get _g() {
        return this[1];
    }
    protected set _g(v: number) {
        this[1] = v;
    }

    get b() {
        return Math.round(this[2] * 2.550001);
    }
    protected get _b() {
        return this[2];
    }
    protected set _b(v: number) {
        this[2] = v;
    }

    protected get _rand() {
        return this[3];
    }
    protected get _redRand() {
        return this[4];
    }
    protected get _greenRand() {
        return this[5];
    }
    protected get _blueRand() {
        return this[6];
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

    isNull() {
        return this._r < 0;
    }

    equals(other: Color | ColorBase) {
        if (typeof other === 'string') {
            if (!other.startsWith('#')) return this.name == other;
            return this.css(other.length > 4) == other;
        } else if (typeof other === 'number') {
            return this.toInt() == other || this.toInt(true) == other;
        }
        const O = from(other);
        if (this.isNull()) return O.isNull();
        return this.every((v: number, i: number) => {
            return v == O[i];
        });
    }

    copy(other: Color | ColorBase) {
        if (other instanceof Color) {
            this.dances = other.dances;
        } else if (Array.isArray(other)) {
            if (other.length === 8) {
                this.dances = other[7];
            }
        } else {
            other = from(other);
            this.dances = other.dances;
        }
        for (let i = 0; i < this.length; ++i) {
            this[i] = (other[i] as number) || 0;
        }
        if (other instanceof Color) {
            this.name = other.name;
        } else {
            this._changed();
        }
        return this;
    }

    protected _changed() {
        this.name = undefined;
        return this;
    }

    clone() {
        // @ts-ignore
        const other = new this.constructor();
        other.copy(this);
        return other;
    }

    assign(
        _r = -1,
        _g = 0,
        _b = 0,
        _rand = 0,
        _redRand = 0,
        _greenRand = 0,
        _blueRand = 0,
        dances?: boolean
    ) {
        for (let i = 0; i < this.length; ++i) {
            this[i] = arguments[i] || 0;
        }
        if (dances !== undefined) {
            this.dances = dances;
        }
        return this._changed();
    }

    assignRGB(
        _r = -1,
        _g = 0,
        _b = 0,
        _rand = 0,
        _redRand = 0,
        _greenRand = 0,
        _blueRand = 0,
        dances?: boolean
    ) {
        for (let i = 0; i < this.length; ++i) {
            this[i] = Math.round((arguments[i] || 0) / 2.55);
        }
        if (dances !== undefined) {
            this.dances = dances;
        }
        return this._changed();
    }

    nullify() {
        this[0] = -1;
        this.dances = false;
        return this._changed();
    }

    blackOut() {
        for (let i = 0; i < this.length; ++i) {
            this[i] = 0;
        }
        this.dances = false;
        return this._changed();
    }

    toInt(base256 = false) {
        if (this.isNull()) return -1;
        if (!this.dances) {
            return toColorInt(this._r, this._g, this._b, base256);
        }
        const rand = cosmetic.number(this._rand);
        const redRand = cosmetic.number(this._redRand);
        const greenRand = cosmetic.number(this._greenRand);
        const blueRand = cosmetic.number(this._blueRand);
        const r = this._r + rand + redRand;
        const g = this._g + rand + greenRand;
        const b = this._b + rand + blueRand;
        return toColorInt(r, g, b, base256);
    }

    toLight(): LightValue {
        return [this._r, this._g, this._b];
    }

    clamp() {
        if (this.isNull()) return this;

        this._r = Math.min(100, Math.max(0, this._r));
        this._g = Math.min(100, Math.max(0, this._g));
        this._b = Math.min(100, Math.max(0, this._b));
        return this._changed();
    }

    mix(other: ColorBase, percent: number) {
        const O = from(other);
        if (O.isNull()) return this;
        if (this.isNull()) {
            this.blackOut();
        }
        percent = Math.min(100, Math.max(0, percent));
        const keepPct = 100 - percent;
        for (let i = 0; i < this.length; ++i) {
            this[i] = Math.round((this[i] * keepPct + O[i] * percent) / 100);
        }
        this.dances = this.dances || O.dances;
        return this._changed();
    }

    // Only adjusts r,g,b
    lighten(percent: number) {
        if (this.isNull()) return this;

        percent = Math.min(100, Math.max(0, percent));
        if (percent <= 0) return;

        const keepPct = 100 - percent;
        for (let i = 0; i < 3; ++i) {
            this[i] = Math.round((this[i] * keepPct + 100 * percent) / 100);
        }
        return this._changed();
    }

    // Only adjusts r,g,b
    darken(percent: number) {
        if (this.isNull()) return this;

        percent = Math.min(100, Math.max(0, percent));
        if (percent <= 0) return;

        const keepPct = 100 - percent;
        for (let i = 0; i < 3; ++i) {
            this[i] = Math.round((this[i] * keepPct + 0 * percent) / 100);
        }
        return this._changed();
    }

    bake(clearDancing = false) {
        if (this.isNull()) return this;

        if (this.dances && !clearDancing) return;
        this.dances = false;

        const d = this;
        if (d[3] + d[4] + d[5] + d[6]) {
            const rand = cosmetic.number(this._rand);
            const redRand = cosmetic.number(this._redRand);
            const greenRand = cosmetic.number(this._greenRand);
            const blueRand = cosmetic.number(this._blueRand);
            this._r += rand + redRand;
            this._g += rand + greenRand;
            this._b += rand + blueRand;
            for (let i = 3; i < this.length; ++i) {
                this[i] = 0;
            }
            return this._changed();
        }
        return this;
    }

    // Adds a color to this one
    add(other: ColorBase, percent: number = 100) {
        const O = from(other);
        if (O.isNull()) return this;
        if (this.isNull()) {
            this.blackOut();
        }

        for (let i = 0; i < this.length; ++i) {
            this[i] += Math.round((O[i] * percent) / 100);
        }
        this.dances = this.dances || O.dances;
        return this._changed();
    }

    scale(percent: number) {
        if (this.isNull() || percent == 100) return this;

        percent = Math.max(0, percent);
        for (let i = 0; i < this.length; ++i) {
            this[i] = Math.round((this[i] * percent) / 100);
        }
        return this._changed();
    }

    multiply(other: ColorData | Color) {
        if (this.isNull()) return this;
        let data = other as Int16Array;
        if (!Array.isArray(other)) {
            if (other.isNull()) return this;
            data = other;
        }

        const len = Math.max(3, Math.min(this.length, data.length));
        for (let i = 0; i < len; ++i) {
            this[i] = Math.round((this[i] * (data[i] || 0)) / 100);
        }
        return this._changed();
    }

    // scales rgb down to a max of 100
    normalize() {
        if (this.isNull()) return this;
        const max = Math.max(this._r, this._g, this._b);
        if (max <= 100) return this;
        this._r = Math.round((100 * this._r) / max);
        this._g = Math.round((100 * this._g) / max);
        this._b = Math.round((100 * this._b) / max);
        return this._changed();
    }

    /**
     * Returns the css code for the current RGB values of the color.
     * @param base256 - Show in base 256 (#abcdef) instead of base 16 (#abc)
     */
    css(base256 = false) {
        const v = this.toInt(base256);
        return '#' + v.toString(16).padStart(base256 ? 6 : 3, '0');
    }

    toString(base256 = false) {
        if (this.name) return this.name;
        if (this.isNull()) return 'null color';
        return this.css(base256);
    }
}

export function fromArray(vals: ColorData, base256 = false) {
    while (vals.length < 3) vals.push(0);
    if (base256) {
        for (let i = 0; i < 7; ++i) {
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

export function fromNumber(val: number, base256 = false) {
    const c = new Color();
    for (let i = 0; i < c.length; ++i) {
        c[i] = 0;
    }
    if (val < 0) {
        c.assign(-1);
    } else if (base256 || val > 0xfff) {
        c.assign(
            Math.round((((val & 0xff0000) >> 16) * 100) / 255),
            Math.round((((val & 0xff00) >> 8) * 100) / 255),
            Math.round(((val & 0xff) * 100) / 255)
        );
    } else {
        c.assign(
            Math.round((((val & 0xf00) >> 8) * 100) / 15),
            Math.round((((val & 0xf0) >> 4) * 100) / 15),
            Math.round(((val & 0xf) * 100) / 15)
        );
    }
    return c;
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
        return arg.clone();
    }
    if (typeof arg === 'string') {
        if (arg.startsWith('#')) {
            return fromCss(arg);
        }
        return fromName(arg).clone();
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
export function separate(a: Color, b: Color) {
    if (a.isNull() || b.isNull()) return;

    const A = a.clone().clamp();
    const B = b.clone().clamp();

    // console.log('separate');
    // console.log('- a=%s, h=%d, s=%d, l=%d', A.toString(), A.h, A.s, A.l);
    // console.log('- b=%s, h=%d, s=%d, l=%d', B.toString(), B.h, B.s, B.l);

    let hDiff = Math.abs(A.h - B.h);
    if (hDiff > 180) {
        hDiff = 360 - hDiff;
    }
    if (hDiff > 45) return; // colors are far enough apart in hue to be distinct

    const dist = 40;
    if (Math.abs(A.l - B.l) >= dist) return;

    // Get them sorted by saturation ( we will darken the more saturated color and lighten the other)
    const [lo, hi] = [A, B].sort((a, b) => a.s - b.s);

    // console.log('- lo=%s, hi=%s', lo.toString(), hi.toString());

    while (hi.l - lo.l < dist) {
        hi.mix(WHITE, 5);
        lo.mix(BLACK, 5);
    }

    a.copy(A);
    b.copy(B);
    // console.log('=>', a.toString(), b.toString());
}

export function swap(a: Color, b: Color) {
    const temp = a.clone();
    a.copy(b);
    b.copy(temp);
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

export function install(name: string, info: ColorBase): Color;
export function install(name: string, ...rgb: ColorData): Color; // TODO - Remove!
export function install(name: string, ...args: any[]) {
    let info = args;
    if (args.length == 1) {
        info = args[0];
    }
    const c = info instanceof Color ? info : make(info as ColorBase);
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
    install('light_' + name, c.clone().lighten(25));
    install('lighter_' + name, c.clone().lighten(50));
    install('lightest_' + name, c.clone().lighten(75));
    install('dark_' + name, c.clone().darken(25));
    install('darker_' + name, c.clone().darken(50));
    install('darkest_' + name, c.clone().darken(75));
    return c;
}

export const NONE = install('NONE', -1);
const BLACK = install('black', 0x000);
const WHITE = install('white', 0xfff);

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
