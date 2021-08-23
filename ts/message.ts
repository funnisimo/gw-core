import * as Text from './text/index';
import * as GW from './gw';

export const templates: Record<string, Text.Template> = {};

GW.config.message = GW.config.message || {};

export function install(id: string, msg: string) {
    const template = Text.compile(msg);
    templates[id] = template;
    return template;
}

export function installAll(config: Record<string, string>) {
    Object.entries(config).forEach(([id, msg]) => install(id, msg));
}

////////////////////////////////////
// Messages

export interface MessageHandler {
    addMessage(x: number, y: number, msg: string): void;
    addCombatMessage(x: number, y: number, msg: string): void;
}

export const handlers: MessageHandler[] = [];

export function add(msg: string, args?: any) {
    return addAt(-1, -1, msg, args);
}

export function addAt(x: number, y: number, msg: string, args?: any) {
    const template = templates[msg];
    if (template) {
        msg = template(args);
    } else if (args) {
        msg = Text.apply(msg, args);
    }
    handlers.forEach((h) => h.addMessage(x, y, msg));
}

export function addCombat(x: number, y: number, msg: string, args?: any) {
    const template = templates[msg];
    if (template) {
        msg = template(args);
    } else if (args) {
        msg = Text.apply(msg, args);
    }
    handlers.forEach((h) => h.addCombatMessage(x, y, msg));
}

export interface CacheOptions {
    length: number;
    width: number;
}

export type EachMsgFn = (msg: string, confirmed: boolean, i: number) => any;

export class MessageCache implements MessageHandler {
    ARCHIVE: (string | null)[] = [];
    CONFIRMED: boolean[] = [];
    ARCHIVE_LINES = 30;
    MSG_WIDTH = 80;
    NEXT_WRITE_INDEX = 0;
    NEEDS_UPDATE = true;
    COMBAT_MESSAGE: string | null = null;

    constructor(opts: Partial<CacheOptions> = {}) {
        this.ARCHIVE_LINES = opts.length || 30;
        this.MSG_WIDTH = opts.width || 80;
        for (let i = 0; i < this.ARCHIVE_LINES; ++i) {
            this.ARCHIVE[i] = null;
            this.CONFIRMED[i] = false;
        }
        handlers.push(this);
    }

    get needsUpdate(): boolean {
        return this.NEEDS_UPDATE;
    }
    set needsUpdate(needs: boolean) {
        if (needs) {
            this.NEEDS_UPDATE = true;
        }
    }

    // function messageWithoutCaps(msg, requireAcknowledgment) {
    addMessageLine(msg: string) {
        if (!Text.length(msg)) {
            return;
        }

        // Add the message to the archive.
        this.ARCHIVE[this.NEXT_WRITE_INDEX] = msg;
        this.CONFIRMED[this.NEXT_WRITE_INDEX] = false;
        this.NEXT_WRITE_INDEX =
            (this.NEXT_WRITE_INDEX + 1) % this.ARCHIVE_LINES;
    }

    addMessage(_x: number, _y: number, msg: string) {
        this._addMessage(msg);
    }

    _addMessage(msg: string) {
        this.commitCombatMessage();

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

        const lines = Text.splitIntoLines(msg, this.MSG_WIDTH);
        if (GW.config.message?.reverseMultiLine) {
            lines.reverse();
        }
        lines.forEach((l) => this.addMessageLine(l));

        // display the message:
        this.NEEDS_UPDATE = true;

        // if (GAME.playbackMode) {
        // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
        // }
    }

    addCombatMessage(_x: number, _y: number, msg: string) {
        this._addCombatMessage(msg);
    }

    _addCombatMessage(msg: string) {
        if (!this.COMBAT_MESSAGE) {
            this.COMBAT_MESSAGE = msg;
        } else {
            this.COMBAT_MESSAGE += ', ' + Text.capitalize(msg);
        }
        this.NEEDS_UPDATE = true;
    }

    commitCombatMessage() {
        if (!this.COMBAT_MESSAGE) return false;
        this._addMessage(this.COMBAT_MESSAGE + '.');
        this.COMBAT_MESSAGE = null;
        return true;
    }

    confirmAll() {
        for (let i = 0; i < this.CONFIRMED.length; i++) {
            this.CONFIRMED[i] = true;
        }
        this.NEEDS_UPDATE = true;
    }

    forEach(fn: EachMsgFn) {
        this.commitCombatMessage();

        for (let i = 0; i < this.ARCHIVE_LINES; ++i) {
            const n =
                (this.ARCHIVE_LINES - i + this.NEXT_WRITE_INDEX - 1) %
                this.ARCHIVE_LINES;
            const msg = this.ARCHIVE[n];
            if (!msg) return;
            if (fn(msg, this.CONFIRMED[n], i) === false) return;
        }
    }
}
