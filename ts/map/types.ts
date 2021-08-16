import { Chain } from '../utils/chain';
import { GameObject } from '../gameObject/gameObject';
import { Tile } from '../tile';
import { LightType } from '../light/types';
import { Mixer } from '../sprite';
import { EffectCtx } from '../effect/types';
import { LightSystemType } from '../light/types';
import { FovSystemType } from '../fov/types';

export interface CellFlags {
    cell: number;
}

export interface MapFlags {
    map: number;
}

export interface SetOptions {
    superpriority: boolean;
    blockedByOtherLayers: boolean;
    blockedByActors: boolean;
    blockedByItems: boolean;
    volume: number;
}

export type SetTileOptions = Partial<SetOptions>;

export interface CellType {
    flags: CellFlags;
    tileFlags(): number;
    tileMechFlags(): number;
    objects: Chain<GameObject>;
    chokeCount: number;

    // Tiles

    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;

    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;

    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile;

    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    blocksLayer(depth: number): boolean;
    isPassable(): boolean;

    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;

    // @returns - whether or not the change results in a change to the cell lighting.
    setTile(tile: Tile): boolean;
    clear(): void;
    clearLayer(depth: number): boolean;

    hasTile(tile?: string | number | Tile): boolean;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;

    isEmpty(): boolean;
    isWall(): boolean;

    // Lights

    eachGlowLight(cb: (light: LightType) => any): void;

    // Effects

    activate(
        event: string,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<EffectCtx>
    ): Promise<boolean> | boolean;

    hasEffect(name: string): boolean;

    // // Items

    hasItem(): boolean;

    // // Actors

    hasActor(): boolean;

    redraw(): void;
    needsRedraw: boolean;

    clearMemory(): void;
    storeMemory(): void;

    getSnapshot(dest: Mixer): void;
    putSnapshot(src: Mixer): void;
}

export type ObjectMatchFn = (obj: GameObject) => boolean;
export type ObjectFn = (obj: GameObject) => any;

export interface ObjectListType {
    at(x: number, y: number, cb: ObjectMatchFn): GameObject | null;

    has(obj: GameObject): boolean;

    add(x: number, y: number, obj: GameObject): boolean;
    remove(obj: GameObject): boolean;

    move(obj: GameObject, x: number, y: number): boolean;

    forEach(cb: ObjectFn): void;
    forEachAt(x: number, y: number, cb: ObjectFn): void;
}

export type EachCellCb = (
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) => void;
export type MapTestFn = (
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) => boolean;

export interface MapType {
    readonly width: number;
    readonly height: number;

    readonly objects: ObjectListType;

    light: LightSystemType;
    fov: FovSystemType;
    properties: Record<string, any>;

    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;

    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;

    hasItem(x: number, y: number): boolean;

    // Actors

    hasActor(x: number, y: number): boolean;

    // Information

    isVisible(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    blocksMove(x: number, y: number): boolean;

    isStairs(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    isPassable(x: number, y: number): boolean;

    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;

    // flags

    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;

    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasCellFlag(x: number, y: number, flag: number): boolean;

    hasObjectFlag(x: number, y: number, flag: number): boolean;
    hasTileFlag(x: number, y: number, flag: number): boolean;

    fill(tile: string, boundary?: string): void;

    setTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        opts?: SetTileOptions
    ): boolean;

    hasTile(x: number, y: number, tile: string | number | Tile): boolean;

    update(dt: number): Promise<void>;

    getAppearanceAt(x: number, y: number, dest: Mixer): void;
}
