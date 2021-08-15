import { MapType } from './types';
import * as Flags from './flags';
import * as Tile from '../tile';
import * as Entity from '../gameObject';
import * as Effect from '../effect';
import * as Flag from '../flag';
import * as Grid from '../grid';
import * as Utils from '../utils';
import { random } from '../random';

import { Actor } from '../actor';
import { Item } from '../item';

export interface SpawnConfig {
    tile: string;
    grow: number;
    decrement: number;
    matchTile: string;
    flags: Flag.FlagBase;
    volume: number;
    next: string;
}

export interface SpawnInfo {
    tile: string;
    grow: number;
    decrement: number;
    matchTile: string;
    flags: number;
    volume: number;
    next: string | null;
}

export class SpawnEffect implements Effect.EffectHandler {
    make(src: Partial<Effect.EffectConfig>, dest: Effect.EffectInfo): boolean {
        if (!src.tile) return true; // no error

        let config = src.tile;
        if (typeof config === 'string') {
            const parts = config.split(/[,|]/).map((p) => p.trim());
            config = {
                tile: parts[0],
                grow: Number.parseInt(parts[1] || '0'),
                decrement: Number.parseInt(parts[2] || '0'),
            };
        }

        const info = {
            grow: config.grow ?? config.spread ?? 0,
            decrement: config.decrement ?? 0,
            flags: Flag.from(Effect.Flags, config.flags),
            volume: config.volume ?? 0,
            next: config.next ?? null,
        } as SpawnInfo;

        const id = config.tile ?? config.id;

        if (typeof id === 'string') {
            info.tile = id;
        } else {
            throw new Error('Invalid tile spawn config: ' + id);
        }

        if (!info.tile) {
            throw new Error('Must have tile.');
        }

        const match = config.matchTile ?? config.match;

        if (typeof match === 'string') {
            info.matchTile = match;
        } else if (match) {
            throw new Error(
                'Invalid tile spawn match tile: ' + config.matchTile
            );
        }

        dest.tile = info;
        return true;
    }

    async fire(
        effect: Effect.EffectInfo,
        map: MapType,
        x: number,
        y: number,
        ctx: Effect.EffectCtx
    ): Promise<boolean> {
        if (!effect.tile) return false; // did nothing

        const id = effect.tile.tile;
        const tile = Tile.tiles[id] || null;
        if (!tile) {
            throw new Error('Failed to find tile for effect: ' + id);
        }

        const abortIfBlocking = !!(
            effect.flags & Effect.Flags.E_ABORT_IF_BLOCKS_MAP
        );
        const isBlocking = !!(
            abortIfBlocking &&
            !(effect.flags & Effect.Flags.E_PERMIT_BLOCKING) &&
            (tile.blocksPathing() ||
                effect.flags & Effect.Flags.E_TREAT_AS_BLOCKING)
        );

        let didSomething = false;

        didSomething = computeSpawnMap(effect, map, x, y, ctx);

        if (!didSomething) {
            return false;
        }

        if (
            abortIfBlocking &&
            isBlocking &&
            this.mapDisruptedBy(map, effect.grid)
        ) {
            // Grid.free(spawnMap);
            return false;
        }

        if (effect.flags & Effect.Flags.E_EVACUATE_CREATURES) {
            // first, evacuate creatures, so that they do not re-trigger the tile.
            if (evacuateCreatures(map, ctx.grid!)) {
                didSomething = true;
            }
        }

        if (effect.flags & Effect.Flags.E_EVACUATE_ITEMS) {
            // first, evacuate items, so that they do not re-trigger the tile.
            if (evacuateItems(map, ctx.grid!)) {
                didSomething = true;
            }
        }

        if (effect.flags & Effect.Flags.E_CLEAR_CELL) {
            // first, clear other tiles (not base/ground)
            if (clearCells(map, ctx.grid!, effect.flags)) {
                didSomething = true;
            }
        }

        const spawned = spawnTiles(
            effect.flags,
            ctx.grid,
            map as MapType,
            tile,
            effect.tile.volume
        );

        if (spawned) {
            didSomething = true;
            // await spawnMap.forEachAsync( (v, x, y) => {
            //     if (!v) return;
            //     await map.applyInstantEffects(x, y);
            // });

            // if (applyEffects) {
            // if (PLAYER.xLoc == i && PLAYER.yLoc == j && !PLAYER.status.levitating && refresh) {
            // 	flavorMessage(tileFlavor(PLAYER.xLoc, PLAYER.yLoc));
            // }
            // if (cell.actor || cell.item) {
            // 	for(let t of cell.tiles()) {
            // 		await t.applyInstantEffects(map, i, j, cell);
            // 		if (Data.gameHasEnded) {
            // 			return true;
            // 		}
            // 	}
            // }
            // if (tile.flags & TileFlags.T_IS_FIRE) {
            // 	if (cell.flags & CellFlags.HAS_ITEM) {
            // 		theItem = map.itemAt(i, j);
            // 		if (theItem.flags & Flags.Item.ITEM_FLAMMABLE) {
            // 			await burnItem(theItem);
            // 		}
            // 	}
            // }
            // }
        }

        // Grid.free(spawnMap);

        return didSomething;
    }

