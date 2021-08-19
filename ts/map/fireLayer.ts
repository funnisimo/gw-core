import * as Flags from './flags';
import { TileLayer } from './layers';
import { MapType } from './types';
import * as Utils from '../utils';
import * as Effect from '../effect';
import { random } from '../random';

const Depth = Flags.Depth;
const ObjectFlags = Flags.GameObject;
const TileFlags = Flags.Tile;
const TileMechFlags = Flags.TileMech;
const CellFlags = Flags.Cell;

export class FireLayer extends TileLayer {
    constructor(map: MapType, name = 'tile') {
        super(map, name);
    }

    async tick(_dt: number): Promise<boolean> {
        // Run any tick effects

        // Bookkeeping for fire
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                cell.clearCellFlag(CellFlags.CAUGHT_FIRE_THIS_TURN);
            }
        }

        // now spread the fire...
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                if (
                    cell.hasTileFlag(TileFlags.T_IS_FIRE) &&
                    !(cell.flags.cell & CellFlags.CAUGHT_FIRE_THIS_TURN)
                ) {
                    await this.exposeToFire(x, y, false);
                    for (let d = 0; d < 4; ++d) {
                        const dir = Utils.DIRS[d];
                        await this.exposeToFire(x + dir[0], y + dir[1]);
                    }
                }
            }
        }

        return true;
    }

    async exposeToFire(x: number, y: number, alwaysIgnite = false) {
        let ignitionChance = 0,
            bestExtinguishingPriority = 0,
            explosiveNeighborCount = 0;
        let fireIgnited = false,
            explosivePromotion = false;

        const cell = this.map.cell(x, y);

        if (!cell.hasTileFlag(TileFlags.T_IS_FLAMMABLE)) {
            return false;
        }

        // Pick the extinguishing layer with the best priority.
        cell.eachTile((tile) => {
            if (
                tile.hasTileFlag(TileFlags.T_EXTINGUISHES_FIRE) &&
                tile.priority > bestExtinguishingPriority
            ) {
                bestExtinguishingPriority = tile.priority;
            }
        });

        // Pick the fire type of the most flammable layer that is either gas or equal-or-better priority than the best extinguishing layer.
        cell.eachTile((tile) => {
            if (
                tile.flags.tile & TileFlags.T_IS_FLAMMABLE &&
                (tile.depth === Depth.GAS ||
                    tile.priority >= bestExtinguishingPriority)
            ) {
                const effect = Effect.from(tile.effects.fire);
                if (effect && effect.chance > ignitionChance) {
                    ignitionChance = effect.chance;
                }
            }
        });

        if (
            alwaysIgnite ||
            (ignitionChance && random.chance(ignitionChance, 10000))
        ) {
            // If it ignites...
            fireIgnited = true;

            // Count explosive neighbors.
            if (cell.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
                Utils.eachNeighbor(x, y, (x0, y0) => {
                    const n = this.map.cell(x0, y0);
                    if (
                        n.hasObjectFlag(ObjectFlags.L_BLOCKS_GAS) ||
                        n.hasTileFlag(TileFlags.T_IS_FIRE) ||
                        n.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)
                    ) {
                        ++explosiveNeighborCount;
                    }
                });
                if (explosiveNeighborCount >= 8) {
                    explosivePromotion = true;
                }
            }

            let event = 'fire';
            if (explosivePromotion && cell.hasEffect('explode')) {
                event = 'explode';
            }
            // cell.eachTile( (tile) => {
            //     if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE) {
            //         if (tile.depth === Depth.GAS) {
            //             cell.gasVolume = 0;
            //         } else if (tile.depth === Depth.LIQUID) {
            //             cell.liquidVolume = 0;
            //         }
            //     }
            // });

            await cell.activate(event, this.map, x, y, {
                force: true,
            });

            cell.needsRedraw = true;
        }
        return fireIgnited;
    }
}
