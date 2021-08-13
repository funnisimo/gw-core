import { fl as Fl } from '../flag';

///////////////////////////////////////////////////////
// TILE

export enum Tile {
    T_BRIDGE = Fl(0), // Acts as a bridge over the folowing types (auto descent, lava, deep water)
    T_AUTO_DESCENT = Fl(1), // automatically drops creatures down a depth level and does some damage (2d6)
    T_LAVA = Fl(2), // kills any non-levitating non-fire-immune creature instantly
    T_DEEP_WATER = Fl(3), // steals items 50% of the time and moves them around randomly

    T_IS_FLAMMABLE = Fl(4), // terrain can catch fire
    T_SPONTANEOUSLY_IGNITES = Fl(5), // monsters avoid unless chasing player or immune to fire
    T_IS_FIRE = Fl(6), // terrain is a type of fire; ignites neighboring flammable cells
    T_EXTINGUISHES_FIRE = Fl(7), // extinguishes burning terrain or creatures

    T_IS_SECRET = Fl(8), // successful search or being stepped on while visible transforms it into discoverType
    T_IS_TRAP = Fl(9), // spews gas of type specified in fireType when stepped on
    T_SACRED = Fl(10), // monsters that aren't allies of the player will avoid stepping here

    T_UP_STAIRS = Fl(11),
    T_DOWN_STAIRS = Fl(12),
    T_PORTAL = Fl(13),
    T_IS_DOOR = Fl(14),

    T_ALLOWS_SUBMERGING = Fl(15), // allows submersible monsters to submerge in this terrain
    T_ENTANGLES = Fl(16), // entangles players and monsters like a spiderweb

    T_REFLECTS = Fl(17), // magic bolts reflect off of its surface randomly (similar to ACTIVE_CELLS flag IMPREGNABLE)
    T_STAND_IN_TILE = Fl(18), // earthbound creatures will be said to stand "in" the tile, not on it
    T_CONNECTS_LEVEL = Fl(19), // will be treated as passable for purposes of calculating level connectedness, irrespective of other aspects of this terrain layer

    T_BLOCKS_OTHER_LAYERS = Fl(20),

    T_HAS_STAIRS = T_UP_STAIRS | T_DOWN_STAIRS | T_PORTAL,
    T_OBSTRUCTS_SCENT = T_AUTO_DESCENT |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES |
        T_HAS_STAIRS,
    T_PATHING_BLOCKER = T_AUTO_DESCENT |
        T_IS_TRAP |
        T_LAVA |
        T_DEEP_WATER |
        T_IS_FIRE |
        T_SPONTANEOUSLY_IGNITES |
        T_ENTANGLES,
    T_DIVIDES_LEVEL = T_AUTO_DESCENT | T_IS_TRAP | T_LAVA | T_DEEP_WATER,
    T_LAKE_PATHING_BLOCKER = T_AUTO_DESCENT |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES,
    T_WAYPOINT_BLOCKER = T_AUTO_DESCENT |
        T_IS_TRAP |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES,
    T_MOVES_ITEMS = T_DEEP_WATER | T_LAVA,
    T_CAN_BE_BRIDGED = T_AUTO_DESCENT | T_LAVA | T_DEEP_WATER,
    // T_HARMFUL_TERRAIN = T_CAUSES_POISON |
    //   T_IS_FIRE |
    //   T_CAUSES_DAMAGE |
    //   T_CAUSES_PARALYSIS |
    //   T_CAUSES_CONFUSION |
    //   T_CAUSES_EXPLOSIVE_DAMAGE,
    // T_RESPIRATION_IMMUNITIES = T_CAUSES_DAMAGE |
    //   T_CAUSES_CONFUSION |
    //   T_CAUSES_PARALYSIS |
    //   T_CAUSES_NAUSEA,
    T_IS_DEEP_LIQUID = T_LAVA | T_AUTO_DESCENT | T_DEEP_WATER,
}

///////////////////////////////////////////////////////
// TILE MECH

export enum TileMech {
    // TM_PROMOTES_WITH_KEY = Fl(1), // promotes if the key is present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_WITHOUT_KEY = Fl(2), // promotes if the key is NOT present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_ON_STEP = Fl(3), // promotes when a creature, player or item is on the tile (whether or not levitating)
    // TM_PROMOTES_ON_ITEM_REMOVE = Fl(4), // promotes when an item is lifted from the tile (primarily for altars)
    // TM_PROMOTES_ON_PLAYER_ENTRY = Fl(5), // promotes when the player enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_SACRIFICE_ENTRY = Fl(6), // promotes when the sacrifice target enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_ELECTRICITY = Fl(7), // promotes when hit by a lightning bolt

    // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
    // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
    // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
    // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
    // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
    // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
    // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns

    TM_IS_WIRED = Fl(9), // if wired, promotes when powered, and sends power when promoting
    TM_IS_CIRCUIT_BREAKER = Fl(10), // prevents power from circulating in its machine

    TM_VANISHES_UPON_PROMOTION = Fl(15), // vanishes when creating promotion dungeon feature, even if the replacement terrain priority doesn't require it

    TM_EXPLOSIVE_PROMOTE = Fl(21), // when burned, will promote to promoteType instead of burningType if surrounded by tiles with T_IS_FIRE or TM_EXPLOSIVE_PROMOTE
    TM_SWAP_ENCHANTS_ACTIVATION = Fl(25), // in machine, swap item enchantments when two suitable items are on this terrain, and activate the machine when that happens

    // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
    //   TM_PROMOTES_WITHOUT_KEY |
    //   TM_PROMOTES_ON_STEP |
    //   TM_PROMOTES_ON_ITEM_REMOVE |
    //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
    //   TM_PROMOTES_ON_ELECTRICITY |
    //   TM_PROMOTES_ON_PLAYER_ENTRY,
}
