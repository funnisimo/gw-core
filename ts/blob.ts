import * as XY from './xy';
import * as GRID from './grid';
import { random } from './rng';

export interface BlobConfig {
    rounds: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    percentSeeded: number;
    birthParameters: string /* char[9] */;
    survivalParameters: string /* char[9] */;
}

export class Blob {
    public options: BlobConfig = {
        rounds: 5,
        minWidth: 10,
        minHeight: 10,
        maxWidth: 40,
        maxHeight: 20,
        percentSeeded: 50,
        birthParameters: 'ffffffttt',
        survivalParameters: 'ffffttttt',
    };

    constructor(opts: Partial<BlobConfig> = {}) {
        Object.assign(this.options, opts);
        this.options.birthParameters = this.options.birthParameters.toLowerCase();
        this.options.survivalParameters = this.options.survivalParameters.toLowerCase();

        if (this.options.minWidth >= this.options.maxWidth) {
            this.options.minWidth = Math.round(0.75 * this.options.maxWidth);
            this.options.maxWidth = Math.round(1.25 * this.options.maxWidth);
        }
        if (this.options.minHeight >= this.options.maxHeight) {
            this.options.minHeight = Math.round(0.75 * this.options.maxHeight);
            this.options.maxHeight = Math.round(1.25 * this.options.maxHeight);
        }
    }

    carve(width: number, height: number, setFn: XY.XYFunc): XY.Bounds {
        let i, j, k;
        let blobNumber, blobSize, topBlobNumber, topBlobSize;

        let bounds = new XY.Bounds(0, 0, 0, 0);
        const dest = GRID.alloc(width, height);

        const left = Math.floor((dest.width - this.options.maxWidth) / 2);
        const top = Math.floor((dest.height - this.options.maxHeight) / 2);

        let tries = 10;

        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
        do {
            // Clear buffer.
            dest.fill(0);

            // Fill relevant portion with noise based on the percentSeeded argument.
            for (i = 0; i < this.options.maxWidth; i++) {
                for (j = 0; j < this.options.maxHeight; j++) {
                    dest[i + left][j + top] = random.chance(
                        this.options.percentSeeded
                    )
                        ? 1
                        : 0;
                }
            }

            // Some iterations of cellular automata
            for (k = 0; k < this.options.rounds; k++) {
                if (!this._cellularAutomataRound(dest)) {
                    k = this.options.rounds; // cellularAutomataRound did not make any changes
                }
            }

            // Now to measure the result. These are best-of variables; start them out at worst-case values.
            topBlobSize = 0;
            topBlobNumber = 0;

            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
            blobNumber = 2;

            for (i = 0; i < dest.width; i++) {
                for (j = 0; j < dest.height; j++) {
                    if (dest[i][j] == 1) {
                        // an unmarked blob
                        // Mark all the cells and returns the total size:
                        blobSize = dest.floodFill(i, j, 1, blobNumber);
                        if (blobSize > topBlobSize) {
                            // if this blob is a new record
                            topBlobSize = blobSize;
                            topBlobNumber = blobNumber;
                        }
                        blobNumber++;
                    }
                }
            }

            // Figure out the top blob's height and width:
            dest.valueBounds(topBlobNumber, bounds);
        } while (
            (bounds.width < this.options.minWidth ||
                bounds.height < this.options.minHeight ||
                topBlobNumber == 0) &&
            --tries
        );

        // Replace the winning blob with 1's, and everything else with 0's:
        for (i = 0; i < dest.width; i++) {
            for (j = 0; j < dest.height; j++) {
                if (dest[i][j] == topBlobNumber) {
                    setFn(i, j);
                }
            }
        }

        GRID.free(dest);
        // Populate the returned variables.
        return bounds;
    }

    _cellularAutomataRound(grid: GRID.NumGrid) {
        let i, j, nbCount, newX, newY;
        let dir;
        let buffer2;

        buffer2 = GRID.alloc(grid.width, grid.height);
        buffer2.copy(grid); // Make a backup of this in buffer2, so that each generation is isolated.

        let didSomething = false;
        for (i = 0; i < grid.width; i++) {
            for (j = 0; j < grid.height; j++) {
                nbCount = 0;
                for (dir = 0; dir < XY.DIRS.length; dir++) {
                    newX = i + XY.DIRS[dir][0];
                    newY = j + XY.DIRS[dir][1];
                    if (grid.hasXY(newX, newY) && buffer2[newX][newY]) {
                        nbCount++;
                    }
                }
                if (
                    !buffer2[i][j] &&
                    this.options.birthParameters[nbCount] == 't'
                ) {
                    grid[i][j] = 1; // birth
                    didSomething = true;
                } else if (
                    buffer2[i][j] &&
                    this.options.survivalParameters[nbCount] == 't'
                ) {
                    // survival
                } else {
                    grid[i][j] = 0; // death
                    didSomething = true;
                }
            }
        }

        GRID.free(buffer2);
        return didSomething;
    }
}

export function fillBlob(
    grid: GRID.NumGrid,
    opts: Partial<BlobConfig> = {}
): XY.Bounds {
    const blob = new Blob(opts);
    return blob.carve(grid.width, grid.height, (x, y) => (grid[x][y] = 1));
}

export function make(opts: Partial<BlobConfig> = {}) {
    return new Blob(opts);
}
