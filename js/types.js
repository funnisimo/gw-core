import * as Utils from "./utils";
export class Bounds {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    contains(...args) {
        let x = args[0];
        let y = args[1];
        if (typeof x !== "number") {
            y = Utils.y(x);
            x = Utils.x(x);
        }
        return (this.x <= x &&
            this.y <= y &&
            this.x + this.width > x &&
            this.y + this.height > y);
    }
}
//# sourceMappingURL=types.js.map