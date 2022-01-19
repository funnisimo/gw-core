// import * as GWU from 'gw-utils';
// import * as Flags from './mapFlags';
// import * as Cell from './cell';
// import * as Map from './map';

import { FovFlags } from './flags';
import * as Grid from '../grid';
import * as FOV from './fov';
import * as TYPES from './types';
import { NOOP } from '../utils';
import * as XY from '../xy';
import { FovSubject } from '.';
// import * as Flag from '../flag';

export type FovChangeFn = (x: number, y: number, isVisible: boolean) => void;
export interface FovNoticer {
    onFovChange: FovChangeFn;
}

export interface FovSystemOptions {
    revealed?: boolean;
    visible?: boolean;
    alwaysVisible?: boolean;
    callback?: FovChangeFn | FovNoticer;
}

export class FovSystem implements TYPES.FovTracker {
    site: TYPES.FovSite;
    flags: Grid.NumGrid; // FovFlags
    fov: FOV.FOV;
    // needsUpdate: boolean;
    changed = true;
    protected _callback: FovChangeFn = NOOP;
    follow: FovSubject | null = null;

    constructor(site: TYPES.FovSite, opts: FovSystemOptions = {}) {
        this.site = site;

        let flag = 0;
        const visible = opts.visible || opts.alwaysVisible;
        if (opts.revealed || (visible && opts.revealed !== false))
            flag |= FovFlags.REVEALED;
        if (visible) flag |= FovFlags.VISIBLE;

        this.flags = Grid.make(site.width, site.height, flag);
        // this.needsUpdate = true;
        if (opts.callback) {
            this.callback = opts.callback;
        }

        this.fov = new FOV.FOV({
            isBlocked: (x: number, y: number): boolean => {
                return this.site.blocksVision(x, y);
            },
            hasXY: (x: number, y: number): boolean => {
                return (
                    x >= 0 &&
                    y >= 0 &&
                    x < this.site.width &&
                    y < this.site.height
                );
            },
        });

        if (opts.alwaysVisible) {
            this.makeAlwaysVisible();
        }

        if (opts.visible || opts.alwaysVisible) {
            XY.forRect(site.width, site.height, (x, y) =>
                this._callback(x, y, true)
            );
        }
    }

    get callback(): FovChangeFn {
        return this._callback;
    }
    set callback(v: FovChangeFn | FovNoticer | null) {
        if (!v) {
            this._callback = NOOP;
        } else if (typeof v === 'function') {
            this._callback = v;
        } else {
            this._callback = v.onFovChange.bind(v);
        }
    }

    getFlag(x: number, y: number): FovFlags {
        return this.flags[x][y];
    }

