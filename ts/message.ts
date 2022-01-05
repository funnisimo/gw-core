import * as Text from './text/index';
import * as GW from './gw';
import { TRUE } from './utils';

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

export function get(msgOrId: string): Text.Template | null {
    return templates[msgOrId] || null;
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
    handlers.forEach((h) => h.addMessage.call(h, x, y, msg));
}

export function addCombat(x: number, y: number, msg: string, args?: any) {
    const template = templates[msg];
    if (template) {
        msg = template(args);
    } else if (args) {
        msg = Text.apply(msg, args);
    }
    handlers.forEach((h) => h.addCombatMessage.call(h, x, y, msg));
}

export interface CacheOptions {
    length: number;
    width: number;
    match?: (x: number, y: number) => false | any;
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
    matchFn: (x: number, y: number) => false | any;

    constructor(opts: Partial<CacheOptions> = {}) {
        this.matchFn = opts.match || TRUE;
        this.ARCHIVE_LINES = opts.length || 30;
        this.MSG_WIDTH = opts.width || 80;
        this.clear();
        handlers.push(this);
    }

    clear() {
        for (let i = 0; i < this.ARCHIVE_LINES; ++i) {
            this.ARCHIVE[i] = null;
            this.CONFIRMED[i] = false;
        }
        this.NEXT_WRITE_INDEX = 0;
        this.NEEDS_UPDATE = true;
        this.COMBAT_MESSAGE = null;
    }

    get needsUpdate(): boolean {
        return this.NEEDS_UPDATE;
    }
    set needsUpdate(needs: boolean) {
        this.NEEDS_UPDATE = needs;
    }

    // function messageWithoutCaps(msg, requireAcknowledgment) {
    protected _addMessageLine(msg: string) {
        if (!Text.length(msg)) {
            return;
        }

        // Add the message to the archive.
        this.ARCHIVE[this.NEXT_WRITE_INDEX] = msg;
        this.CONFIRMED[this.NEXT_WRITE_INDEX] = false;
        this.NEXT_WRITE_INDEX =
            (this.NEXT_WRITE_INDEX + 1) % this.ARCHIVE_LINES;
    }

    addMessage(x: number, y: number, msg: string) {
        if (this.matchFn(x, y) === false) return;
        this.commitCombatMessage();
        this._addMessage(msg);
    }

    protected _addMessage(msg: string) {
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
        lines.forEach((l) => this._addMessageLine(l));

        // display the message:
        this.NEEDS_UPDATE = true;

        // if (GAME.playbackMode) {
        // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
        // }
    }

    addCombatMessage(x: number, y: number, msg: string) {
        if (!this.matchFn(x, y)) return;
        this._addCombatMessage(msg);
    }

    protected _addCombatMessage(msg: string) {
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

    get length(): number {
        let count = 0;
        this.forEach(() => ++count);
        return count;
    }
}
