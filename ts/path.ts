import * as Grid from './grid';
import * as XY from './xy';
import { FALSE } from './utils';
import { grid } from '.';

export const FORBIDDEN = -1;
export const OBSTRUCTION = -2;
export const AVOIDED = 10;
export const OK = 1;
export const NO_PATH = 30000;

export type BlockedFn = (
    toX: number,
    toY: number,
    fromX: number,
    fromY: number,
    distanceMap: Grid.NumGrid
) => boolean;

interface CostLink {
    distance: number;
    cost: number;
    index: number;
    left: CostLink | null;
    right: CostLink | null;
}

interface DijkstraMap {
    eightWays: boolean;
    front: CostLink;
    links: CostLink[];
    width: number;
    height: number;
}

function makeCostLink(i: number) {
    return {
        distance: 0,
        cost: 0,
        index: i,
        left: null,
        right: null,
    } as CostLink;
}

function makeDijkstraMap(w: number, h: number) {
    return {
        eightWays: false,
        front: makeCostLink(-1),
        links: Grid.makeArray(w * h, (i) => makeCostLink(i)),
        width: w,
        height: h,
    } as DijkstraMap;
}

function getLink(map: DijkstraMap, x: number, y: number): CostLink {
    return map.links[x + map.width * y];
}

const DIRS = XY.DIRS;

function update(map: DijkstraMap) {
    let dir, dirs;
    let linkIndex;
    let left = null,
        right = null,
        link = null;

    dirs = map.eightWays ? 8 : 4;

    let head = map.front.right;
    map.front.right = null;

    while (head != null) {
        for (dir = 0; dir < dirs; dir++) {
            linkIndex = head.index + (DIRS[dir][0] + map.width * DIRS[dir][1]);
            if (linkIndex < 0 || linkIndex >= map.width * map.height) continue;
            link = map.links[linkIndex];

            // verify passability
            if (link.cost < 0) continue;
            let diagCost = 0;
            if (dir >= 4) {
                diagCost = 0.4142;
                let way1, way1index, way2, way2index;
                way1index = head.index + DIRS[dir][0];
                if (way1index < 0 || way1index >= map.width * map.height)
                    continue;

                way2index = head.index + map.width * DIRS[dir][1];
                if (way2index < 0 || way2index >= map.width * map.height)
                    continue;

                way1 = map.links[way1index];
                way2 = map.links[way2index];

                if (way1.cost == OBSTRUCTION || way2.cost == OBSTRUCTION)
                    continue;
            }

            if (head.distance + link.cost + diagCost < link.distance) {
                link.distance = head.distance + link.cost + diagCost;

                // reinsert the touched cell; it'll be close to the beginning of the list now, so
                // this will be very fast.  start by removing it.

                if (link.right != null) link.right.left = link.left;
                if (link.left != null) link.left.right = link.right;

                left = head;
                right = head.right;
                while (right != null && right.distance < link.distance) {
                    left = right;
                    right = right.right;
                }
                if (left != null) left.right = link;
                link.right = right;
                link.left = left;
                if (right != null) right.left = link;
            }
        }

        right = head.right;

        head.left = null;
        head.right = null;

        head = right;
    }
}

function clear(map: DijkstraMap, maxDistance: number, eightWays: boolean) {
    let i;

    map.eightWays = eightWays;

    map.front.right = null;

    for (i = 0; i < map.width * map.height; i++) {
        map.links[i].distance = maxDistance;
        map.links[i].left = map.links[i].right = null;
    }
}

function setDistance(map: DijkstraMap, x: number, y: number, distance: number) {
    let left, right, link;

    if (x > 0 && y > 0 && x < map.width - 1 && y < map.height - 1) {
        link = getLink(map, x, y);
        if (link.distance > distance) {
            link.distance = distance;

            if (link.right != null) link.right.left = link.left;
            if (link.left != null) link.left.right = link.right;

            left = map.front;
            right = map.front.right;

            while (right != null && right.distance < link.distance) {
                left = right;
                right = right.right;
            }

            link.right = right;
            link.left = left;
            left.right = link;
            if (right != null) right.left = link;
        }
    }
}

