// import * as GW from 'gw-utils';
// import * as Flags from './mapFlags';
// import * as Cell from './cell';
// import * as Map from './map';

import { FovFlags } from './flags';
import * as Grid from '../grid';
import * as FOV from './fov';
import * as TYPES from './types';

export interface FovSystemOptions {
    revealed: boolean;
    visible: boolean;
    fov: boolean;
}

export class FovSystem implements TYPES.FovSystemType {
    site: TYPES.FovSite;
    flags: Grid.NumGrid; // FovFlags
    fov: FOV.FOV;
    protected _changed: boolean;
    viewportChanged: boolean;

    constructor(site: TYPES.FovSite, opts: Partial<FovSystemOptions> = {}) {
        this.site = site;
        this.flags = Grid.make(site.width, site.height, FovFlags.VISIBLE);
        this._changed = true;
        this.viewportChanged = false;

        this.fov = new FOV.FOV({
            isBlocked(x: number, y: number): boolean {
                return site.blocksVision(x, y);
            },
            hasXY(x: number, y: number): boolean {
                return x >= 0 && y >= 0 && x < site.width && y < site.height;
            },
        });

        // we want fov, so do not reveal the map initially
        if (opts.fov === true) {
            this.flags.fill(0);
        }

        if (opts.visible) {
            this.makeAlwaysVisible();
        } else if (opts.visible === false) {
            this.flags.fill(0);
        } else if (opts.revealed) {
            this.revealAll();
        }
    }

    get changed() {
        return this._changed;
    }

