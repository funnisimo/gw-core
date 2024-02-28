import * as Text from './text/index';

////////////////////////////////////
// Messages

export interface CacheOptions {
    length: number;
    width: number;
    reverseMultiLine: boolean;
}

export type EachMsgFn = (msg: string, confirmed: boolean, i: number) => any;

export class Cache {
    _archive: (string | null)[] = [];
    _confirmed: boolean[] = [];
    archiveLen = 30;
    msgWidth = 80;
    _nextWriteIndex = 0;
    // _needsUpdate = true;
    _combatMsg: string | null = null;
    _reverse: boolean;

    constructor(opts: Partial<CacheOptions> = {}) {
        this.archiveLen = opts.length || 30;
        this.msgWidth = opts.width || 80;
        this._reverse = opts.reverseMultiLine || false;
        this.clear();
    }

    clear() {
        for (let i = 0; i < this.archiveLen; ++i) {
            this._archive[i] = null;
            this._confirmed[i] = false;
        }
        this._nextWriteIndex = 0;
        // this._needsUpdate = true;
        this._combatMsg = null;
    }

    // get needsUpdate(): boolean {
    //     return this._needsUpdate;
    // }
    // set needsUpdate(needs: boolean) {
    //     this._needsUpdate = needs;
    // }

    // function messageWithoutCaps(msg, requireAcknowledgment) {
    _addMessageLine(msg: string) {
        if (!Text.length(msg)) {
            return;
        }

        // Add the message to the archive.
        this._archive[this._nextWriteIndex] = msg;
        this._confirmed[this._nextWriteIndex] = false;
        this._nextWriteIndex = (this._nextWriteIndex + 1) % this.archiveLen;
    }

    add(msg: string) {
        this.commitCombatMessage();
        this._addMessage(msg);
    }

    _addMessage(msg: string) {
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

        const lines = Text.splitIntoLines(msg, this.msgWidth);
        if (this._reverse) {
            lines.reverse();
        }
        lines.forEach((l) => this._addMessageLine(l));

        // display the message:

        // if (GAME.playbackMode) {
        // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
        // }
    }

    addCombat(msg: string) {
        this._addCombatMessage(msg);
    }

    protected _addCombatMessage(msg: string) {
        if (!this._combatMsg) {
            this._combatMsg = msg;
        } else {
            this._combatMsg += ', ' + Text.capitalize(msg);
        }
    }

    commitCombatMessage() {
        if (!this._combatMsg) return false;
        this._addMessage(this._combatMsg + '.');
        this._combatMsg = null;
        return true;
    }

    confirmAll() {
        for (let i = 0; i < this._confirmed.length; i++) {
            this._confirmed[i] = true;
        }
    }

    forEach(fn: EachMsgFn) {
        this.commitCombatMessage();

        for (let i = 0; i < this.archiveLen; ++i) {
            const n =
                (this.archiveLen - i + this._nextWriteIndex - 1) %
                this.archiveLen;
            const msg = this._archive[n];
            if (!msg) return;
            if (fn(msg, this._confirmed[n], i) === false) return;
        }
    }

    get length(): number {
        let count = 0;
        this.forEach(() => ++count);
        return count;
    }
}

export type MessageArgs = Record<string, any>;
export type MessageFn = (args: MessageArgs) => string;

export class MessageManager {
    // _replace: Record<string, MessageFn> = {};
    _messages: Record<string, MessageFn> = {};

    // addReplace(text: string, replace: (args: MessageArgs) => string) {
    //     this._replace[text] = replace;
    // }

    // addReplaces(info: Record<string, MessageFn>) {
    //     Object.entries(info).forEach(([k, v]) => this.addReplace(k, v));
    // }

    add(id: string, fn: MessageFn) {
        this._messages[id] = fn;
    }

    addMany(msgs: Record<string, MessageFn>) {
        Object.entries(msgs).forEach(([k, v]) => this.add(k, v));
    }

    format(id: string, args: MessageArgs): string {
        const msg = this._messages[id] || (() => 'UNKNOWN MESSAGE: ' + id);
        return msg(args);
    }
}

export const manager = new MessageManager();
