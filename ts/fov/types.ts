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

    onCellRevealed(x: number, y: number): void;
    redrawCell(x: number, y: number, clearMemory?: boolean): void;
    storeMemory(x: number, y: number): void;
}

export interface FovSystemType {
    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    fovChanged(x: number, y: number): boolean;

    changed: boolean;
    needsUpdate: boolean;
    copy(other: FovSystemType): void;

    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;

    revealAll(): void;
    revealCell(x: number, y: number, isMagicMapped: boolean): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;

    update(): boolean; // didSomething
}
