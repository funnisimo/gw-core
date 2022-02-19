import * as BUFFER from '../buffer';

export interface BufferTarget {
    readonly width: number;
    readonly height: number;
    copyTo(dest: BUFFER.Buffer): void;
    draw(src: BUFFER.Buffer): boolean;
    toGlyph(ch: string | number): number;
}

export class Buffer extends BUFFER.Buffer {
    _target: BufferTarget;
    _parent?: Buffer;

    constructor(canvas: BufferTarget, parent?: Buffer) {
        super(canvas.width, canvas.height);
        this._target = canvas;
        this._parent = parent;

        canvas.copyTo(this);
    }

    // get canvas() { return this._target; }

    clone(): this {
        const other = new (<
            new (canvas: BufferTarget, parent?: Buffer) => this
        >this.constructor)(this._target, this._parent);
        other.copy(this);
        other.changed = false;
        return other;
    }

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
