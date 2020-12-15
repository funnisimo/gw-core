// CREDIT - This is adapted from: http://roguebasin.roguelikedevelopment.org/index.php?title=Improved_Shadowcasting_in_Java
import * as Utils from "./utils";
export class FOV {
    constructor(strategy) {
        this._startX = -1;
        this._startY = -1;
        this._maxRadius = 100;
        this._isBlocked = strategy.isBlocked;
        this._calcRadius = strategy.calcRadius || Utils.calcRadius;
        this._setVisible = strategy.setVisible;
        this._hasXY = strategy.hasXY || Utils.TRUE;
    }
    calculate(x, y, maxRadius) {
        this._setVisible(x, y, 1);
        this._startX = x;
        this._startY = y;
        this._maxRadius = maxRadius + 1;
        // uses the diagonals
        for (let i = 4; i < 8; ++i) {
            const d = Utils.DIRS[i];
            this.castLight(1, 1.0, 0.0, 0, d[0], d[1], 0);
            this.castLight(1, 1.0, 0.0, d[0], 0, 0, d[1]);
        }
    }
    // NOTE: slope starts a 1 and ends at 0.
    castLight(row, startSlope, endSlope, xx, xy, yx, yy) {
        if (row >= this._maxRadius) {
            // fov.debug('CAST: row=%d, start=%d, end=%d, row >= maxRadius => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
            return;
        }
        if (startSlope < endSlope) {
            // fov.debug('CAST: row=%d, start=%d, end=%d, start < end => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
            return;
        }
        // fov.debug('CAST: row=%d, start=%d, end=%d, x=%d,%d, y=%d,%d', row, startSlope.toFixed(2), endSlope.toFixed(2), xx, xy, yx, yy);
        let nextStart = startSlope;
        let blocked = false;
        let deltaY = -row;
        let currentX, currentY, outerSlope, innerSlope, maxSlope, minSlope = 0;
        for (let deltaX = -row; deltaX <= 0; deltaX++) {
            currentX = Math.floor(this._startX + deltaX * xx + deltaY * xy);
            currentY = Math.floor(this._startY + deltaX * yx + deltaY * yy);
            outerSlope = (deltaX - 0.5) / (deltaY + 0.5);
            innerSlope = (deltaX + 0.5) / (deltaY - 0.5);
            maxSlope = deltaX / (deltaY + 0.5);
            minSlope = (deltaX + 0.5) / deltaY;
            if (!this._hasXY(currentX, currentY)) {
                blocked = true;
                // nextStart = innerSlope;
                continue;
            }
            // fov.debug('- test %d,%d ... start=%d, min=%d, max=%d, end=%d, dx=%d, dy=%d', currentX, currentY, startSlope.toFixed(2), maxSlope.toFixed(2), minSlope.toFixed(2), endSlope.toFixed(2), deltaX, deltaY);
            if (startSlope < minSlope) {
                blocked = this._isBlocked(currentX, currentY);
                continue;
            }
            else if (endSlope > maxSlope) {
                break;
            }
            //check if it's within the lightable area and light if needed
            const radius = this._calcRadius(deltaX, deltaY);
            if (radius < this._maxRadius) {
                const bright = 1 - radius / this._maxRadius;
                this._setVisible(currentX, currentY, bright);
                // fov.debug('       - visible');
            }
            if (blocked) {
                //previous cell was a blocking one
                if (this._isBlocked(currentX, currentY)) {
                    //hit a wall
                    // fov.debug('       - blocked ... nextStart: %d', innerSlope.toFixed(2));
                    nextStart = innerSlope;
                    continue;
                }
                else {
                    blocked = false;
                }
            }
            else {
                if (this._isBlocked(currentX, currentY) && row < this._maxRadius) {
                    //hit a wall within sight line
                    // fov.debug('       - blocked ... start:%d, end:%d, nextStart: %d', nextStart.toFixed(2), outerSlope.toFixed(2), innerSlope.toFixed(2));
                    blocked = true;
                    this.castLight(row + 1, nextStart, outerSlope, xx, xy, yx, yy);
                    nextStart = innerSlope;
                }
            }
        }
        if (!blocked) {
            this.castLight(row + 1, nextStart, endSlope, xx, xy, yx, yy);
        }
    }
}
//# sourceMappingURL=fov.js.map