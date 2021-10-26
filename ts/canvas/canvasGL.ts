import * as shaders from './shaders';
import { Glyphs } from './glyphs';

import * as Buffer from './buffer';
import * as Canvas from './canvas';

type GL = WebGL2RenderingContext;
const VERTICES_PER_TILE = 6;

// export class BufferGL extends Buffer.Buffer {
//     constructor(canvas: Buffer.BufferTarget) {
//         super(canvas);
//     }

//     protected _makeData(): Uint32Array {
//         return new Uint32Array(this.width * this.height * VERTICES_PER_TILE);
//     }

//     protected _index(x: number, y: number): number {
//         let index = y * this.width + x;
//         index *= VERTICES_PER_TILE;
//         return index;
//     }

//     set(x: number, y: number, style: number): boolean {
//         let index = this._index(x, y);
//         const current = this._data[index + 2];
//         if (current !== style) {
//             this._data[index + 2] = style;
//             this._data[index + 5] = style;
//             this.changed = true;
//             return true;
//         }
//         return false;
//     }

//     copy(other: Buffer.DataBuffer): this {
//         if (this.height !== other.height || this.width !== other.width)
//             throw new Error('Buffers must be same size!');

//         if (this._data.length === other._data.length) {
//             this._data.set(other._data);
//         } else {
//             for (let x = 0; x < this.width; ++x) {
//                 for (let y = 0; y < this.width; ++y) {
//                     this.set(x, y, other.get(x, y));
//                 }
//             }
//         }

//         this.changed = true;
//         return this;
//     }
// }

// Based on: https://github.com/ondras/fastiles/blob/master/ts/scene.ts (v2.1.0)

export class CanvasGL extends Canvas.BaseCanvas {
    private _gl!: GL;
    private _buffers!: {
        position?: WebGLBuffer;
        uv?: WebGLBuffer;
        style?: WebGLBuffer;
    };
    private _attribs!: Record<string, number>;
    private _uniforms!: Record<string, WebGLUniformLocation>;
    private _texture!: WebGLTexture;

    constructor(width: number, height: number, glyphs: Glyphs) {
        super(width, height, glyphs);
    }

    // _createBuffer() {
    //     return new BufferGL(this);
    // }

