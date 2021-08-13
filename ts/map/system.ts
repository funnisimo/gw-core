// import { Map } from './map';
// import * as Grid from '../grid';
// import * as Flags from './flags';
// import * as Effect from '../effect';
// import * as Utils from '../utils';
// import { random } from '../random';
// import * as Flag from '../flag';
// import * as Tile from '../tile';

// export enum CalcType {
//     NONE = 0,
//     UPDATE = 1,
//     CALC = 2,
// }

// export class System {
//     map: Map;

//     constructor(map: Map) {
//         this.map = map;
//     }

//     async update() {
//         await this.fireAll('tick');

//         // Bookkeeping for fire, pressure plates and key-activated tiles.
//         await this.map.forEachAsync(async (cell, x, y) => {
//             cell.flags.cellMech &= ~Flags.Cell.CAUGHT_FIRE_THIS_TURN;
//             if (
//                 !(
//                     cell.flags.cell &
//                     (Flags.Cell.HAS_ANY_ACTOR | Flags.Cell.HAS_ITEM)
//                 ) &&
//                 cell.flags.cellMech & Flags.Cell.PRESSURE_PLATE_DEPRESSED
//             ) {
//                 cell.flags.cellMech &= ~Flags.Cell.PRESSURE_PLATE_DEPRESSED;
//             }
//             if (cell.hasEffect('noKey') && !cell.hasKey()) {
//                 await cell.activate('noKey', this, x, y);
//             }
//         });

//         // now spread the fire...
//         await this.map.forEachAsync(async (cell, x, y) => {
//             if (
//                 cell.hasTileFlag(Flags.Tile.T_IS_FIRE) &&
//                 !(cell.flags.cellMech & Flags.Cell.CAUGHT_FIRE_THIS_TURN)
//             ) {
//                 await this.map.exposeToFire(x, y, false);
//                 await this.map.eachNeighborAsync(
//                     x,
//                     y,
//                     (_n, i, j) => this.map.exposeToFire(i, j),
//                     true
//                 );
//             }
//         });

//         if (!(this.map.flags.map & Flags.Map.MAP_NO_LIQUID)) {
//             const newVolume = Grid.alloc(this.map.width, this.map.height);
//             const calc = this.calcBaseVolume(Flags.Layer.LIQUID, newVolume);

//             if (calc === CalcType.CALC) {
//                 this.updateLiquid(newVolume);
//             }

//             if (calc != CalcType.NONE) {
//                 this.updateVolume(Flags.Layer.LIQUID, newVolume);
//                 this.map.flags.map &= ~Flags.Map.MAP_NO_LIQUID;
//             } else {
//                 this.map.flags.map |= Flags.Map.MAP_NO_LIQUID;
//             }
//             this.changed = true;
//             Grid.free(newVolume);
//         }

//         if (!(this.map.flags.map & Flags.Map.MAP_NO_GAS)) {
//             const newVolume = Grid.alloc(this.map.width, this.map.height);
//             const calc = this.calcBaseVolume(Flags.Layer.GAS, newVolume);

//             if (calc === CalcType.CALC) {
//                 this.map.updateGas(newVolume);
//             }

//             if (calc != CalcType.NONE) {
//                 this.updateVolume(Flags.Layer.GAS, newVolume);
//                 this.map.flags.map &= ~Flags.Map.MAP_NO_GAS;
//             } else {
//                 this.map.flags.map |= Flags.Map.MAP_NO_GAS;
//             }
//             this.map.flags.map |= Flags.Map.MAP_CHANGED;
//             Grid.free(newVolume);
//         }
//     }

//     async fireAll(event: string) {
//         const willFire = Grid.alloc(this.map.width, this.map.height);

//         // Figure out which tiles will fire - before we change everything...
//         this.map.eachCell((cell, x, y) => {
//             cell.clearCellFlag(
//                 Flags.Cell.EVENT_FIRED_THIS_TURN | Flags.Cell.EVENT_PROTECTED
//             );
//             for (let tile of cell.tiles()) {
//                 const ev = tile.effects[event];
//                 if (!ev) continue;

//                 const effect = Effect.from(ev);
//                 if (!effect) continue;

