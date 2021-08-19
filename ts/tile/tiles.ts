import * as Tile from './tile';

// These are the minimal set of tiles to make the diggers work
Tile.install('NULL', {
    ch: '\u2205',
    fg: 'white',
    bg: 'black',
    flags: 'L_BLOCKS_MOVE',
    name: 'eerie nothingness',
    article: 'an',
    priority: 0,
});

Tile.install('FLOOR', {
    ch: '\u00b7',
    fg: [30, 30, 30, 20, 0, 0, 0],
    bg: [2, 2, 10, 0, 2, 2, 0],
    priority: 10,
    article: 'the',
});

Tile.install('DOOR', {
    ch: '+',
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 30,
    flags:
        'T_IS_DOOR, L_BLOCKS_EFFECTS, L_BLOCKS_ITEMS, L_BLOCKS_VISION, L_VISUALLY_DISTINCT',
    article: 'a',
    effects: {
        enter: { tile: 'DOOR_OPEN' },
        open: { tile: 'DOOR_OPEN_ALWAYS' },
    },
});

Tile.install('DOOR_OPEN', 'DOOR', {
    ch: "'",
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 40,
    flags: '!L_BLOCKS_ITEMS, !L_BLOCKS_VISION',
    name: 'open door',
    article: 'an',
    effects: {
        tick: {
            chance: 100 * 100, // 100%
            tile: 'DOOR',
            flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY',
        },
        enter: null,
        open: null,
        close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
    },
});

Tile.install('DOOR_OPEN_ALWAYS', 'DOOR_OPEN', {
    effects: {
        tick: null,
        close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
    },
});

Tile.install('UP_STAIRS', {
    ch: '<',
    fg: [100, 50, 50],
    bg: [40, 20, 20],
    priority: 200,
    flags:
        'T_UP_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
    name: 'upward staircase',
    article: 'an',
    effects: {
        player: { emit: 'UP_STAIRS' },
    },
});
Tile.install('DOWN_STAIRS', {
    ch: '>',
    fg: [100, 50, 50],
    bg: [40, 20, 20],
    priority: 200,
    flags:
        'T_DOWN_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
    name: 'downward staircase',
    article: 'a',
    effects: {
        player: { emit: 'DOWN_STAIRS' },
    },
});

Tile.install('WALL', {
    ch: '#',
    fg: [7, 7, 7, 0, 3, 3, 3],
    bg: [40, 40, 40, 10, 10, 0, 5],
    priority: 100,
    flags: 'L_WALL_FLAGS',
    article: 'a',
    name: 'stone wall',
    description: 'A wall made from rough cut stone.',
    flavor: 'a rough stone wall',
});

Tile.install('IMPREGNABLE', {
    ch: '#',
    fg: [7, 7, 7, 0, 3, 3, 3],
    bg: [40, 40, 40, 10, 10, 0, 5],
    priority: 100,
    flags: 'L_WALL_FLAGS, IMPREGNABLE',
    article: 'a',
    name: 'impregnable wall',
    description: 'A wall made from very hard stone.',
    flavor: 'an impregnable wall',
});

Tile.install('LAKE', {
    ch: '~',
    fg: [5, 8, 20, 10, 0, 4, 15, true],
    bg: [10, 15, 41, 6, 5, 5, 5, true],
    priority: 50,
    flags: 'T_DEEP_WATER',
    name: 'deep water',
    article: 'the',
});

Tile.install('SHALLOW', {
    ch: '\u00b7',
    fg: [5, 8, 10, 10, 0, 4, 15, true],
    bg: [10, 30, 30, 6, 0, 10, 10, true],
    priority: 20,
    name: 'shallow water',
    article: 'the',
    depth: 'SURFACE', // 'LIQUID'?
});

Tile.install('BRIDGE', {
    ch: '=',
    fg: [100, 40, 40],
    priority: 40,
    depth: 'SURFACE',
    flags: 'T_BRIDGE, L_VISUALLY_DISTINCT',
    article: 'a',
    groundTile: 'LAKE',
});
