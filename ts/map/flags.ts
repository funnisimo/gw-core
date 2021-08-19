import { fl as Fl } from '../flag';

export { GameObject, Depth } from '../gameObject/flags';
export { Tile, TileMech } from '../tile/flags';

///////////////////////////////////////////////////////
// CELL

export enum Cell {
    SEARCHED_FROM_HERE = Fl(0), // Player already auto-searched from here; can't auto search here again
    PRESSURE_PLATE_DEPRESSED = Fl(1), // so that traps do not trigger repeatedly while you stand on them
    KNOWN_TO_BE_TRAP_FREE = Fl(2), // keep track of where the player has stepped as he knows no traps are there

    CAUGHT_FIRE_THIS_TURN = Fl(3), // so that fire does not spread asymmetrically
    EVENT_FIRED_THIS_TURN = Fl(4), // so we don't update cells that have already changed this turn
    EVENT_PROTECTED = Fl(5),

    IS_IN_LOOP = Fl(6), // this cell is part of a terrain loop
    IS_CHOKEPOINT = Fl(7), // if this cell is blocked, part of the map will be rendered inaccessible
    IS_GATE_SITE = Fl(8), // consider placing a locked door here
    IS_IN_ROOM_MACHINE = Fl(9),
    IS_IN_AREA_MACHINE = Fl(10),
    IS_POWERED = Fl(11), // has been activated by machine power this turn (can probably be eliminate if needed)

    IMPREGNABLE = Fl(12), // no tunneling allowed!
    // DARKENED = Fl(13), // magical blindness?

    NEEDS_REDRAW = Fl(14), // needs to be redrawn (maybe in path, etc...)
    CELL_CHANGED = Fl(15), // one of the tiles or sprites (item, actor, fx) changed

    // These are to help memory
    HAS_SURFACE = Fl(16),
    HAS_LIQUID = Fl(17),
    HAS_GAS = Fl(18),
    HAS_PLAYER = Fl(19),
    HAS_ACTOR = Fl(20),
    HAS_DORMANT_MONSTER = Fl(21), // hidden monster on the square
    HAS_ITEM = Fl(22),

    IS_IN_PATH = Fl(23), // the yellow trail leading to the cursor
    IS_CURSOR = Fl(24), // the current cursor

    STABLE_MEMORY = Fl(25), // redraws will simply be pulled from the memory array, not recalculated

    IS_WIRED = Fl(26),
    IS_CIRCUIT_BREAKER = Fl(27),

    COLORS_DANCE = Fl(30),

    IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it

    PERMANENT_CELL_FLAGS = HAS_ITEM |
        HAS_DORMANT_MONSTER |
        STABLE_MEMORY |
        SEARCHED_FROM_HERE |
        PRESSURE_PLATE_DEPRESSED |
        KNOWN_TO_BE_TRAP_FREE |
        IS_IN_LOOP |
        IS_CHOKEPOINT |
        IS_GATE_SITE |
        IS_IN_MACHINE |
        IMPREGNABLE,

    HAS_ANY_ACTOR = HAS_PLAYER | HAS_ACTOR,
    HAS_ANY_OBJECT = HAS_ITEM | HAS_ANY_ACTOR,

    CELL_DEFAULT = NEEDS_REDRAW | CELL_CHANGED,
}

///////////////////////////////////////////////////////
// MAP

export enum Map {
    MAP_CHANGED = Fl(0),

    MAP_ALWAYS_LIT = Fl(3),
    MAP_SAW_WELCOME = Fl(4),

    MAP_NO_LIQUID = Fl(5),
    MAP_NO_GAS = Fl(6),

    MAP_CALC_FOV = Fl(7),
    MAP_FOV_CHANGED = Fl(8),

    MAP_DANCES = Fl(9),

    MAP_DEFAULT = 0,
}
