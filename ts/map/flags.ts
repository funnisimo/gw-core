import { fl as Fl } from '../flag';

///////////////////////////////////////////////////////
// CELL

export enum Cell {
    VISIBLE = Fl(0), // cell has sufficient light and is in field of view, ready to draw.
    WAS_VISIBLE = Fl(1),
    CLAIRVOYANT_VISIBLE = Fl(2),
    WAS_CLAIRVOYANT_VISIBLE = Fl(3),
    TELEPATHIC_VISIBLE = Fl(4), // potions of telepathy let you see through other creatures' eyes
    WAS_TELEPATHIC_VISIBLE = Fl(5), // potions of telepathy let you see through other creatures' eyes
    ITEM_DETECTED = Fl(6),
    WAS_ITEM_DETECTED = Fl(7),
    MONSTER_DETECTED = Fl(8),
    WAS_MONSTER_DETECTED = Fl(9),

    REVEALED = Fl(10),
    MAGIC_MAPPED = Fl(11),
    IN_FOV = Fl(12), // player has unobstructed line of sight whether or not there is enough light
    WAS_IN_FOV = Fl(13),

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

    LIGHT_CHANGED = Fl(26), // Light level changed this turn
    CELL_LIT = Fl(27),
    IS_IN_SHADOW = Fl(28), // so that a player gains an automatic stealth bonus
    CELL_DARK = Fl(29),

    COLORS_DANCE = Fl(30),

    PERMANENT_CELL_FLAGS = REVEALED |
        MAGIC_MAPPED |
        ITEM_DETECTED |
        HAS_ITEM |
        HAS_DORMANT_MONSTER |
        STABLE_MEMORY,

    ANY_KIND_OF_VISIBLE = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE,
    HAS_ANY_ACTOR = HAS_PLAYER | HAS_ACTOR,
    IS_WAS_ANY_KIND_OF_VISIBLE = VISIBLE |
        WAS_VISIBLE |
        CLAIRVOYANT_VISIBLE |
        WAS_CLAIRVOYANT_VISIBLE |
        TELEPATHIC_VISIBLE |
        WAS_TELEPATHIC_VISIBLE,

    WAS_ANY_KIND_OF_VISIBLE = WAS_VISIBLE |
        WAS_CLAIRVOYANT_VISIBLE |
        WAS_TELEPATHIC_VISIBLE,

    CELL_DEFAULT = VISIBLE | IN_FOV | NEEDS_REDRAW | CELL_CHANGED, // !CELL_LIT until lights remove the shadow
}

///////////////////////////////////////////////////////
// CELL MECH

export enum CellMech {
    SEARCHED_FROM_HERE = Fl(0), // Player already auto-searched from here; can't auto search here again
    PRESSURE_PLATE_DEPRESSED = Fl(1), // so that traps do not trigger repeatedly while you stand on them
    KNOWN_TO_BE_TRAP_FREE = Fl(2), // keep track of where the player has stepped as he knows no traps are there

    CAUGHT_FIRE_THIS_TURN = Fl(4), // so that fire does not spread asymmetrically
    EVENT_FIRED_THIS_TURN = Fl(5), // so we don't update cells that have already changed this turn
    EVENT_PROTECTED = Fl(6),

    IS_IN_LOOP = Fl(10), // this cell is part of a terrain loop
    IS_CHOKEPOINT = Fl(11), // if this cell is blocked, part of the map will be rendered inaccessible
    IS_GATE_SITE = Fl(12), // consider placing a locked door here
    IS_IN_ROOM_MACHINE = Fl(13),
    IS_IN_AREA_MACHINE = Fl(14),
    IS_POWERED = Fl(15), // has been activated by machine power this turn (can probably be eliminate if needed)

    IMPREGNABLE = Fl(20), // no tunneling allowed!
    DARKENED = Fl(19), // magical blindness?

    IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it

    PERMANENT_MECH_FLAGS = SEARCHED_FROM_HERE |
        PRESSURE_PLATE_DEPRESSED |
        KNOWN_TO_BE_TRAP_FREE |
        IS_IN_LOOP |
        IS_CHOKEPOINT |
        IS_GATE_SITE |
        IS_IN_MACHINE |
        IMPREGNABLE,
}

///////////////////////////////////////////////////////
// MAP

export enum Map {
    MAP_CHANGED = Fl(0),

    MAP_STABLE_GLOW_LIGHTS = Fl(1),
    MAP_STABLE_LIGHTS = Fl(2),

    MAP_ALWAYS_LIT = Fl(3),
    MAP_SAW_WELCOME = Fl(4),

    MAP_NO_LIQUID = Fl(5),
    MAP_NO_GAS = Fl(6),

    MAP_CALC_FOV = Fl(7),
    MAP_FOV_CHANGED = Fl(8),

    MAP_DANCES = Fl(9),

    MAP_DEFAULT = MAP_STABLE_LIGHTS | MAP_STABLE_GLOW_LIGHTS,
}
