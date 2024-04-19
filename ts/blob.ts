import * as XY from './xy.js';
import * as GRID from './grid.js';
import { random, Random } from './rng.js';

export interface BlobConfig {
    rng: Random;
    rounds: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    percentSeeded: number;
    birthParameters: string /* char[9] */;
    survivalParameters: string /* char[9] */;
    tries: number;
    seedWidth: number;
    seedHeight: number;
    minPercentFilled: number;
    maxPercentFilled: number;
    largestOnly: boolean;
}

export class Blob {
    public options: BlobConfig = {
        rng: random,
        rounds: 5,
        minWidth: 10,
        minHeight: 10,
        maxWidth: 40,
        maxHeight: 20,
        percentSeeded: 50,
        birthParameters: 'ffffffttt',
        survivalParameters: 'ffffttttt',
        tries: 10,
        seedWidth: 0,
        seedHeight: 0,
        minPercentFilled: 30,
        maxPercentFilled: 90,
        largestOnly: true,
    };

    constructor(opts: Partial<BlobConfig> = {}) {
        Object.assign(this.options, opts);
        this.options.birthParameters =
            this.options.birthParameters.toLowerCase();
        this.options.survivalParameters =
            this.options.survivalParameters.toLowerCase();

        if (this.options.percentSeeded < 1) {
            this.options.percentSeeded = Math.floor(
                this.options.percentSeeded * 100
            );
        }
        if (this.options.minPercentFilled < 1) {
            this.options.minPercentFilled = Math.floor(
                this.options.minPercentFilled * 100
            );
        }
        if (this.options.maxPercentFilled < 1) {
            this.options.maxPercentFilled = Math.floor(
                this.options.maxPercentFilled * 100
            );
        }

        if (this.options.minWidth >= this.options.maxWidth) {
            this.options.minWidth = Math.round(0.75 * this.options.maxWidth);
            this.options.maxWidth = Math.round(1.25 * this.options.maxWidth);
        }
        if (this.options.minHeight >= this.options.maxHeight) {
            this.options.minHeight = Math.round(0.75 * this.options.maxHeight);
            this.options.maxHeight = Math.round(1.25 * this.options.maxHeight);
        }

        if (!this.options.seedWidth) {
            this.options.seedWidth = this.options.maxWidth;
        }
        if (!this.options.seedHeight) {
            this.options.seedHeight = this.options.maxHeight;
        }
    }

