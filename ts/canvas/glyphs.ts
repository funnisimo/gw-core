type CTX = CanvasRenderingContext2D;
type DrawFunction = (
    ctx: CTX,
    x: number,
    y: number,
    width: number,
    height: number
) => void;
type DrawType = string | DrawFunction;

export type GlyphInitFn = (g: Glyphs, basic?: boolean) => void;

export interface GlyphOptions {
    font?: string;

    fontSize?: number;
    size?: number; // alias for fontSize

    tileWidth?: number;
    tileHeight?: number;

    init?: GlyphInitFn;
    basicOnly?: boolean;
    basic?: boolean; // alias for basicOnly
}

export class Glyphs {
    _node: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _tileWidth: number = 12;
    _tileHeight: number = 16;
    needsUpdate: boolean = true;
    _toGlyph: Record<string, number> = {};
    _toChar: string[] = [];

    static fromImage(src: string | HTMLImageElement) {
        if (typeof src === 'string') {
            if (src.startsWith('data:'))
                throw new Error(
                    'Glyph: You must load a data string into an image element and use that.'
                );

            const el = document.getElementById(src);
            if (!el)
                throw new Error(
                    'Glyph: Failed to find image element with id:' + src
                );
            src = el as HTMLImageElement;
        }

        const glyph = new this({
            tileWidth: src.width / 16,
            tileHeight: src.height / 16,
        });
        glyph._ctx.drawImage(src, 0, 0);
        return glyph;
    }

    static fromFont(src: GlyphOptions | string) {
        if (typeof src === 'string') {
            src = { font: src } as GlyphOptions;
        }

        const glyphs = new this(src);
        const basicOnly = src.basicOnly || src.basic || false;
        const initFn = src.init || initGlyphs;
        initFn(glyphs, basicOnly);
        return glyphs;
    }

    private constructor(opts: GlyphOptions = {}) {
        opts.font = opts.font || 'monospace';

        this._node = document.createElement('canvas');
        this._ctx = this.node.getContext('2d') as CanvasRenderingContext2D;

        this._configure(opts);
    }

    get node() {
        return this._node;
    }
    get ctx() {
        return this._ctx;
    }
    get tileWidth() {
        return this._tileWidth;
    }
    get tileHeight() {
        return this._tileHeight;
    }
    get pxWidth() {
        return this._node.width;
    }
    get pxHeight() {
        return this._node.height;
    }

    forChar(ch: string) {
        if (!ch || !ch.length) return -1;
        return this._toGlyph[ch] || -1;
    }

    toChar(n: number): string {
        return this._toChar[n] || ' ';
    }

    private _configure(opts: GlyphOptions) {
        this._tileWidth = opts.tileWidth || this.tileWidth;
        this._tileHeight = opts.tileHeight || this.tileHeight;

        this.node.width = 16 * this.tileWidth;
        this.node.height = 16 * this.tileHeight;

        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(0, 0, this.pxWidth, this.pxHeight);

        const size =
            opts.fontSize ||
            opts.size ||
            Math.min(this.tileWidth, this.tileHeight);
        this._ctx.font = '' + size + 'px ' + opts.font;
        this._ctx.textAlign = 'center';
        this._ctx.textBaseline = 'middle';
        this._ctx.fillStyle = 'white';
    }

    draw(n: number, ch: DrawType) {
        if (n >= 256) throw new Error('Cannot draw more than 256 glyphs.');
        const x = (n % 16) * this.tileWidth;
        const y = Math.floor(n / 16) * this.tileHeight;
        const cx = x + Math.floor(this.tileWidth / 2);
        const cy = y + Math.floor(this.tileHeight / 2);

        this._ctx.save();

        this._ctx.beginPath();
        this._ctx.rect(x, y, this.tileWidth, this.tileHeight);
        this._ctx.clip();
        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(x, y, this.tileWidth, this.tileHeight);
        this._ctx.fillStyle = 'white';

        if (typeof ch === 'function') {
            ch(this._ctx, x, y, this.tileWidth, this.tileHeight);
        } else {
            if (this._toGlyph[ch] === undefined) this._toGlyph[ch] = n;
            this._toChar[n] = ch;
            this._ctx.fillText(ch, cx, cy);
        }

        this._ctx.restore();
        this.needsUpdate = true;
    }
}

