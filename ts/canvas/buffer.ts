import * as Base from '../buffer';

export interface BufferTarget {
    readonly width: number;
    readonly height: number;
    copyTo(dest: Base.Buffer): void;
    draw(src: Base.Buffer): void;
    toGlyph(ch: string | number): number;
}

export class Buffer extends Base.Buffer {
    _target: BufferTarget;
    _parent: Buffer | null = null;

    constructor(canvas: BufferTarget, parent?: Buffer) {
        super(canvas.width, canvas.height);
        this._target = canvas;
        this._parent = parent || null;

        canvas.copyTo(this);
    }

    // get canvas() { return this._target; }

    // clone(): this {
    //     const other = new (<new (canvas: BufferTarget) => this>(
    //         this.constructor
    //     ))(this._target);
    //     other.copy(this);
    //     return other;
    // }

    toGlyph(ch: string | number) {
        return this._target.toGlyph(ch);
    }

    render() {
        this._target.draw(this);
        return this;
    }

    // load() {
    //     this._target.copyTo(this);
    //     return this;
    // }

    reset() {
        if (this._parent) {
            this.copy(this._parent);
        } else {
            this.fill(0);
        }
    }
}
