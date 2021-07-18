import { fl as Fl } from '../flag';

export enum GameObject {
    // L_DYNAMIC = Fl(0), // for movable things like actors or items
    L_SUPERPRIORITY = Fl(1), // will overwrite layers at same depth with higher priority
    L_SECRETLY_PASSABLE = Fl(2), // will become passable if discovered/activated/etc...

    L_BLOCKS_MOVE = Fl(3), // cannot be walked through
    L_BLOCKS_VISION = Fl(4), // blocks line of sight
    L_BLOCKS_SURFACE = Fl(6), // grass, blood, etc. cannot exist on this tile
    L_BLOCKS_LIQUID = Fl(8),
    L_BLOCKS_GAS = Fl(7), // blocks the permeation of gas
    L_BLOCKS_ITEMS = Fl(5), // items can't be on this tile
    L_BLOCKS_ACTORS = Fl(11), // actors can't be on this tile
    L_BLOCKS_EFFECTS = Fl(9),
    L_BLOCKS_DIAGONAL = Fl(10), // can't step diagonally around this tile

    L_INTERRUPT_WHEN_SEEN = Fl(11),
    L_LIST_IN_SIDEBAR = Fl(12), // terrain will be listed in the sidebar with a description of the terrain type
    L_VISUALLY_DISTINCT = Fl(13), // terrain will be color-adjusted if necessary so the character stands out from the background
    L_BRIGHT_MEMORY = Fl(14), // no blue fade when this tile is out of sight
    L_INVERT_WHEN_HIGHLIGHTED = Fl(15), // will flip fore and back colors when highlighted with pathing

    L_BLOCKED_BY_STAIRS = L_BLOCKS_ITEMS |
        L_BLOCKS_SURFACE |
        L_BLOCKS_GAS |
        L_BLOCKS_LIQUID |
        L_BLOCKS_EFFECTS |
        L_BLOCKS_ACTORS,

    L_BLOCKS_SCENT = L_BLOCKS_MOVE | L_BLOCKS_VISION,
    L_DIVIDES_LEVEL = L_BLOCKS_MOVE,
    L_WAYPOINT_BLOCKER = L_BLOCKS_MOVE,

    L_IS_WALL = L_BLOCKS_MOVE |
        L_BLOCKS_VISION |
        L_BLOCKS_LIQUID |
        L_BLOCKS_GAS |
        L_BLOCKS_EFFECTS |
        L_BLOCKS_DIAGONAL,

    L_BLOCKS_EVERYTHING = L_IS_WALL |
        L_BLOCKS_ITEMS |
        L_BLOCKS_ACTORS |
        L_BLOCKS_SURFACE,
}

export enum Layer {
    ALL_LAYERS = -1,
    GROUND = 0,
    LIQUID,
    SURFACE,
    GAS,
    ITEM,
    ACTOR,
    PLAYER,
    FX,
    UI,
}

export type LayerString = keyof typeof Layer;
