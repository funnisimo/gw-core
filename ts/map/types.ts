import { Actor } from '../actor';
import { Item } from '../item';
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

export interface CellInfoType {
    chokeCount: number;

    // Flags

    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;

    cellFlags(): number;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;

    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;

    isWall(): boolean;
    isStairs(): boolean;

    // Tiles

    readonly tile: Tile;
    hasTile(tile: string | number | Tile): boolean;

    // Items

    hasItem(): boolean;
    readonly item: Item | null;

    // Actors

    hasActor(): boolean;
    hasPlayer(): boolean;
    readonly actor: Actor | null;

    // Info

    getDescription(): string;
    getFlavor(): string;
    getName(opts: any): string;
}

export interface CellType extends CellInfoType {
    flags: CellFlags;
    chokeCount: number;

    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;

    // Tiles

    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile;
    blocksLayer(depth: number): boolean;

    isPassable(): boolean;

    // @returns - whether or not the change results in a change to the cell lighting.
    setTile(tile: Tile): boolean;
    clear(): void;
    clearDepth(depth: number): boolean;

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
        ctx?: Partial<EffectCtx>
    ): Promise<boolean> | boolean;

    hasEffect(name: string): boolean;

    // redraw(): void;
    needsRedraw: boolean;
}

export type EachCellCb = (
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) => any;

export type EachItemCb = (item: Item) => any;
export type EachActorCb = (actor: Actor) => any;

export type MapTestFn = (
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) => boolean;

export interface MapType {
    readonly width: number;
    readonly height: number;

    light: LightSystemType;
    fov: FovSystemType;
    properties: Record<string, any>;

    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;

    cellInfo(x: number, y: number, useMemory?: boolean): CellInfoType;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;

    // Items

    // itemAt(x: number, y: number): Item | null;
    eachItem(cb: EachItemCb): void;
    addItem(x: number, y: number, actor: Item): boolean;
    removeItem(actor: Item): boolean;
    moveItem(item: Item, x: number, y: number): boolean;

    // Actors

    // actorAt(x: number, y: number): Actor | null;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor): boolean;
    moveActor(actor: Actor, x: number, y: number): boolean;

    // Information

    isVisible(x: number, y: number): boolean;

    // hasCellFlag(x: number, y: number, flag: number): boolean;
    // hasObjectFlag(x: number, y: number, flag: number): boolean;
    // hasAllObjectFlags(x: number, y: number, flags: number): boolean;
    // hasTileFlag(x: number, y: number, flag: number): boolean;
    // hasAllTileFlags(x: number, y: number, flags: number): boolean;

    // cellFlags(x: number, y: number, useMemory?: boolean): number;
    // objectFlags(x: number, y: number, useMemory?: boolean): number;
    // tileFlags(x: number, y: number, useMemory?: boolean): number;
    // tileMechFlags(x: number, y: number, useMemory?: boolean): number;
    // itemFlags(x: number, y: number, useMemory?: boolean): number;
    // actorFlags(x: number, y: number, useMemory?: boolean): number;

    // blocksVision(x: number, y: number, useMemory?: boolean): boolean;
    // blocksPathing(x: number, y: number, useMemory?: boolean): boolean;
    // blocksMove(x: number, y: number, useMemory?: boolean): boolean;
    // blocksEffects(x: number, y: number, useMemory?: boolean): boolean;

    // Tiles

    // hasTile(x: number, y: number, tile: string | number | Tile, useMemory?: boolean): boolean;

    // Items

    // hasItem(x: number, y: number, useMemory?: boolean): boolean;

    // Actors

    // hasActor(x: number, y: number, useMemory?: boolean): boolean;
    // hasPlayer(x: number, y: number, useMemory?: boolean): boolean;

    // Info

    // getDescription(x: number, y: number, useMemory?: boolean): string;
    // getFlavor(x: number, y: number, useMemory?: boolean): string;
    // getName(x: number, y: number, opts: any, useMemory?: boolean): string;

    // hasTile(x: number, y: number, tile: string | number | Tile, useMemory?: boolean): boolean;

    // isStairs(x: number, y: number, useMemory?: boolean): boolean;
    // isWall(x: number, y: number, useMemory?: boolean): boolean;
    // isPassable(x: number, y: number, useMemory?: boolean): boolean;

    // flags

    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;

    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;

    fill(tile: string, boundary?: string): void;

    setTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        opts?: SetTileOptions
    ): boolean;

    update(dt: number): Promise<void>;

    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;

    getAppearanceAt(x: number, y: number, dest: Mixer): void;
}