export function initGlyphs(
    glyphs: { draw: (n: number, ch: string) => void },
    basicOnly = false
) {
    for (let i = 32; i < 127; ++i) {
        glyphs.draw(i, String.fromCharCode(i));
    }

    [
        ' ', // ' '
        '\u263a', // ☺ - smiley hollow
        '\u263b', // ☻ - smiley filled
        '\u2665', // ♥ - hearts
        '\u2666', // ♦ - diamonds
        '\u2663', // ♣ - clubs
        '\u2660', // ♠ - spades
        '\u263c', // ☼ - sun hollow
        '\u2600', // ☀ - sun filled
        '\u2606', // ☆ - star hollow
        '\u2605', // ★ - star filled
        '\u2023', // ‣ - bullet triangle
        '\u2219', // ∙ - bullet square !!!!
        '\u2043', // ⁃ - bullet hyphen
        '\u2022', // • - bullet circle
        '\u2630', // ☰ - trigram - hamburger menu
        '\u2637', // ☷ - trigram split

        '\u2610', // ☐ - unchecked
        '\u2611', // ☑ - checked
        '\u2612', // ☒ - checked - with X
        '\u26ac', // ⚬ - radio - off
        '\u29bf', // ⦿ - radio - on

        '\u2191', // ↑ - up arrow
        '\u2192', // → - right arrow
        '\u2193', // ↓ - down arrow
        '\u2190', // ← - left arrow
        '\u2194', // ↔ - left+right arrow
        '\u2195', // ↕ - up+down arrow
        '\u25b2', // ▲ - big up arrow
        '\u25b6', // ▶ - big right arrow
        '\u25bc', // ▼ - big down arrow
        '\u25c0', // ◀ - big left arrow
    ].forEach((ch, i) => {
        glyphs.draw(i, ch);
    });

    if (!basicOnly) {
        [
            '\u2302', // ⌂
            '\u00C7', // Ç
            '\u00FC', // ü
            '\u00E9', // é
            '\u00E2', // â
            '\u00E4', // ä
            '\u00E0', // à
            '\u00E5', // å
            '\u00E7', // ç
            '\u00EA', // ê
            '\u00EB', // ë
            '\u00E8', // è
            '\u00EF', // ï
            '\u00EE', // î
            '\u00EC', // ì
            '\u00C4', // Ä
            '\u00C5', // Å

            '\u00C9', // É
            '\u00E6', // æ
            '\u00C6', // Æ
            '\u00F4', // ô
            '\u00F6', // ö
            '\u00F2', // ò
            '\u00FB', // û
            '\u00F9', // ù
            '\u00FF', // ÿ
            '\u00D6', // Ö
            '\u00DC', // Ü
            '\u00A2', // ¢
            '\u00A3', // £
            '\u00A5', // ¥
            '\u20A7', // ₧
            '\u0192', // ƒ

            '\u00E1', // á
            '\u00ED', // í
            '\u00F3', // ó
            '\u00FA', // ú
            '\u00F1', // ñ
            '\u00D1', // Ñ
            '\u00AA', // ª
            '\u00BA', // º
            '\u00BF', // ¿
            '\u2310', // ⌐
            '\u00AC', // ¬
            '\u00BD', // ½
            '\u00BC', // ¼
            '\u00A1', // ¡
            '\u00AB', // «
            '\u00BB', // »

            '\u2591', // ░
            '\u2592', // ▒
            '\u2593', // ▓
            '\u2502', // │
            '\u2524', // ┤
            '\u2561', // ╡
            '\u2562', // ╢
            '\u2556', // ╖
            '\u2555', // ╕
            '\u2563', // ╣
            '\u2551', // ║
            '\u2557', // ╗
            '\u255D', // ╝
            '\u255C', // ╜
            '\u255B', // ╛
            '\u2510', // ┐

            '\u2514', // └
            '\u2534', // ┴
            '\u252C', // ┬
            '\u251C', // ├
            '\u2500', // ─
            '\u253C', // ┼
            '\u255E', // ╞
            '\u255F', // ╟
            '\u255A', // ╚
            '\u2554', // ╔
            '\u2569', // ╩
            '\u2566', // ╦
            '\u2560', // ╠
            '\u2550', // ═
            '\u256C', // ╬
            '\u2567', // ╧

            '\u2568', // ╨
            '\u2564', // ╤
            '\u2565', // ╥
            '\u2559', // ╙
            '\u2558', // ╘
            '\u2552', // ╒
            '\u2553', // ╓
            '\u256B', // ╫
            '\u256A', // ╪
            '\u2518', // ┘
            '\u250C', // ┌
            '\u2588', // █
            '\u2584', // ▄
            '\u258C', // ▌
            '\u2590', // ▐
            '\u2580', // ▀

            '\u03B1', // α
            '\u00DF', // ß
            '\u0393', // Γ
            '\u03C0', // π
            '\u03A3', // Σ
            '\u03C3', // σ
            '\u00B5', // µ
            '\u03C4', // τ
            '\u03A6', // Φ
            '\u0398', // Θ
            '\u03A9', // Ω
            '\u03B4', // δ
            '\u221E', // ∞
            '\u03C6', // φ
            '\u03B5', // ε
            '\u2229', // ∩

            '\u2261', // ≡
            '\u00B1', // ±
            '\u2265', // ≥
            '\u2264', // ≤
            '\u2320', // ⌠
            '\u2321', // ⌡
            '\u00F7', // ÷
            '\u2248', // ≈
            '\u00B0', // °
            '\u2219', // ∙
            '\u00B7', // ·
            '\u221A', // √
            '\u207F', // ⁿ
            '\u00B2', // ²
            '\u25A0', // ■
            '\u00A7', // §
        ].forEach((ch, i) => {
            glyphs.draw(i + 127, ch);
        });
    }
}