    carve(width: number, height: number, setFn: XY.XYFunc): XY.Bounds {
        let i, j, k;
        let blobNumber: number,
            blobSize: number,
            topBlobNumber: number,
            topBlobSize: number;

        let bounds = new XY.Bounds(0, 0, 0, 0);
        const dest = GRID.alloc(width, height);

        const maxWidth = Math.min(width, this.options.maxWidth);
        const maxHeight = Math.min(height, this.options.maxHeight);

        const minWidth = Math.min(width, this.options.minWidth);
        const minHeight = Math.min(height, this.options.minHeight);

        const seedWidth = this.options.seedWidth;
        const seedHeight = this.options.seedHeight;
        const seedLeft = Math.floor((dest.width - seedWidth) / 2);
        const seedTop = Math.floor((dest.height - seedHeight) / 2);

        const minPctFilled = this.options.minPercentFilled;
        const maxPctFilled = this.options.maxPercentFilled;
        let pctFilled = 0;

        let tries = this.options.tries;

        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
        do {
            // Clear buffer.
            dest.fill(0);

            // Fill relevant portion with noise based on the percentSeeded argument.
            for (i = 0; i < seedWidth; i++) {
                for (j = 0; j < seedHeight; j++) {
                    dest._data[i + seedLeft][j + seedTop] =
                        this.options.rng.chance(this.options.percentSeeded)
                            ? 1
                            : 0;
                }
            }

            // Some iterations of cellular automata
            for (k = 0; k < this.options.rounds; k++) {
                if (
                    !cellularAutomataRound(
                        dest,
                        this.options.birthParameters,
                        this.options.survivalParameters
                    )
                ) {
                    // TODO - why not just break?
                    k = this.options.rounds; // cellularAutomataRound did not make any changes
                }
            }

            dest.calcBounds(1, bounds);

            if (bounds.width > maxWidth) {
                const iters = Math.floor((dest.width - maxWidth) / 2);
                for (let x = 0; x < iters; ++x) {
                    for (let y = 0; y < height; ++y) {
                        dest.set(x, y, 0);
                        dest.set(width - x - 1, y, 0);
                    }
                }
            }
            if (bounds.height > maxHeight) {
                const iters = Math.floor((dest.height - maxHeight) / 2);
                for (let y = 0; y < iters; ++y) {
                    for (let x = 0; x < width; ++x) {
                        dest.set(x, y, 0);
                        dest.set(x, height - y - 1, 0);
                    }
                }
            }

            // Now to measure the result. These are best-of variables; start them out at worst-case values.
            topBlobSize = 0;
            topBlobNumber = 0;

            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
            blobNumber = 2;

            if (this.options.largestOnly) {
                dest.forEach((v, i, j) => {
                    if (v == 1) {
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
                });
                // Figure out the top blob's height and width:
                dest.calcBounds(topBlobNumber, bounds);
            } else {
                dest.forEach((v) => {
                    if (v > 0) ++topBlobSize;
                });
                dest.calcBounds((v) => v > 0, bounds);
                topBlobNumber = 1;
            }

            // Calc the percent of that area that is filled
            pctFilled = Math.floor(
                (100 * topBlobSize) / (bounds.width * bounds.height)
            );
        } while (
            (bounds.width < minWidth ||
                bounds.height < minHeight ||
                bounds.width > maxWidth ||
                bounds.height > maxHeight ||
                topBlobNumber == 0 ||
                pctFilled < minPctFilled ||
                pctFilled > maxPctFilled) &&
            --tries
        );

        if (tries <= 0) {
            console.warn(
                'Failed to find successful blob, returning last attempt.'
            );
            if (bounds.width < minWidth) console.log(' - too narrow');
            if (bounds.height < minHeight) console.log(' - too short');
            if (bounds.width > maxWidth) console.log(' - too wide');
            if (bounds.height > maxHeight) console.log(' - too tall');
            if (topBlobNumber == 0) console.log(' - empty');
            if (pctFilled < minPctFilled) console.log(' - too sparse');
            if (pctFilled > maxPctFilled) console.log(' - too dense');

            dest.dump();
        }

        // Replace the winning blob with 1's, and everything else with 0's:
        dest.forEach((v, i, j) => {
            if (!v) return;
            if (!this.options.largestOnly || v == topBlobNumber) {
                setFn(i, j);
            }
        });

        GRID.free(dest);
        // Populate the returned variables.
        return bounds;
    }
}

export function fillBlob(
    grid: GRID.NumGrid,
    opts: Partial<BlobConfig> = {}
): XY.Bounds {
    const blob = new Blob(opts);
    return blob.carve(
        grid.width,
        grid.height,
        (x, y) => (grid._data[x][y] = 1)
    );
}

export function make(opts: Partial<BlobConfig> = {}) {
    return new Blob(opts);
}

export function cellularAutomataRound(
    grid: GRID.NumGrid,
    birthParameters: string,
    survivalParameters: string
): boolean {
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
                if (grid.hasXY(newX, newY) && buffer2._data[newX][newY]) {
                    nbCount++;
                }
            }
            if (!buffer2._data[i][j] && birthParameters[nbCount] == 't') {
                grid._data[i][j] = 1; // birth
                didSomething = true;
            } else if (
                buffer2._data[i][j] &&
                survivalParameters[nbCount] == 't'
            ) {
                // survival
            } else {
                grid._data[i][j] = 0; // death
                didSomething = true;
            }
        }
    }

    GRID.free(buffer2);
    return didSomething;
}