    protected _createContext() {
        let gl = this.node.getContext('webgl2');
        if (!gl) {
            throw new Canvas.NotSupportedError('WebGL 2 not supported');
        }
        this._gl = gl;
        this._buffers = {};
        this._attribs = {};
        this._uniforms = {};

        const p = createProgram(gl, shaders.VS, shaders.FS);
        gl.useProgram(p);
        const attributeCount = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; i++) {
            gl.enableVertexAttribArray(i);
            let info = gl.getActiveAttrib(p, i) as WebGLActiveInfo;
            this._attribs[info.name] = i;
        }
        const uniformCount = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let info = gl.getActiveUniform(p, i) as WebGLActiveInfo;
            this._uniforms[info.name] = gl.getUniformLocation(
                p,
                info.name
            ) as WebGLUniformLocation;
        }
        gl.uniform1i(this._uniforms['font'], 0);
        this._texture = createTexture(gl);
    }

    private _createGeometry() {
        const gl = this._gl;
        this._buffers.position && gl.deleteBuffer(this._buffers.position);
        this._buffers.uv && gl.deleteBuffer(this._buffers.uv);
        let buffers = createGeometry(
            gl,
            this._attribs,
            this.width,
            this.height
        );
        Object.assign(this._buffers, buffers);
    }

    private _createData() {
        const gl = this._gl;
        const attribs = this._attribs;
        const tileCount = this.width * this.height;
        this._buffers.style && gl.deleteBuffer(this._buffers.style);
        this._data = new Uint32Array(tileCount * VERTICES_PER_TILE);
        const style = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, style);
        gl.vertexAttribIPointer(attribs['style'], 1, gl.UNSIGNED_INT, 0, 0);
        Object.assign(this._buffers, { style });
    }

    protected _setGlyphs(glyphs: Glyphs) {
        if (!super._setGlyphs(glyphs)) return false;
        const gl = this._gl;
        const uniforms = this._uniforms;
        gl.uniform2uiv(uniforms['tileSize'], [this.tileWidth, this.tileHeight]);

        this._uploadGlyphs();
        return true;
    }

    _uploadGlyphs() {
        if (!this._glyphs.needsUpdate) return;

        const gl = this._gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this._glyphs.node
        );
        this._requestRender();
        this._glyphs.needsUpdate = false;
    }

    resize(width: number, height: number) {
        super.resize(width, height);
        const gl = this._gl;
        const uniforms = this._uniforms;
        gl.viewport(0, 0, this.node.width, this.node.height);
        gl.uniform2ui(
            uniforms['viewportSize'],
            this.node.width,
            this.node.height
        );
        // this._data = new Uint32Array(width * height * VERTICES_PER_TILE);
        this._createGeometry();
        this._createData();
    }

    // protected _set(x: number, y: number, style: number) {
    //     let index = y * this.width + x;
    //     index *= VERTICES_PER_TILE;

    //     const current = this._data[index + 2];
    //     if (current !== style) {
    //         this._data[index + 2] = style;
    //         this._data[index + 5] = style;
    //         this._requestRender();
    //         return true;
    //     }
    //     return false;
    // }

    draw(data: Buffer.DataBuffer): boolean {
        // TODO - remove?
        if (
            data._data.every((style, i) => {
                const index = 2 + i * VERTICES_PER_TILE;
                return style === this._data[index];
            })
        ) {
            return false;
        }
        data._data.forEach((style, i) => {
            const index = i * VERTICES_PER_TILE;
            this._data[index + 2] = style;
            this._data[index + 5] = style;
        });
        this._requestRender();
        data.changed = false;
        return true;
    }

    copyTo(data: Buffer.DataBuffer) {
        data.changed = false;
        const n = this.width * this.height;
        for (let i = 0; i < n; ++i) {
            const index = i * VERTICES_PER_TILE;
            data._data[i] = this._data[index + 2];
        }
    }

    _render() {
        const gl = this._gl;

        if (this._glyphs.needsUpdate) {
            // auto keep glyphs up to date
            this._uploadGlyphs();
        } else if (!this._renderRequested) {
            return;
        }

        this._renderRequested = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.style!);
        gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.DYNAMIC_DRAW);
        gl.drawArrays(
            gl.TRIANGLES,
            0,
            this._width * this._height * VERTICES_PER_TILE
        );
        this.buffer.changed = false;
    }
}

// Copy of: https://github.com/ondras/fastiles/blob/master/ts/utils.ts (v2.1.0)

const QUAD = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];

function createProgram(gl: GL, ...sources: string[]) {
    const p = gl.createProgram() as WebGLProgram;

    [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, index) => {
        const shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, sources[index]);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) as string);
        }
        gl.attachShader(p, shader);
    });

    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p) as string);
    }

    return p;
}

function createTexture(gl: GL) {
    let t = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return t;
}

function createGeometry(
    gl: GL,
    attribs: Record<string, number>,
    width: number,
    height: number
) {
    let tileCount = width * height;
    let positionData = new Uint16Array(tileCount * QUAD.length);
    let uvData = new Uint8Array(tileCount * QUAD.length);
    let i = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            QUAD.forEach((value) => {
                positionData[i] = (i % 2 ? y : x) + value;
                uvData[i] = value;
                i++;
            });
        }
    }

    const position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribIPointer(attribs['position'], 2, gl.UNSIGNED_SHORT, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

    const uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.vertexAttribIPointer(attribs['uv'], 2, gl.UNSIGNED_BYTE, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);

    return { position, uv };
}