    isVisible(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.VISIBLE);
    }
    isAnyKindOfVisible(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.ANY_KIND_OF_VISIBLE);
    }
    isInFov(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.IN_FOV);
    }
    isDirectlyVisible(x: number, y: number): boolean {
        const flags = FovFlags.VISIBLE | FovFlags.IN_FOV;
        return ((this.flags.get(x, y) || 0) & flags) === flags;
    }
    isMagicMapped(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.MAGIC_MAPPED);
    }
    isRevealed(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.REVEALED);
    }

    makeAlwaysVisible() {
        this.flags.update(
            (v) =>
                v |
                (FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE)
        );
    }
    makeCellAlwaysVisible(x: number, y: number) {
        this.flags[x][y] |= FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED;
    }

    revealAll(): void {
        this.flags.update((v) => v | FovFlags.REVEALED | FovFlags.VISIBLE);
    }
    revealCell(x: number, y: number) {
        const flag = FovFlags.REVEALED;
        this.flags[x][y] |= flag;
    }
    hideCell(x: number, y: number): void {
        this.flags[x][y] &= ~(FovFlags.MAGIC_MAPPED | FovFlags.REVEALED);
    }
    magicMapCell(x: number, y: number): void {
        this.flags[x][y] |= FovFlags.MAGIC_MAPPED;
    }

    protected demoteCellVisibility(flag: number): number {
        flag &= ~(FovFlags.WAS_ANY_KIND_OF_VISIBLE | FovFlags.WAS_IN_FOV);

        if (flag & FovFlags.IN_FOV) {
            flag &= ~FovFlags.IN_FOV;
            flag |= FovFlags.WAS_IN_FOV;
        }
        if (flag & FovFlags.VISIBLE) {
            flag &= ~FovFlags.VISIBLE;
            flag |= FovFlags.WAS_VISIBLE;
        }
        if (flag & FovFlags.CLAIRVOYANT_VISIBLE) {
            flag &= ~FovFlags.CLAIRVOYANT_VISIBLE;
            flag |= FovFlags.WAS_CLAIRVOYANT_VISIBLE;
        }
        if (flag & FovFlags.TELEPATHIC_VISIBLE) {
            flag &= ~FovFlags.TELEPATHIC_VISIBLE;
            flag |= FovFlags.WAS_TELEPATHIC_VISIBLE;
        }
        if (flag & FovFlags.ALWAYS_VISIBLE) {
            flag |= FovFlags.VISIBLE;
        }

        return flag;
    }

    protected updateCellVisibility(
        flag: number,
        x: number,
        y: number
    ): boolean {
        const isVisible = !!(flag & FovFlags.VISIBLE);
        const wasVisible = !!(flag & FovFlags.WAS_ANY_KIND_OF_VISIBLE);

        if (isVisible && wasVisible) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (isVisible && !wasVisible) {
            // if the cell became visible this move
            if (!(flag & FovFlags.REVEALED) /* && DATA.automationActive */) {
                this.site.onCellRevealed(x, y);
                // if (cell.item) {
                //     const theItem: GW.types.ItemType = cell.item;
                //     if (
                //         theItem.hasLayerFlag(ObjectFlags.L_INTERRUPT_WHEN_SEEN)
                //     ) {
                //         GW.message.add(
                //             '§you§ §see§ ΩitemMessageColorΩ§item§∆.',
                //             {
                //                 item: theItem,
                //                 actor: DATA.player,
                //             }
                //         );
                //     }
                // }
                // if (
                //     !(flag & FovFlags.MAGIC_MAPPED) &&
                //     this.site.hasObjectFlag(
                //         x,
                //         y,
                //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
                //     )
                // ) {
                //     const tile = cell.tileWithLayerFlag(
                //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
                //     );
                //     if (tile) {
                //         GW.message.add(
                //             '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
                //             {
                //                 actor: DATA.player,
                //                 item: tile.name,
                //             }
                //         );
                //     }
                // }
                this.flags[x][y] |= FovFlags.REVEALED;
            }
            // this.site.redrawCell(x, y);
        } else if (!isVisible && wasVisible) {
            // if the cell ceased being visible this move
            // this.site.storeMemory(x, y);
            // this.site.redrawCell(x, y);
        }
        return isVisible;
    }

    protected updateCellClairyvoyance(
        flag: number,
        x: number,
        y: number
    ): boolean {
        const isClairy = !!(flag & FovFlags.CLAIRVOYANT_VISIBLE);
        const wasClairy = !!(flag & FovFlags.WAS_CLAIRVOYANT_VISIBLE);

        if (isClairy && wasClairy) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (!isClairy && wasClairy) {
            // ceased being clairvoyantly visible
            this.site.storeMemory(x, y);
            this.site.redrawCell(x, y);
        } else if (!wasClairy && isClairy) {
            // became clairvoyantly visible
            this.site.redrawCell(x, y, true);
        }

        return isClairy;
    }

    protected updateCellTelepathy(flag: number, x: number, y: number): boolean {
        const isTele = !!(flag & FovFlags.TELEPATHIC_VISIBLE);
        const wasTele = !!(flag & FovFlags.WAS_TELEPATHIC_VISIBLE);

        if (isTele && wasTele) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (!isTele && wasTele) {
            // ceased being telepathically visible
            this.site.storeMemory(x, y);
            this.site.redrawCell(x, y);
        } else if (!wasTele && isTele) {
            // became telepathically visible
            // if (
            //     !(flag & FovFlags.REVEALED) &&
            //     !cell.hasTileFlag(Flags.Tile.T_PATHING_BLOCKER)
            // ) {
            //     DATA.xpxpThisTurn++;
            // }
            this.site.redrawCell(x, y, true);
        }
        return isTele;
    }

    protected updateCellDetect(flag: number, x: number, y: number): boolean {
        const isMonst = !!(flag & FovFlags.MONSTER_DETECTED);
        const wasMonst = !!(flag & FovFlags.WAS_MONSTER_DETECTED);

        if (isMonst && wasMonst) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (!isMonst && wasMonst) {
            // ceased being detected visible
            this.site.redrawCell(x, y, true);
            // cell.storeMemory();
        } else if (!wasMonst && isMonst) {
            // became detected visible
            this.site.redrawCell(x, y, true);
            // cell.storeMemory();
        }
        return isMonst;
    }

    protected promoteCellVisibility(flag: number, x: number, y: number) {
        if (
            flag & FovFlags.IN_FOV &&
            this.site.hasVisibleLight(x, y) // &&
            // !(cell.flags.cellMech & FovFlagsMech.DARKENED)
        ) {
            flag = this.flags[x][y] |= FovFlags.VISIBLE;
        }

        if (this.updateCellVisibility(flag, x, y)) return;
        if (this.updateCellClairyvoyance(flag, x, y)) return;
        if (this.updateCellTelepathy(flag, x, y)) return;
        if (this.updateCellDetect(flag, x, y)) return;
    }

    update(): boolean;
    update(x: number, y: number, r: number): boolean;
    update(cx?: number, cy?: number, cr?: number): boolean {
        // if (!this.site.usesFov()) return false;
        if (
            !this.viewportChanged &&
            cx === undefined &&
            !this.site.lightingChanged()
        ) {
            return false;
        }

        this.flags.update(this.demoteCellVisibility.bind(this));

        this.site.eachViewport((x, y, radius, type) => {
            const flag = type & FovFlags.VIEWPORT_TYPES;
            if (!flag)
                throw new Error('Received invalid viewport type: ' + type);

            if (radius == 0) {
                this.flags[x][y] |= flag;
                return;
            }

            this.fov.calculate(x, y, radius, (x, y, v) => {
                if (v) {
                    this.flags[x][y] |= flag;
                }
            });
        });

        if (cx !== undefined && cy !== undefined) {
            this.fov.calculate(cx, cy, cr, (x, y, v) => {
                if (v) {
                    this.flags[x][y] |= FovFlags.PLAYER;
                }
            });
        }

        // if (PLAYER.bonus.clairvoyance < 0) {
        //   discoverCell(PLAYER.xLoc, PLAYER.yLoc);
        // }
        //
        // if (PLAYER.bonus.clairvoyance != 0) {
        // 	updateClairvoyance();
        // }
        //
        // updateTelepathy();
        // updateMonsterDetection();

        // updateLighting();
        this.flags.forEach(this.promoteCellVisibility.bind(this));

        // if (PLAYER.status.hallucinating > 0) {
        // 	for (theItem of DUNGEON.items) {
        // 		if ((pmap[theItem.xLoc][theItem.yLoc].flags & DISCOVERED) && refreshDisplay) {
        // 			refreshDungeonCell(theItem.xLoc, theItem.yLoc);
        // 		}
        // 	}
        // 	for (monst of DUNGEON.monsters) {
        // 		if ((pmap[monst.xLoc][monst.yLoc].flags & DISCOVERED) && refreshDisplay) {
        // 			refreshDungeonCell(monst.xLoc, monst.yLoc);
        // 		}
        // 	}
        // }
        return true;
    }
}
