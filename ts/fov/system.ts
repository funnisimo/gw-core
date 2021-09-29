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

export type FovChangeFn = (x: number, y: number, isVisible: boolean) => void;
export interface FovNotice {
    onFovChange: FovChangeFn;
}

export interface FovSystemOptions {
    revealed: boolean;
    visible: boolean;
    alwaysVisible: boolean;
    onFovChange: FovChangeFn | FovNotice;
}

export class FovSystem implements TYPES.FovTracker {
    site: TYPES.FovSite;
    flags: Grid.NumGrid; // FovFlags
    fov: FOV.FOV;
    needsUpdate: boolean;
    protected _changed: boolean;
    onFovChange: FovNotice = { onFovChange: NOOP };
    follow: FovSubject | null = null;

    constructor(site: TYPES.FovSite, opts: Partial<FovSystemOptions> = {}) {
        this.site = site;

        let flag = 0;
        const visible = opts.visible || opts.alwaysVisible;
        if (opts.revealed || (visible && opts.revealed !== false))
            flag |= FovFlags.REVEALED;
        if (visible) flag |= FovFlags.VISIBLE;

        this.flags = Grid.make(site.width, site.height, flag);
        this.needsUpdate = true;
        this._changed = true;
        if (typeof opts.onFovChange === 'function') {
            this.onFovChange.onFovChange = opts.onFovChange;
        } else if (opts.onFovChange) {
            this.onFovChange = opts.onFovChange;
        }

        this.fov = new FOV.FOV({
            isBlocked(x: number, y: number): boolean {
                return site.blocksVision(x, y);
            },
            hasXY(x: number, y: number): boolean {
                return x >= 0 && y >= 0 && x < site.width && y < site.height;
            },
        });

        // we want fov, so do not reveal the map initially
        if (opts.alwaysVisible) {
            this.makeAlwaysVisible();
        }

        if (opts.visible || opts.alwaysVisible) {
            XY.forRect(site.width, site.height, (x, y) =>
                this.onFovChange.onFovChange(x, y, true)
            );
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
    fovChanged(x: number, y: number): boolean {
        const flags = this.flags.get(x, y) || 0;
        const isVisible = !!(flags & FovFlags.ANY_KIND_OF_VISIBLE);
        const wasVisible = !!(flags & FovFlags.WAS_ANY_KIND_OF_VISIBLE);
        return isVisible !== wasVisible;
    }

    makeAlwaysVisible() {
        this.flags.update(
            (v) =>
                v |
                (FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE)
        );
        this.changed = true;
    }
    makeCellAlwaysVisible(x: number, y: number) {
        this.flags[x][y] |= FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED;
        this.changed = true;
    }

    revealAll(makeVisibleToo = true): void {
        const flag =
            FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);
        this.flags.update((v) => v | flag);
        this.changed = true;
    }
    revealCell(x: number, y: number) {
        const flag = FovFlags.REVEALED;
        this.flags[x][y] |= flag;
        this.changed = true;
    }
    hideCell(x: number, y: number): void {
        this.flags[x][y] &= ~(
            FovFlags.MAGIC_MAPPED |
            FovFlags.REVEALED |
            FovFlags.ALWAYS_VISIBLE
        );
        this.flags[x][y] = this.demoteCellVisibility(this.flags[x][y]); // clears visible, etc...
        this.changed = true;
    }
    magicMapCell(x: number, y: number): void {
        this.flags[x][y] |= FovFlags.MAGIC_MAPPED;
        this.changed = true;
    }
    reset() {
        this.flags.fill(0);
        this.changed = true;
    }

    get changed(): boolean {
        return this._changed;
    }
    set changed(v: boolean) {
        this._changed = v;
        this.needsUpdate = this.needsUpdate || v;
    }

    // CURSOR

    setCursor(x: number, y: number, keep = false) {
        if (!keep) {
            this.flags.update((f) => f & ~FovFlags.IS_CURSOR);
        }
        this.flags[x][y] |= FovFlags.IS_CURSOR;
    }
    clearCursor(x?: number, y?: number) {
        if (x === undefined || y === undefined) {
            this.flags.update((f) => f & ~FovFlags.IS_CURSOR);
        } else {
            this.flags[x][y] &= ~FovFlags.IS_CURSOR;
        }
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
    }
    clearHighlight(x?: number, y?: number) {
        if (x === undefined || y === undefined) {
            this.flags.update((f) => f & ~FovFlags.IS_HIGHLIGHTED);
        } else {
            this.flags[x][y] &= ~FovFlags.IS_HIGHLIGHTED;
        }
    }
    isHighlight(x: number, y: number): boolean {
        return !!(this.flags[x][y] & FovFlags.IS_HIGHLIGHTED);
    }

    // COPY

    copy(other: FovSystem) {
        this.flags.copy(other.flags);
        this.needsUpdate = other.needsUpdate;
        this._changed = other._changed;
    }

    //////////////////////////
    // UPDATE

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
            this.flags[x][y] |= FovFlags.REVEALED;
            this.onFovChange.onFovChange(x, y, isVisible);
        } else if (!isVisible && wasVisible) {
            // if the cell ceased being visible this move
            this.onFovChange.onFovChange(x, y, isVisible);
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
            this.onFovChange.onFovChange(x, y, isClairy);
        } else if (!wasClairy && isClairy) {
            // became clairvoyantly visible
            this.onFovChange.onFovChange(x, y, isClairy);
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
            this.onFovChange.onFovChange(x, y, isTele);
        } else if (!wasTele && isTele) {
            // became telepathically visible
            this.onFovChange.onFovChange(x, y, isTele);
        }
        return isTele;
    }

    protected updateCellDetect(flag: number, x: number, y: number): boolean {
        const isMonst = !!(flag & FovFlags.ACTOR_DETECTED);
        const wasMonst = !!(flag & FovFlags.WAS_ACTOR_DETECTED);

        if (isMonst && wasMonst) {
            // if (this.site.lightChanged(x, y)) {
            //     this.site.redrawCell(x, y);
            // }
        } else if (!isMonst && wasMonst) {
            // ceased being detected visible
            this.onFovChange.onFovChange(x, y, isMonst);
        } else if (!wasMonst && isMonst) {
            // became detected visible
            this.onFovChange.onFovChange(x, y, isMonst);
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

    updateFor(subject: FovSubject): boolean {
        return this.update(subject.x, subject.y, subject.visionDistance);
    }

    update(): boolean;
    update(x: number, y: number, r?: number): boolean;
    update(cx?: number, cy?: number, cr?: number): boolean {
        // if (!this.site.usesFov()) return false;

        if (arguments.length == 0 && this.follow) {
            return this.updateFor(this.follow);
        }

        if (
            !this.needsUpdate &&
            cx === undefined &&
            !this.site.lightingChanged()
        ) {
            return false;
        }

        if (cr === undefined) {
            cr = this.site.width + this.site.height;
        }

        this.needsUpdate = false;
        this._changed = false;
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
