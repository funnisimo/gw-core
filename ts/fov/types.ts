// import { FovFlags } from './flags';

export interface FovStrategy {
    isBlocked(x: number, y: number): boolean;
    calcRadius?(x: number, y: number): number;
    hasXY?(x: number, y: number): boolean;
    debug?(...args: any[]): void;
}

export type SetVisibleFn = (x: number, y: number, v: number) => void;

export type ViewportCb = (
    x: number,
    y: number,
    radius: number,
    type: number
) => void;

export interface FovSite {
    readonly width: number;
    readonly height: number;

    // usesFov(): boolean;
    // fovChanged(): boolean;

    // hasObjectFlag(x: number, y: number, flag: number): boolean;

    // setCellFlag(x: number, y: number, flag: number): void;
    // clearCellFlag(x: number, y: number, flag: number): void;
    // hasCellFlag(x: number, y: number, flag: number): boolean;

    eachViewport(cb: ViewportCb): void;

    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;

    blocksVision(x: number, y: number): boolean;

    // onCellRevealed(x: number, y: number): void;
    // redrawCell(x: number, y: number, clearMemory?: boolean): void;
    // storeMemory(x: number, y: number): void;
}

export interface FovSubject {
    readonly x: number;
    readonly y: number;
    readonly visionDistance: number;
}

export interface FovTracker {
    follow: FovSubject | null;

    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;

    getFlag(x: number, y: number): number;

    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;

    setCursor(x: number, y: number, keep?: boolean): void;
    clearCursor(x?: number, y?: number): void;
    isCursor(x: number, y: number): boolean;

    setHighlight(x: number, y: number, keep?: boolean): void;
    clearHighlight(x?: number, y?: number): void;
    isHighlight(x: number, y: number): boolean;

    revealAll(): void;
    revealCell(
        x: number,
        y: number,
        radius?: number,
        makeVisibleToo?: boolean
    ): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;

    update(): boolean; // didSomething
    updateFor(subject: FovSubject): boolean; // didSomething
    update(x: number, y: number, r?: number): boolean; // didSomething
}