    mapDisruptedBy(
        map: MapType,
        blockingGrid: Grid.NumGrid,
        blockingToMapX = 0,
        blockingToMapY = 0
    ) {
        const walkableGrid = Grid.alloc(map.width, map.height);
        let disrupts = false;

        // Get all walkable locations after lake added
        Utils.forRect(map.width, map.height, (i, j) => {
            const lakeX = i + blockingToMapX;
            const lakeY = j + blockingToMapY;
            if (blockingGrid.get(lakeX, lakeY)) {
                if (map.isStairs(i, j)) {
                    disrupts = true;
                }
            } else if (!map.blocksMove(i, j)) {
                walkableGrid[i][j] = 1;
            }
        });

        let first = true;
        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                if (walkableGrid[i][j] == 1) {
                    if (first) {
                        walkableGrid.floodFill(i, j, 1, 2);
                        first = false;
                    } else {
                        disrupts = true;
                    }
                }
            }
        }

        // console.log('WALKABLE GRID');
        // walkableGrid.dump();

        Grid.free(walkableGrid);
        return disrupts;
    }
}

Effect.installType('tile', new SpawnEffect());

// tick

// Spawn

export function spawnTiles(
    flags: number,
    spawnMap: Grid.NumGrid,
    map: MapType,
    tile: Tile.Tile,
    volume = 0
) {
    let i, j;
    let accomplishedSomething;

    accomplishedSomething = false;

    const blockedByOtherLayers = flags & Effect.Flags.E_BLOCKED_BY_OTHER_LAYERS;
    const superpriority = flags & Effect.Flags.E_SUPERPRIORITY;
    // const applyEffects = ctx.refreshCell;
    volume = volume || 0; // (tile ? tile.volume : 0);

    for (i = 0; i < spawnMap.width; i++) {
        for (j = 0; j < spawnMap.height; j++) {
            if (!spawnMap[i][j]) continue; // If it's not flagged for building in the spawn map,
            // const isRoot = spawnMap[i][j] === 1;
            spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built

            const cell = map.cell(i, j);

            if (cell.hasTile(tile)) {
                // If the new cell already contains the fill terrain,
                // if (tile.depth == Entity.flags.Depth.GAS) {
                //     spawnMap[i][j] = 1;
                //     cell.gasVolume += volume;
                // } else if (tile.depth == Entity.flags.Depth.LIQUID) {
                //     spawnMap[i][j] = 1;
                //     cell.liquidVolume += volume;
                // }
            } else if (
                (superpriority ||
                    cell.depthPriority(tile.depth) < tile.priority) && // If the terrain in the layer to be overwritten has a higher priority number (unless superpriority),
                !cell.blocksLayer(tile.depth) && // If we will be painting into the surface layer when that cell forbids it,
                (!cell.hasItem() ||
                    !(flags & Effect.Flags.E_BLOCKED_BY_ITEMS)) &&
                (!cell.hasActor() ||
                    !(flags & Effect.Flags.E_BLOCKED_BY_ACTORS)) &&
                (!blockedByOtherLayers ||
                    cell.highestPriority() < tile.priority) // TODO - highestPriorityTile()
            ) {
                if (map.setTile(i, j, tile, volume)) {
                    // if the fill won't violate the priority of the most important terrain in this cell:
                    spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                    // map.redrawCell(cell);
                    // if (volume && cell.gas) {
                    //     cell.volume += (feat.volume || 0);
                    // }
                    cell.flags.cell |= Flags.Cell.EVENT_FIRED_THIS_TURN;
                    if (flags & Effect.Flags.E_PROTECTED) {
                        cell.flags.cell |= Flags.Cell.EVENT_PROTECTED;
                    }
                    accomplishedSomething = true;
                    // debug('- tile', i, j, 'tile=', tile.id);
                }
            }
        }
    }
    if (accomplishedSomething) {
        map.setMapFlag(Flags.Map.MAP_CHANGED);
    }
    return accomplishedSomething;
}

// Spread

