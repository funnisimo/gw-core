import * as FLAG from '../flag.js';

export const FovFlags = FLAG.make([
    'VISIBLE', // cell has sufficient light and is in field of view, ready to draw.
    'WAS_VISIBLE',
    'CLAIRVOYANT_VISIBLE',
    'WAS_CLAIRVOYANT_VISIBLE',
    'TELEPATHIC_VISIBLE', // potions of telepathy let you see through other creatures' eyes
    'WAS_TELEPATHIC_VISIBLE', // potions of telepathy let you see through other creatures' eyes
    'ITEM_DETECTED',
    'WAS_ITEM_DETECTED',
    'ACTOR_DETECTED',
    'WAS_ACTOR_DETECTED',

    'IN_FOV', // player has unobstructed line of sight whether or not there is enough light
    'WAS_IN_FOV',

    'ALWAYS_VISIBLE',
    'IS_CURSOR',
    'IS_HIGHLIGHTED',

    'REVEALED',
    'MAGIC_MAPPED', // TODO - REMOVE !?!?

    'ANY_KIND_OF_VISIBLE = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE', // TODO - add ALWAYS_VISIBLE?
    'IS_WAS_ANY_KIND_OF_VISIBLE = VISIBLE | WAS_VISIBLE |CLAIRVOYANT_VISIBLE | WAS_CLAIRVOYANT_VISIBLE |TELEPATHIC_VISIBLE |WAS_TELEPATHIC_VISIBLE',

    'WAS_ANY_KIND_OF_VISIBLE = WAS_VISIBLE | WAS_CLAIRVOYANT_VISIBLE | WAS_TELEPATHIC_VISIBLE',

    'WAS_DETECTED = WAS_ITEM_DETECTED | WAS_ACTOR_DETECTED',
    'IS_DETECTED = ITEM_DETECTED | ACTOR_DETECTED',

    'PLAYER = IN_FOV',
    'CLAIRVOYANT = CLAIRVOYANT_VISIBLE',
    'TELEPATHIC = TELEPATHIC_VISIBLE',

    'VIEWPORT_TYPES = PLAYER | VISIBLE |CLAIRVOYANT |TELEPATHIC |ITEM_DETECTED |ACTOR_DETECTED',
]);
