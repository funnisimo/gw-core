import * as BUFFER from '../buffer';

export interface BufferTarget {
    readonly width: number;
    readonly height: number;

    toGlyph(ch: string): number;
    copy(buffer: Buffer): void;
    copyTo(buffer: Buffer): void;
}

export class Buffer extends BUFFER.Buffer {
    _layer: BufferTarget;

    constructor(layer: BufferTarget) {
        super(layer.width, layer.height);
        this._layer = layer;
        layer.copyTo(this);
    }

    // get canvas() { return this._target; }

    toGlyph(ch: string | number) {
        if (typeof ch === 'number') return ch;
        return this._layer.toGlyph(ch);
    }

    render() {
        this._layer.copy(this);
        return this;
    }

    copyFromLayer() {
        this._layer.copyTo(this);
        return this;
    }
}