//                 let promoteChance = 0;

//                 // < 0 means try to fire my neighbors...
//                 if (effect.chance < 0) {
//                     promoteChance = 0;
//                     Utils.eachNeighbor(
//                         x,
//                         y,
//                         (i, j) => {
//                             if (!this.map.hasXY(i, j)) return;
//                             const n = this.map.cell(i, j);
//                             if (
//                                 !n.hasObjectFlag(
//                                     Flags.GameObject.L_BLOCKS_EFFECTS
//                                 ) &&
//                                 n.layerTile(tile.layer) !==
//                                     cell.layerTile(tile.layer) &&
//                                 !n.hasCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN)
//                             ) {
//                                 // TODO - Should this break from the loop after doing this once or keep going?
//                                 promoteChance += -1 * effect.chance;
//                             }
//                         },
//                         true
//                     );
//                 } else {
//                     promoteChance = effect.chance || 100 * 100; // 100%
//                 }
//                 if (
//                     !cell.hasCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN) &&
//                     random.chance(promoteChance, 10000)
//                 ) {
//                     willFire[x][y] |= Flag.fl(tile.layer);
//                     // cell.flags.cell |= Flags.Cell.EVENT_FIRED_THIS_TURN;
//                 }
//             }
//         });

//         // Then activate them - so that we don't activate the next generation as part of the forEach
//         await willFire.forEachAsync(async (w, x, y) => {
//             if (!w) return;
//             const cell = this.map.cell(x, y);
//             if (cell.hasCellFlag(Flags.Cell.EVENT_FIRED_THIS_TURN)) return;
//             for (let layer = 0; layer <= Flags.Layer.GAS; ++layer) {
//                 if (w & Flag.fl(layer)) {
//                     await cell.activate(event, this.map, x, y, {
//                         force: true,
//                         layer,
//                     });
//                 }
//             }
//         });

//         Grid.free(willFire);
//     }

//     calcBaseVolume(depth: Flags.Layer, newVolume: Grid.NumGrid): CalcType {
//         let hasVolume = false;
//         let needsAjustment = false;
//         const map = this.map;

//         map.cells.forEach((c, x, y) => {
//             let volume = c.volume(depth);
//             const tile = c.tile(depth);
//             if (volume && tile.dissipate) {
//                 if (tile.dissipate > 10000) {
//                     volume -= Math.floor(tile.dissipate / 10000);
//                     if (random.chance(tile.dissipate % 10000, 10000)) {
//                         volume -= 1;
//                     }
//                 } else if (random.chance(tile.dissipate, 10000)) {
//                     volume -= 1;
//                 }
//             }
//             if (volume > 0) {
//                 newVolume[x][y] = volume;
//                 hasVolume = true;
//                 if (volume > 1) {
//                     needsAjustment = true;
//                 }
//             } else if (tile !== Tile.tiles.NULL) {
//                 c.clearLayer(depth);
//                 map.redrawCell(c);
//             }
//         });

//         if (needsAjustment) return CalcType.CALC;
//         if (hasVolume) return CalcType.UPDATE;
//         return CalcType.NONE;
//     }

//     updateVolume(depth: Flags.Layer, newVolume: Grid.NumGrid) {
//         const map = this.map;
//         newVolume.forEach((v, i, j) => {
//             const cell = map.cell(i, j);
//             const current = cell.volume(depth);
//             const tile = cell.tile(depth);
//             if (v > 0) {
//                 // hasLiquid = true;
//                 if (current !== v || !tile) {
//                     let highVol = current;
//                     let highTile = tile;

//                     map.eachNeighbor(i, j, (n) => {
//                         if (n.volume(depth) > highVol) {
//                             highVol = n.volume(depth);
//                             highTile = n.tile(depth);
//                         }
//                     });

//                     if (highTile !== tile) {
//                         cell.setTile(highTile, 0, map);
//                     }

//                     cell.setVolume(depth, v);
//                     map.redrawCell(cell);
//                 }
//             } else if (current || tile !== Tile.tiles.NULL) {
//                 cell.clearLayer(depth);
//                 map.redrawCell(cell);
//             }
//         });
//     }
// }
