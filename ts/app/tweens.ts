import * as UTILS from '../utils';
import { Tween } from '../tween';

export class Tweens {
    _tweens: Tween[] = [];

    constructor() {}

    get length() {
        return this._tweens.length;
    }

    clear() {
        this._tweens = [];
    }

    add(tween: Tween) {
        this._tweens.push(tween);
    }

    remove(tween: Tween) {
        UTILS.arrayDelete(this._tweens, tween);
    }

    update(dt: number) {
        // // fire animations
        this._tweens.forEach((tw) => tw.update(dt));
        this._tweens = this._tweens.filter((tw) => tw.isRunning());
    }
}
