import { fl as Fl } from '../flag';

export enum FovFlags {
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

    ALWAYS_VISIBLE = Fl(14),

    ANY_KIND_OF_VISIBLE = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE,

    IS_WAS_ANY_KIND_OF_VISIBLE = VISIBLE |
        WAS_VISIBLE |
        CLAIRVOYANT_VISIBLE |
        WAS_CLAIRVOYANT_VISIBLE |
        TELEPATHIC_VISIBLE |
        WAS_TELEPATHIC_VISIBLE,

    WAS_ANY_KIND_OF_VISIBLE = WAS_VISIBLE |
        WAS_CLAIRVOYANT_VISIBLE |
        WAS_TELEPATHIC_VISIBLE,

    PLAYER = IN_FOV,
    CLAIRVOYANT = CLAIRVOYANT_VISIBLE,
    TELEPATHIC = TELEPATHIC_VISIBLE,

    VIEWPORT_TYPES = PLAYER |
        CLAIRVOYANT |
        TELEPATHIC |
        ITEM_DETECTED |
        MONSTER_DETECTED,
}