function cellIsOk(
    effect: Effect.EffectInfo,
    map: MapType,
    x: number,
    y: number,
    isStart: boolean
) {
    if (!map.hasXY(x, y)) return false;
    const cell = map.cell(x, y);

    if (cell.hasCellFlag(Flags.Cell.EVENT_PROTECTED)) return false;

    if (cell.blocksEffects() && !effect.tile.matchTile && !isStart) {
        return false;
    }

    if (effect.flags & Effect.Flags.E_BUILD_IN_WALLS) {
        if (!map.isWall(x, y)) return false;
    } else if (effect.flags & Effect.Flags.E_MUST_TOUCH_WALLS) {
        let ok = false;
        Utils.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (map.isWall(i, j)) {
                    ok = true;
                }
            },
            true
        );
        if (!ok) return false;
    } else if (effect.flags & Effect.Flags.E_NO_TOUCH_WALLS) {
        let ok = true;
        if (map.isWall(x, y)) return false; // or on wall
        Utils.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (map.isWall(i, j)) {
                    ok = false;
                }
            },
            true
        );
        if (!ok) return false;
    }

    // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
    if (
        effect.tile.matchTile &&
        !isStart &&
        !cell.hasTile(effect.tile.matchTile)
    ) {
        return false;
    }

    return true;
}

export function computeSpawnMap(
    effect: Effect.EffectInfo,
    map: MapType,
    x: number,
    y: number,
    ctx: Effect.EffectCtx
) {
    let i, j, dir, t, x2, y2;
    let madeChange;

    // const bounds = ctx.bounds || null;
    // if (bounds) {
    //   // Activation.debug('- bounds', bounds);
    // }

    const config = effect.tile as SpawnInfo;

    let startProb = config.grow || 0;
    let probDec = config.decrement || 0;
    const spawnMap = ctx.grid;

    spawnMap.fill(0);

    if (!cellIsOk(effect, map, x, y, true)) {
        return false;
    }

    spawnMap[x][y] = t = 1; // incremented before anything else happens
    let count = 1;

    if (startProb) {
        madeChange = true;
        if (startProb >= 100) {
            probDec = probDec || 100;
        }

        if (probDec <= 0) {
            probDec = startProb;
        }
        while (madeChange && startProb > 0) {
            madeChange = false;
            t++;
            for (i = 0; i < map.width; i++) {
                for (j = 0; j < map.height; j++) {
                    if (spawnMap[i][j] == t - 1) {
                        for (dir = 0; dir < 4; dir++) {
                            x2 = i + Utils.DIRS[dir][0];
                            y2 = j + Utils.DIRS[dir][1];
                            if (
                                spawnMap.hasXY(x2, y2) &&
                                !spawnMap[x2][y2] &&
                                random.chance(startProb) &&
                                cellIsOk(effect, map, x2, y2, false)
                            ) {
                                spawnMap[x2][y2] = t;
                                madeChange = true;
                                ++count;
                            }
                        }
                    }
                }
            }
            startProb -= probDec;
        }
    }

    return count > 0;
}

// export function spreadCircle(
//     this: any,
//     ctx: Effect.EffectCtx,
//     spawnMap: Grid.NumGrid
// ) {
//     const x = ctx.x;
//     const y = ctx.y;
//     let startProb = this.spread || 0;
//     let probDec = this.decrement || 0;

//     spawnMap.fill(0);
//     spawnMap[x][y] = 1; // incremented before anything else happens

//     let radius = 0;
//     startProb = startProb || 100;
//     if (startProb >= 100) {
//         probDec = probDec || 100;
//     }
//     while (GW.random.chance(startProb)) {
//         startProb -= probDec;
//         ++radius;
//     }
//     // startProb = 100;
//     // probDec = 0;

//     spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
//         if (!cellIsOk(this, i, j, ctx)) return 0;

//         // const dist = Math.floor(Utils.distanceBetween(x, y, i, j));
//         // const prob = startProb - dist * probDec;
//         // if (!random.chance(prob)) return 0;
//         return 1;
//     });
//     // spawnMap[x][y] = 1;

//     // if (!isOk(flags, x, y, ctx)) {
//     //     spawnMap[x][y] = 0;
//     // }

//     return true;
// }

// export function spreadLine(
//     this: any,
//     ctx: Effect.EffectCtx,
//     spawnMap: Grid.NumGrid
// ) {
//     let x2, y2;
//     let madeChange;

//     const x = ctx.x;
//     const y = ctx.y;

//     let startProb = this.spread || 0;
//     let probDec = this.decrement || 0;

//     spawnMap.fill(0);
//     spawnMap[x][y] = 1; // incremented before anything else happens

//     if (startProb) {
//         madeChange = true;
//         if (startProb >= 100) {
//             probDec = probDec || 100;
//         }

