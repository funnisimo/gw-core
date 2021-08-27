import * as Grid from './grid';
import * as XY from './xy';

export const FORBIDDEN = -1;
export const OBSTRUCTION = -2;
export const AVOIDED = 10;
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
    //   distanceMap.x = destinationX;
    //   distanceMap.y = destinationY;
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
    let dir, bestDir;
    let blocked;

    // brogueAssert(coordinatesAreInMap(x, y));

    bestScore = 0;
    bestDir = XY.NO_DIRECTION;

    for (dir = 0; dir < (useDiagonals ? 8 : 4); ++dir) {
        newX = x + XY.DIRS[dir][0];
        newY = y + XY.DIRS[dir][1];

        blocked = isBlocked(newX, newY, x, y, distanceMap);

        if (
            !blocked &&
            distanceMap[x][y] - distanceMap[newX][newY] > bestScore
        ) {
            bestDir = dir;
            bestScore = distanceMap[x][y] - distanceMap[newX][newY];
        }
    }
    return XY.DIRS[bestDir] || null;
}

function getClosestValidLocationOnMap(
    distanceMap: Grid.NumGrid,
    x: number,
    y: number
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
            if (distanceMap[i][j] >= 0 && distanceMap[i][j] < NO_PATH) {
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
    isBlocked: BlockedFn
) {
    // actor = actor || GW.PLAYER;
    let x = originX;
    let y = originY;
    let steps = 0;

    if (distanceMap[x][y] < 0 || distanceMap[x][y] >= NO_PATH) {
        const loc = getClosestValidLocationOnMap(distanceMap, x, y);
        if (loc) {
            x = loc[0];
            y = loc[1];
        }
    }

    const path = [[x, y]];
    let dir;
    do {
        dir = nextStep(distanceMap, x, y, isBlocked, true);
        if (dir) {
            x += dir[0];
            y += dir[1];
            // path[steps][0] = x;
            // path[steps][1] = y;
            path.push([x, y]);
            steps++;
            // brogueAssert(coordinatesAreInMap(x, y));
        }
    } while (dir);

    return steps ? path : null;
}