function isBoundaryXY(data: Grid.NumGrid, x: number, y: number) {
    if (x <= 0 || y <= 0) return true;
    if (x >= data.length - 1 || y >= data[0].length - 1) return true;
    return false;
}

function batchInput(
    map: DijkstraMap,
    distanceMap: Grid.NumGrid,
    costMap: Grid.NumGrid,
    eightWays = false,
    maxDistance = NO_PATH
) {
    let i, j;

    map.eightWays = eightWays;

    let left: CostLink | null = null;
    let right: CostLink | null = null;

    map.front.right = null;
    for (i = 0; i < distanceMap.width; i++) {
        for (j = 0; j < distanceMap.height; j++) {
            let link = getLink(map, i, j);

            if (distanceMap) {
                link.distance = distanceMap[i][j];
            } else {
                if (costMap) {
                    // totally hackish; refactor
                    link.distance = maxDistance;
                }
            }

            let cost;

            if (
                i == 0 ||
                j == 0 ||
                i == distanceMap.width - 1 ||
                j == distanceMap.height - 1
            ) {
                cost = OBSTRUCTION;
                // }
                // else if (costMap === null) {
                //     if (
                //         cellHasEntityFlag(i, j, L_BLOCKS_MOVE) &&
                //         cellHasEntityFlag(i, j, L_BLOCKS_DIAGONAL)
                //     ) {
                //         cost = OBSTRUCTION;
                //     } else {
                //         cost = FORBIDDEN;
                //     }
            } else {
                cost = costMap[i][j];
            }

            link.cost = cost;

            if (cost > 0) {
                if (link.distance < maxDistance) {
                    // @ts-ignore
                    if (right === null || right.distance > link.distance) {
                        // left and right are used to traverse the list; if many cells have similar values,
                        // some time can be saved by not clearing them with each insertion.  this time,
                        // sadly, we have to start from the front.

                        left = map.front;
                        right = map.front.right;
                    }

                    // @ts-ignore
                    while (right !== null && right.distance < link.distance) {
                        left = right;
                        // @ts-ignore
                        right = right.right;
                    }

                    link.right = right;
                    link.left = left;
                    // @ts-ignore
                    left.right = link;
                    // @ts-ignore
                    if (right !== null) right.left = link;

                    left = link;
                } else {
                    link.right = null;
                    link.left = null;
                }
            } else {
                link.right = null;
                link.left = null;
            }
        }
    }
}

function batchOutput(map: DijkstraMap, distanceMap: Grid.NumGrid) {
    let i, j;

    update(map);
    // transfer results to the distanceMap
    for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
            distanceMap[i][j] = getLink(map, i, j).distance;
        }
    }
}

var DIJKSTRA_MAP: DijkstraMap;

export function calculateDistances(
    distanceMap: Grid.NumGrid,
    destinationX: number,
    destinationY: number,
    costMap: Grid.NumGrid,
    eightWays = false,
    maxDistance = NO_PATH
) {
    const width = distanceMap.length;
    const height = distanceMap[0].length;

    if (maxDistance <= 0) maxDistance = NO_PATH;

    if (
        !DIJKSTRA_MAP ||
        DIJKSTRA_MAP.width < width ||
        DIJKSTRA_MAP.height < height
    ) {
        DIJKSTRA_MAP = makeDijkstraMap(width, height);
    }

    DIJKSTRA_MAP.width = width;
    DIJKSTRA_MAP.height = height;

    let i, j;

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            getLink(DIJKSTRA_MAP, i, j).cost = isBoundaryXY(costMap, i, j)
                ? OBSTRUCTION
                : costMap[i][j];
        }
    }

    clear(DIJKSTRA_MAP, maxDistance, eightWays);
    setDistance(DIJKSTRA_MAP, destinationX, destinationY, 0);
    batchOutput(DIJKSTRA_MAP, distanceMap);
    // TODO - Add this where called!
    distanceMap.x = destinationX;
    distanceMap.y = destinationY;
}

export function rescan(
    distanceMap: Grid.NumGrid,
    costMap: Grid.NumGrid,
    eightWays = false,
    maxDistance = NO_PATH
) {
    if (!DIJKSTRA_MAP) throw new Error('You must scan the map first.');
    batchInput(DIJKSTRA_MAP, distanceMap, costMap, eightWays, maxDistance);
    batchOutput(DIJKSTRA_MAP, distanceMap);
}