    isVisible(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.VISIBLE);
    }
    isAnyKindOfVisible(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.ANY_KIND_OF_VISIBLE);
    }
    isClairvoyantVisible(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.CLAIRVOYANT_VISIBLE);
    }
    isTelepathicVisible(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.TELEPATHIC_VISIBLE);
    }
    isInFov(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.IN_FOV);
    }
    isDirectlyVisible(x: number, y: number): boolean {
        const flags = FovFlags.VISIBLE | FovFlags.IN_FOV;
        return ((this.flags.get(x, y) || 0) & flags) === flags;
    }
    isActorDetected(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.ACTOR_DETECTED);
    }
    isItemDetected(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.ITEM_DETECTED);
    }
    isMagicMapped(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.MAGIC_MAPPED);
    }
    isRevealed(x: number, y: number): boolean {
        return !!((this.flags.get(x, y) || 0) & FovFlags.REVEALED);
    }
    fovChanged(x: number, y: number): boolean {
        const flags = this.flags.get(x, y) || 0;
        const isVisible = !!(flags & FovFlags.ANY_KIND_OF_VISIBLE);
        const wasVisible = !!(flags & FovFlags.WAS_ANY_KIND_OF_VISIBLE);
        return isVisible !== wasVisible;
    }
    wasAnyKindOfVisible(x: number, y: number): boolean {
        return !!(
            (this.flags.get(x, y) || 0) & FovFlags.WAS_ANY_KIND_OF_VISIBLE
        );
    }

    makeAlwaysVisible() {
        this.changed = true;
        this.flags.forEach((_v, x, y) => {
            this.flags[x][y] |=
                FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE;
            this.callback(x, y, true);
        });
    }
    makeCellAlwaysVisible(x: number, y: number) {
        this.changed = true;
        this.flags[x][y] |=
            FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE;
        this.callback(x, y, true);
    }

    revealAll(makeVisibleToo = true): void {
        const flag =
            FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);
        this.flags.update((v) => v | flag);
        this.flags.forEach((v, x, y) => {
            this.callback(x, y, !!(v & FovFlags.VISIBLE));
        });
        this.changed = true;
    }
    revealCell(x: number, y: number, radius = 0, makeVisibleToo = true) {
        const flag =
            FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);

        this.fov.calculate(x, y, radius, (x0, y0) => {
            this.flags[x0][y0] |= flag;
            this.callback(x0, y0, !!(flag & FovFlags.VISIBLE));
        });
        this.changed = true;
    }
    hideCell(x: number, y: number): void {
        this.flags[x][y] &= ~(
            FovFlags.MAGIC_MAPPED |
            FovFlags.REVEALED |
            FovFlags.ALWAYS_VISIBLE
        );
        this.flags[x][y] = this.demoteCellVisibility(this.flags[x][y]); // clears visible, etc...
        this.callback(x, y, false);

        this.changed = true;
    }
    magicMapCell(x: number, y: number): void {
        this.flags[x][y] |= FovFlags.MAGIC_MAPPED;
        this.changed = true;
        this.callback(x, y, true);
    }
    reset() {
        this.flags.fill(0);
        this.changed = true;
        this.flags.forEach((_v, x, y) => {
            this.callback(x, y, false);
        });
    }

    // get changed(): boolean {
    //     return this._changed;
    // }
    // set changed(v: boolean) {
    //     this._changed = v;
    //     this.needsUpdate = this.needsUpdate || v;
    // }

    // CURSOR

    setCursor(x: number, y: number, keep = false) {
        if (!keep) {
            this.flags.update((f) => f & ~FovFlags.IS_CURSOR);
        }
        this.flags[x][y] |= FovFlags.IS_CURSOR;
        this.changed = true;
    }
    clearCursor(x?: number, y?: number) {
        if (x === undefined || y === undefined) {
            this.flags.update((f) => f & ~FovFlags.IS_CURSOR);
        } else {
            this.flags[x][y] &= ~FovFlags.IS_CURSOR;
        }
        this.changed = true;
    }
    isCursor(x: number, y: number): boolean {
        return !!(this.flags[x][y] & FovFlags.IS_CURSOR);
    }

    // HIGHLIGHT

    setHighlight(x: number, y: number, keep = false) {
        if (!keep) {
            this.flags.update((f) => f & ~FovFlags.IS_HIGHLIGHTED);
        }
        this.flags[x][y] |= FovFlags.IS_HIGHLIGHTED;
        this.changed = true;
    }
    clearHighlight(x?: number, y?: number) {
        if (x === undefined || y === undefined) {
            this.flags.update((f) => f & ~FovFlags.IS_HIGHLIGHTED);
        } else {
            this.flags[x][y] &= ~FovFlags.IS_HIGHLIGHTED;
        }
        this.changed = true;
    }
    isHighlight(x: number, y: number): boolean {
        return !!(this.flags[x][y] & FovFlags.IS_HIGHLIGHTED);
    }

    // COPY

    // copy(other: FovSystem) {
    //     this.site = other.site;
    //     this.flags.copy(other.flags);
    //     this.fov = other.fov;
    //     this.follow = other.follow;
    //     this.onFovChange = other.onFovChange;
    //     // this.needsUpdate = other.needsUpdate;
    //     // this._changed = other._changed;
    // }

    //////////////////////////
    // UPDATE

    protected demoteCellVisibility(flag: number): number {
        flag &= ~(
            FovFlags.WAS_ANY_KIND_OF_VISIBLE |
            FovFlags.WAS_IN_FOV |
            FovFlags.WAS_DETECTED
        );

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
        if (flag & FovFlags.ITEM_DETECTED) {
            flag &= ~FovFlags.ITEM_DETECTED;
            flag |= FovFlags.WAS_ITEM_DETECTED;
        }
        if (flag & FovFlags.ACTOR_DETECTED) {
            flag &= ~FovFlags.ACTOR_DETECTED;
            flag |= FovFlags.WAS_ACTOR_DETECTED;
        }

        return flag;
    }

    protected updateCellVisibility(
        flag: number,
        x: number,
        y: number
    ): boolean {
        const isVisible = !!(flag & FovFlags.ANY_KIND_OF_VISIBLE);
        const wasVisible = !!(flag & FovFlags.WAS_ANY_KIND_OF_VISIBLE);

        if (isVisible && wasVisible) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (isVisible && !wasVisible) {
            // if the cell became visible this move
            this.flags[x][y] |= FovFlags.REVEALED;
            this._callback(x, y, isVisible);
            this.changed = true;
        } else if (!isVisible && wasVisible) {
            // if the cell ceased being visible this move
            this._callback(x, y, isVisible);
            this.changed = true;
        }
        return isVisible;
    }

    // protected updateCellClairyvoyance(
    //     flag: number,
    //     x: number,
    //     y: number
    // ): boolean {
    //     const isClairy = !!(flag & FovFlags.CLAIRVOYANT_VISIBLE);
    //     const wasClairy = !!(flag & FovFlags.WAS_CLAIRVOYANT_VISIBLE);

    //     if (isClairy && wasClairy) {
    //         // if (this.site.lightChanged(x, y)) {
    //         //     this.site.redrawCell(x, y);
    //         // }
    //     } else if (!isClairy && wasClairy) {
    //         // ceased being clairvoyantly visible
    //         this._callback(x, y, isClairy);
    //     } else if (!wasClairy && isClairy) {
    //         // became clairvoyantly visible
    //         this._callback(x, y, isClairy);
    //     }

    //     return isClairy;
    // }

    // protected updateCellTelepathy(flag: number, x: number, y: number): boolean {
    //     const isTele = !!(flag & FovFlags.TELEPATHIC_VISIBLE);
    //     const wasTele = !!(flag & FovFlags.WAS_TELEPATHIC_VISIBLE);

    //     if (isTele && wasTele) {
    //         // if (this.site.lightChanged(x, y)) {
    //         //     this.site.redrawCell(x, y);
    //         // }
    //     } else if (!isTele && wasTele) {
    //         // ceased being telepathically visible
    //         this._callback(x, y, isTele);
    //     } else if (!wasTele && isTele) {
    //         // became telepathically visible
    //         this._callback(x, y, isTele);
    //     }
    //     return isTele;
    // }

    protected updateCellDetect(flag: number, x: number, y: number): boolean {
        const isDetect = !!(flag & FovFlags.IS_DETECTED);
        const wasDetect = !!(flag & FovFlags.WAS_DETECTED);

        if (isDetect && wasDetect) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (!isDetect && wasDetect) {
            // ceased being detected visible
            this._callback(x, y, isDetect);
            this.changed = true;
        } else if (!wasDetect && isDetect) {
            // became detected visible
            this._callback(x, y, isDetect);
            this.changed = true;
        }
        return isDetect;
    }

    // protected updateItemDetect(flag: number, x: number, y: number): boolean {
    //     const isItem = !!(flag & FovFlags.ITEM_DETECTED);
    //     const wasItem = !!(flag & FovFlags.WAS_ITEM_DETECTED);

    //     if (isItem && wasItem) {
    //         // if (this.site.lightChanged(x, y)) {
    //         //     this.site.redrawCell(x, y);
    //         // }
    //     } else if (!isItem && wasItem) {
    //         // ceased being detected visible
    //         this._callback(x, y, isItem);
    //     } else if (!wasItem && isItem) {
    //         // became detected visible
    //         this._callback(x, y, isItem);
    //     }
    //     return isItem;
    // }

    protected promoteCellVisibility(flag: number, x: number, y: number) {
        if (
            flag & FovFlags.IN_FOV &&
            this.site.hasVisibleLight(x, y) // &&
            // !(cell.flags.cellMech & FovFlagsMech.DARKENED)
        ) {
            flag = this.flags[x][y] |= FovFlags.VISIBLE;
        }

        if (this.updateCellVisibility(flag, x, y)) return;
        // if (this.updateCellClairyvoyance(flag, x, y)) return;
        // if (this.updateCellTelepathy(flag, x, y)) return;
        if (this.updateCellDetect(flag, x, y)) return;
        // if (this.updateItemDetect(flag, x, y)) return;
    }

    updateFor(subject: FovSubject): boolean {
        return this.update(subject.x, subject.y, subject.visionDistance);
    }

    update(): boolean;
    update(cx: number, cy: number, cr?: number): boolean;
    update(cx?: number, cy?: number, cr?: number): boolean {
        if (cx === undefined) {
            if (this.follow) {
                return this.updateFor(this.follow);
            }
        }

        // if (
        //     // !this.needsUpdate &&
        //     cx === undefined &&
        //     !this.site.lightingChanged()
        // ) {
        //     return false;
        // }

        if (cr === undefined) {
            cr = this.site.width + this.site.height;
        }

        // this.needsUpdate = false;
        this.changed = false;
        this.flags.update(this.demoteCellVisibility.bind(this));

        this.site.eachViewport((x, y, radius, type) => {
            let flag = type & FovFlags.VIEWPORT_TYPES;
            if (!flag) flag = FovFlags.VISIBLE;
            // if (!flag)
            //     throw new Error('Received invalid viewport type: ' + Flag.toString(FovFlags, type));

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

        return this.changed;
    }
}
