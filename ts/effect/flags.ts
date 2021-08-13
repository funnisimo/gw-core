import { fl as Fl } from '../flag';

///////////////////////////////////////////////////////
// TILE EVENT

export enum Effect {
    // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
    E_NEXT_ALWAYS = Fl(0), // Always fire the next effect, even if no tiles changed.
    E_NEXT_EVERYWHERE = Fl(1), // next effect spawns in every cell that this effect spawns in, instead of only the origin

    // E_NO_REDRAW_CELL = Fl(2),
    E_TREAT_AS_BLOCKING = Fl(3), // If filling the footprint of this effect with walls would disrupt level connectivity, then abort.
    E_PERMIT_BLOCKING = Fl(4), // Generate this effect without regard to level connectivity.
    E_ABORT_IF_BLOCKS_MAP = Fl(5),
    E_BLOCKED_BY_ITEMS = Fl(6), // Do not fire this effect in a cell that has an item.
    E_BLOCKED_BY_ACTORS = Fl(7), // Do not fire this effect in a cell that has an item.
    E_BLOCKED_BY_OTHER_LAYERS = Fl(8), // Will not propagate into a cell if any layer in that cell has a superior priority.
    E_SUPERPRIORITY = Fl(9), // Will overwrite terrain of a superior priority.

    E_NO_MARK_FIRED = Fl(11), // Do not mark this cell as having fired an effect (so can log messages multiple times)
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    E_PROTECTED = Fl(12),

    E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
    E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction

    // E_NULL_SURFACE = Fl(15), // Clear the surface layer
    // E_NULL_LIQUID = Fl(16), // Clear liquid layer
    // E_NULL_GAS = Fl(17), // Clear gas layer

    E_EVACUATE_CREATURES = Fl(18), // Creatures in the effect area get moved outside of it
    E_EVACUATE_ITEMS = Fl(19), // Creatures in the effect area get moved outside of it

    E_BUILD_IN_WALLS = Fl(20),
    E_MUST_TOUCH_WALLS = Fl(21),
    E_NO_TOUCH_WALLS = Fl(22),

    E_FIRED = Fl(23), // has already been fired once

    E_CLEAR_GROUND = Fl(17), // clear all existing tiles
    E_CLEAR_SURFACE = Fl(24),
    E_CLEAR_LIQUID = Fl(25),
    E_CLEAR_GAS = Fl(26),

    E_CLEAR_CELL = E_CLEAR_GROUND |
        E_CLEAR_SURFACE |
        E_CLEAR_LIQUID |
        E_CLEAR_GAS,

    E_ONLY_IF_EMPTY = E_BLOCKED_BY_ITEMS | E_BLOCKED_BY_ACTORS,
    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,

    // These should be effect types
    E_ACTIVATE_DORMANT_MONSTER = Fl(27), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
    E_AGGRAVATES_MONSTERS = Fl(28), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
    E_RESURRECT_ALLY = Fl(29), // Will bring back to life your most recently deceased ally.
    E_EMIT_EVENT = Fl(30), // Will emit the effect when activated
}