// Returns null if there are no beneficial moves.
// If preferDiagonals is true, we will prefer diagonal moves.
// Always rolls downhill on the distance map.
// If monst is provided, do not return a direction pointing to
// a cell that the monster avoids.
export function nextStep(
    distanceMap: Grid.NumGrid,
    x: number,
    y: number,
    isBlocked: BlockedFn,
    useDiagonals = false
) {
    let newX, newY, bestScore;
    let dir;

    // brogueAssert(coordinatesAreInMap(x, y));

    bestScore = 0;
    let bestDir = XY.NO_DIRECTION;

    const dist = distanceMap[x][y];
    for (dir = 0; dir < (useDiagonals ? 8 : 4); ++dir) {
        newX = x + XY.DIRS[dir][0];
        newY = y + XY.DIRS[dir][1];
        const newDist = distanceMap[newX][newY];
        if (newDist < dist) {
            const diff = dist - newDist;
            if (diff > bestScore && !isBlocked(newX, newY, x, y, distanceMap)) {
                bestDir = dir;
                bestScore = diff;
            }
        }
    }
    return XY.DIRS[bestDir] || null;
}

export function getClosestValidLocation(
    distanceMap: Grid.NumGrid,
    x: number,
    y: number,
    blocked: BlockedFn = FALSE
) {
    let i, j, dist, closestDistance, lowestMapScore;
    let locX = -1;
    let locY = -1;

    const width = distanceMap.length;
    const height = distanceMap[0].length;

    closestDistance = 10000;
    lowestMapScore = 10000;
    for (i = 1; i < width - 1; i++) {
        for (j = 1; j < height - 1; j++) {
            if (
                distanceMap[i][j] >= 0 &&
                distanceMap[i][j] < NO_PATH &&
                !blocked(i, j, i, j, distanceMap)
            ) {
                dist = (i - x) * (i - x) + (j - y) * (j - y);
                if (
                    dist < closestDistance ||
                    (dist == closestDistance &&
                        distanceMap[i][j] < lowestMapScore)
                ) {
                    locX = i;
                    locY = j;
                    closestDistance = dist;
                    lowestMapScore = distanceMap[i][j];
                }
            }
        }
    }
    if (locX >= 0) return [locX, locY];
    return null;
}

// Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the number of steps in the path.
export function getPath(
    distanceMap: Grid.NumGrid,
    originX: number,
    originY: number,
    isBlocked: BlockedFn,
    eightWays = false
): XY.Loc[] | null {
    // actor = actor || GW.PLAYER;
    let x = originX;
    let y = originY;

    if (
        distanceMap[x][y] < 0 ||
        distanceMap[x][y] >= NO_PATH ||
        isBlocked(x, y, x, y, distanceMap)
    ) {
        const loc = getClosestValidLocation(distanceMap, x, y, isBlocked);
        if (!loc) return null;
        x = loc[0];
        y = loc[1];
    }

    const path: XY.Loc[] = [];
    let dir;
    do {
        dir = nextStep(distanceMap, x, y, isBlocked, eightWays);
        if (dir) {
            path.push([x, y]);
            x += dir[0];
            y += dir[1];
            // path[steps][0] = x;
            // path[steps][1] = y;
            // brogueAssert(coordinatesAreInMap(x, y));
        }
    } while (dir);

    return path.length ? path : null;
}

export function getPathBetween(
    width: number,
    height: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    costFn: (x: number, y: number) => number,
    eightWays = true
): XY.Loc[] | null {
    const costMap = Grid.alloc(width, height);
    const distanceMap = Grid.alloc(width, height);

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            costMap[x][y] = costFn(x, y);
        }
    }

    calculateDistances(distanceMap, toX, toY, costMap, eightWays);

    const isBlocked = (x: number, y: number) => costFn(x, y) < 0;

    const path = getPath(distanceMap, fromX, fromY, isBlocked, eightWays);

    Grid.free(distanceMap);
    grid.free(costMap);

    return path;
}