//         x2 = x;
//         y2 = y;
//         const dir = Utils.DIRS[GW.random.number(4)];
//         while (madeChange) {
//             madeChange = false;
//             x2 = x2 + dir[0];
//             y2 = y2 + dir[1];
//             if (
//                 spawnMap.hasXY(x2, y2) &&
//                 !spawnMap[x2][y2] &&
//                 cellIsOk(this, x2, y2, ctx) &&
//                 GW.random.chance(startProb)
//             ) {
//                 spawnMap[x2][y2] = 1;
//                 madeChange = true;
//                 startProb -= probDec;
//             }
//         }
//     }

//     if (!cellIsOk(this, x, y, ctx)) {
//         spawnMap[x][y] = 0;
//     }

//     return true;
// }

export function clearCells(map: MapType, spawnMap: Grid.NumGrid, flags = 0) {
    let didSomething = false;
    const clearAll =
        (flags & Effect.Flags.E_CLEAR_CELL) === Effect.Flags.E_CLEAR_CELL;
    spawnMap.forEach((v, i, j) => {
        if (!v) return;

        const cell = map.cell(i, j);
        if (clearAll) {
            cell.clear();
        } else {
            if (flags & Effect.Flags.E_CLEAR_GAS) {
                cell.clearLayer(Entity.flags.Depth.GAS);
            }
            if (flags & Effect.Flags.E_CLEAR_LIQUID) {
                cell.clearLayer(Entity.flags.Depth.LIQUID);
            }
            if (flags & Effect.Flags.E_CLEAR_SURFACE) {
                cell.clearLayer(Entity.flags.Depth.SURFACE);
            }
            if (flags & Effect.Flags.E_CLEAR_GROUND) {
                cell.clearLayer(Entity.flags.Depth.GROUND);
            }
        }
        didSomething = true;
    });
    return didSomething;
}

export function evacuateCreatures(map: MapType, blockingMap: Grid.NumGrid) {
    let i = 0,
        j = 0;

    let didSomething = false;
    for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
            if (!blockingMap[i][j]) continue;
            const cell = map.cell(i, j);
            if (!cell.hasActor()) continue;

            cell.objects.forEach((obj) => {
                if (!(obj instanceof Actor)) return;
                const monst: Actor = obj;
                const loc = random.matchingLocNear(i, j, (x, y) => {
                    if (!map.hasXY(x, y)) return false;
                    if (blockingMap[x][y]) return false;
                    const c = map.cell(x, y);
                    return !monst.forbidsCell(c);
                });
                if (loc && loc[0] >= 0 && loc[1] >= 0) {
                    map.objects.move(monst, loc[0], loc[1]);
                    // map.redrawXY(loc[0], loc[1]);
                    didSomething = true;
                }
            });
        }
    }
    return didSomething;
}

export function evacuateItems(map: MapType, blockingMap: Grid.NumGrid) {
    let didSomething = false;
    blockingMap.forEach((v: number, i: number, j: number) => {
        if (!v) return;
        const cell = map.cell(i, j);
        if (!cell.hasItem()) return;

        cell.objects.forEach((obj) => {
            if (!(obj instanceof Item)) return;
            const item: Item = obj;
            const loc = random.matchingLocNear(i, j, (x, y) => {
                if (!map.hasXY(x, y)) return false;
                if (blockingMap[x][y]) return false;
                const dest = map.cell(x, y);
                return !item.forbidsCell(dest);
            });
            if (loc && loc[0] >= 0 && loc[1] >= 0) {
                map.objects.move(item, loc[0], loc[1]);
                // map.redrawXY(loc[0], loc[1]);
                didSomething = true;
            }
        });
    });
    return didSomething;
}

class ClearTileEffect implements Effect.EffectHandler {
    make(src: Partial<Effect.EffectConfig>, dest: Effect.EffectInfo): boolean {
        if (!src.clear) return true;
        let config = src.clear;
        let layers = 0;

        if (typeof config === 'string') {
            config = config.split(/[,|]/).map((t) => t.trim());
        }

        if (config === true) {
            layers = Entity.flags.Depth.ALL_LAYERS;
        } else if (typeof config === 'number') {
            layers = config;
        } else if (Array.isArray(config)) {
            layers = config.reduce((out, v: string | number) => {
                if (typeof v === 'number') return out | v;

                const depth: number =
                    Entity.flags.Depth[v as keyof typeof Entity.flags.Depth] ||
                    0;
                return out | depth;
            }, 0);
        } else {
            throw new Error('clear effect must have number or string config.');
        }

        dest.clear = layers;
        return layers > 0;
    }

    fire(
        config: Effect.EffectInfo,
        map: MapType,
        x: number,
        y: number,
        _ctx: Effect.EffectCtx
    ): boolean {
        if (!config.clear) return false;

        if (!map) return false;
        const cell = map.cell(x, y);
        return cell.clearLayer(config.clear);
    }
}

Effect.installType('clear', new ClearTileEffect());
