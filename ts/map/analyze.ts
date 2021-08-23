import { MapType, CellType } from './types';
import * as Grid from '../grid';
import * as Utils from '../utils';
import { GameObject as ObjectFlags } from '../gameObject/flags';
import { Cell as CellFlags } from './flags';

export function analyze(map: MapType, updateChokeCounts = true) {
    updateLoopiness(map);
    updateChokepoints(map, updateChokeCounts);
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// TODO - Move to Map?

export function updateChokepoints(map: MapType, updateCounts: boolean) {
    const passMap = Grid.alloc(map.width, map.height);
    const grid = Grid.alloc(map.width, map.height);

    for (let i = 0; i < map.width; i++) {
        for (let j = 0; j < map.height; j++) {
            const cell = map.cell(i, j);
            if (
                (cell.blocksPathing() || cell.blocksMove()) &&
                !cell.hasObjectFlag(ObjectFlags.L_SECRETLY_PASSABLE)
            ) {
                // cell.flags &= ~CellFlags.IS_IN_LOOP;
                passMap[i][j] = 0;
            } else {
                // cell.flags |= CellFlags.IS_IN_LOOP;
                passMap[i][j] = 1;
            }
        }
    }

    let passableArcCount;

    // done finding loops; now flag chokepoints
    for (let i = 1; i < passMap.width - 1; i++) {
        for (let j = 1; j < passMap.height - 1; j++) {
            map.cell(i, j).flags.cell &= ~CellFlags.IS_CHOKEPOINT;
            if (
                passMap[i][j] &&
                !(map.cell(i, j).flags.cell & CellFlags.IS_IN_LOOP)
            ) {
                passableArcCount = 0;
                for (let dir = 0; dir < 8; dir++) {
                    const oldX = i + Utils.CLOCK_DIRS[(dir + 7) % 8][0];
                    const oldY = j + Utils.CLOCK_DIRS[(dir + 7) % 8][1];
                    const newX = i + Utils.CLOCK_DIRS[dir][0];
                    const newY = j + Utils.CLOCK_DIRS[dir][1];
                    if (
                        (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY]) !=
                        (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
                            passMap[oldX][oldY])
                    ) {
                        if (++passableArcCount > 2) {
                            if (
                                (!passMap[i - 1][j] && !passMap[i + 1][j]) ||
                                (!passMap[i][j - 1] && !passMap[i][j + 1])
                            ) {
                                map.cell(i, j).flags.cell |=
                                    CellFlags.IS_CHOKEPOINT;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    if (updateCounts) {
        // Done finding chokepoints; now create a chokepoint map.

        // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
        // then the number indicates the number of tiles that would be rendered unreachable if the
        // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
        // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
        // were blocked.
        // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.

        // Start by setting the chokepoint values really high, and roping off room machines.
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                map.cell(i, j).chokeCount = 30000;
                // Not sure why this was done in Brogue
                // if (map.cell(i, j).flags.cell & CellFlags.IS_IN_ROOM_MACHINE) {
                //     passMap[i][j] = 0;
                // }
            }
        }

        // Scan through and find a chokepoint next to an open point.

        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                const cell = map.cell(i, j);

                if (
                    passMap[i][j] &&
                    cell.flags.cell & CellFlags.IS_CHOKEPOINT
                ) {
                    for (let dir = 0; dir < 4; dir++) {
                        const newX = i + Utils.DIRS[dir][0];
                        const newY = j + Utils.DIRS[dir][1];
                        if (
                            map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY] &&
                            !(
                                map.cell(newX, newY).flags.cell &
                                CellFlags.IS_CHOKEPOINT
                            )
                        ) {
                            // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                            // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                            // Keep track of the flooded region in grid[][].
                            grid.fill(0);
                            passMap[i][j] = 0;
                            let cellCount = floodFillCount(
                                map,
                                grid,
                                passMap,
                                newX,
                                newY
                            );
                            passMap[i][j] = 1;

                            // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                            // CellCounts less than 4 are not useful, so we skip those cases.

                            if (cellCount >= 4) {
                                // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                for (let i2 = 0; i2 < grid.width; i2++) {
                                    for (let j2 = 0; j2 < grid.height; j2++) {
                                        if (
                                            grid[i2][j2] &&
                                            cellCount <
                                                map.cell(i2, j2).chokeCount
                                        ) {
                                            map.cell(
                                                i2,
                                                j2
                                            ).chokeCount = cellCount;
                                            map.cell(
                                                i2,
                                                j2
                                            ).flags.cell &= ~CellFlags.IS_GATE_SITE;
                                        }
                                    }
                                }

                                // The chokepoint itself should also take the lesser of its current value or the flood count.
                                if (cellCount < cell.chokeCount) {
                                    cell.chokeCount = cellCount;
                                    cell.flags.cell |= CellFlags.IS_GATE_SITE;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Grid.free(passMap);
    Grid.free(grid);
}

// Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
// Returns 10000 if the area included an area machine.
export function floodFillCount(
    map: MapType,
    results: Grid.NumGrid,
    passMap: Grid.NumGrid,
    startX: number,
    startY: number
) {
    let count = passMap[startX][startY] == 2 ? 5000 : 1;

    if (map.cell(startX, startY).flags.cell & CellFlags.IS_IN_AREA_MACHINE) {
        count = 10000;
    }

    results[startX][startY] = 1;

    for (let dir = 0; dir < 4; dir++) {
        const newX = startX + Utils.DIRS[dir][0];
        const newY = startY + Utils.DIRS[dir][1];

        if (
            map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
            passMap[newX][newY] &&
            !results[newX][newY]
        ) {
            count += floodFillCount(map, results, passMap, newX, newY);
        }
    }
    return Math.min(count, 10000);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// TODO = Move loopiness to Map

export function updateLoopiness(map: MapType) {
    map.eachCell(resetLoopiness);
    map.eachCell(checkLoopiness);
    cleanLoopiness(map);
}

export function resetLoopiness(
    cell: CellType,
    _x: number,
    _y: number,
    _map: MapType
) {
    if (
        (cell.blocksPathing() || cell.blocksMove()) &&
        !cell.hasObjectFlag(ObjectFlags.L_SECRETLY_PASSABLE)
    ) {
        cell.flags.cell &= ~CellFlags.IS_IN_LOOP;
        // passMap[i][j] = false;
    } else {
        cell.flags.cell |= CellFlags.IS_IN_LOOP;
        // passMap[i][j] = true;
    }
}

export function checkLoopiness(
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) {
    let inString;
    let newX, newY, dir, sdir;
    let numStrings, maxStringLength, currentStringLength;

    if (!cell || !(cell.flags.cell & CellFlags.IS_IN_LOOP)) {
        return false;
    }

    // find an unloopy neighbor to start on
    for (sdir = 0; sdir < 8; sdir++) {
        newX = x + Utils.CLOCK_DIRS[sdir][0];
        newY = y + Utils.CLOCK_DIRS[sdir][1];

        if (!map.hasXY(newX, newY)) continue;

        const cell = map.get(newX, newY);
        if (!cell || !(cell.flags.cell & CellFlags.IS_IN_LOOP)) {
            break;
        }
    }
    if (sdir == 8) {
        // no unloopy neighbors
        return false; // leave cell loopy
    }

    // starting on this unloopy neighbor,
    // work clockwise and count up:
    // (a) the number of strings of loopy neighbors, and
    // (b) the length of the longest such string.
    numStrings = maxStringLength = currentStringLength = 0;
    inString = false;
    for (dir = sdir; dir < sdir + 8; dir++) {
        newX = x + Utils.CLOCK_DIRS[dir % 8][0];
        newY = y + Utils.CLOCK_DIRS[dir % 8][1];
        if (!map.hasXY(newX, newY)) continue;

        const newCell = map.get(newX, newY);
        if (newCell && newCell.flags.cell & CellFlags.IS_IN_LOOP) {
            currentStringLength++;
            if (!inString) {
                if (numStrings > 0) {
                    return false; // more than one string here; leave loopy
                }
                numStrings++;
                inString = true;
            }
        } else if (inString) {
            if (currentStringLength > maxStringLength) {
                maxStringLength = currentStringLength;
            }
            currentStringLength = 0;
            inString = false;
        }
    }

    if (inString && currentStringLength > maxStringLength) {
        maxStringLength = currentStringLength;
    }
    if (numStrings == 1 && maxStringLength <= 4) {
        cell.flags.cell &= ~CellFlags.IS_IN_LOOP;

        for (dir = 0; dir < 8; dir++) {
            const newX = x + Utils.CLOCK_DIRS[dir][0];
            const newY = y + Utils.CLOCK_DIRS[dir][1];
            if (map.hasXY(newX, newY)) {
                const newCell = map.cell(newX, newY);
                checkLoopiness(newCell, newX, newY, map);
            }
        }
        return true;
    } else {
        return false;
    }
}

export function fillInnerLoopGrid(map: MapType, grid: Grid.NumGrid) {
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            const cell = map.cell(x, y);
            if (cell.flags.cell & CellFlags.IS_IN_LOOP) {
                grid[x][y] = 1;
            } else if (x > 0 && y > 0) {
                const up = map.cell(x, y - 1);
                const left = map.cell(x - 1, y);
                if (
                    up.flags.cell & CellFlags.IS_IN_LOOP &&
                    left.flags.cell & CellFlags.IS_IN_LOOP
                ) {
                    grid[x][y] = 1;
                }
            }
        }
    }
}

export function cleanLoopiness(map: MapType) {
    // remove extraneous loop markings
    const grid = Grid.alloc(map.width, map.height);
    fillInnerLoopGrid(map, grid);

    // const xy = { x: 0, y: 0 };
    let designationSurvives;

    for (let i = 0; i < grid.width; i++) {
        for (let j = 0; j < grid.height; j++) {
            const cell = map.cell(i, j);
            if (cell.flags.cell & CellFlags.IS_IN_LOOP) {
                designationSurvives = false;
                for (let dir = 0; dir < 8; dir++) {
                    let newX = i + Utils.CLOCK_DIRS[dir][0];
                    let newY = j + Utils.CLOCK_DIRS[dir][1];

                    if (
                        map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                        !grid[newX][newY] &&
                        !(
                            map.cell(newX, newY).flags.cell &
                            CellFlags.IS_IN_LOOP
                        )
                    ) {
                        designationSurvives = true;
                        break;
                    }
                }
                if (!designationSurvives) {
                    grid[i][j] = 1;
                    map.cell(i, j).flags.cell &= ~CellFlags.IS_IN_LOOP;
                }
            }
        }
    }
    Grid.free(grid);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
