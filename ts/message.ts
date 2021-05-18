import * as Text from './text/index';
import * as Types from './types';

export const templates: Record<string, Text.Template> = {};

export function install(id: string, msg: string) {
    const template = Text.compile(msg);
    templates[id] = template;
}

export function installAll(config: Record<string, string>) {
    Object.entries(config).forEach(([id, msg]) => install(id, msg));
}

// messages
const ARCHIVE: (string | null)[] = [];
const CONFIRMED: boolean[] = [];
var ARCHIVE_LINES = 30;
var MSG_WIDTH = 80;
var NEXT_WRITE_INDEX = 0;
var NEEDS_UPDATE = false;
let COMBAT_MESSAGE: string | null = null;

export function needsUpdate(needs?: boolean) {
    if (needs) {
        NEEDS_UPDATE = true;
    }
    return NEEDS_UPDATE;
}

export interface MessageOptions {
    length: number;
    width: number;
}

export function configure(opts: Partial<MessageOptions>) {
    if (!opts) opts = {};
    ARCHIVE_LINES = opts.length || 30;
    MSG_WIDTH = opts.width || 80;
    for (let i = 0; i < ARCHIVE_LINES; ++i) {
        ARCHIVE[i] = null;
        CONFIRMED[i] = false;
    }
}

////////////////////////////////////
// Messages

export function add(msg: string, args?: any) {
    const template = templates[msg];
    if (template) {
        msg = template(args);
    } else if (args) {
        msg = Text.apply(msg, args);
    }
    commitCombatMessage();
    addMessage(msg);
}

export function fromActor(actor: Types.ActorType, msg: string, args?: any) {
    if (actor.isPlayer() || actor.isVisible()) {
        add(msg, args);
    }
}

export function forPlayer(actor: Types.ActorType, msg: string, args?: any) {
    if (!actor.isPlayer()) return;
    add(msg, args);
}

export function addCombat(actor: Types.ActorType, msg: string, args?: any) {
    if (actor.isPlayer() || actor.isVisible()) {
        const template = templates[msg];
        if (template) {
            msg = template(args);
        } else if (args) {
            msg = Text.apply(msg, args);
        }
        addCombatMessage(msg);
    }
}

// function messageWithoutCaps(msg, requireAcknowledgment) {
function addMessageLine(msg: string) {
    if (!Text.length(msg)) {
        return;
    }

    // Add the message to the archive.
    ARCHIVE[NEXT_WRITE_INDEX] = msg;
    CONFIRMED[NEXT_WRITE_INDEX] = false;
    NEXT_WRITE_INDEX = (NEXT_WRITE_INDEX + 1) % ARCHIVE_LINES;
}

function addMessage(msg: string) {
    msg = Text.capitalize(msg);

    // // Implement the American quotation mark/period/comma ordering rule.
    // for (i=0; text.text[i] && text.text[i+1]; i++) {
    //     if (text.charCodeAt(i) === COLOR_ESCAPE) {
    //         i += 4;
    //     } else if (text.text[i] === '"'
    //                && (text.text[i+1] === '.' || text.text[i+1] === ','))
    // 		{
    // 			const replace = text.text[i+1] + '"';
    // 			text.spliceRaw(i, 2, replace);
    //     }
    // }

    const lines = Text.splitIntoLines(msg, MSG_WIDTH);
    lines.forEach((l) => addMessageLine(l));

    // display the message:
    NEEDS_UPDATE = true;

    // if (GAME.playbackMode) {
    // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
    // }
}

function addCombatMessage(msg: string) {
    if (!COMBAT_MESSAGE) {
        COMBAT_MESSAGE = msg;
    } else {
        COMBAT_MESSAGE += ', ' + Text.capitalize(msg);
    }
    NEEDS_UPDATE = true;
}

function commitCombatMessage() {
    if (!COMBAT_MESSAGE) return false;
    addMessage(COMBAT_MESSAGE + '.');
    COMBAT_MESSAGE = null;
    return true;
}

export function confirmAll() {
    for (let i = 0; i < CONFIRMED.length; i++) {
        CONFIRMED[i] = true;
    }
    NEEDS_UPDATE = true;
}

export type EachMsgFn = (msg: string, confirmed: boolean, i: number) => any;

export function forEach(fn: EachMsgFn) {
    commitCombatMessage();

    for (let i = 0; i < ARCHIVE_LINES; ++i) {
        const n = (ARCHIVE_LINES - i + NEXT_WRITE_INDEX - 1) % ARCHIVE_LINES;
        const msg = ARCHIVE[n];
        if (!msg) return;
        if (fn(msg, CONFIRMED[n], i) === false) return;
    }
}
