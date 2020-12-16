export interface FovStrategy {
    isBlocked: (x: number, y: number) => boolean;
    calcRadius: (x: number, y: number) => number;
    setVisible: (x: number, y: number, v: number) => void;
    hasXY: (x: number, y: number) => boolean;
}
export declare class FOV {
    protected _isBlocked: (x: number, y: number) => boolean;
    protected _calcRadius: (x: number, y: number) => number;
    protected _setVisible: (x: number, y: number, v: number) => void;
    protected _hasXY: (x: number, y: number) => boolean;
    protected _startX: number;
    protected _startY: number;
    protected _maxRadius: number;
    constructor(strategy: FovStrategy);
    calculate(x: number, y: number, maxRadius: number): void;
    castLight(row: number, startSlope: number, endSlope: number, xx: number, xy: number, yx: number, yy: number): void;
}
