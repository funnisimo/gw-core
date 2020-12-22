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
        if (Array.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        return (this.x <= x &&
            this.y <= y &&
            this.x + this.width > x &&
            this.y + this.height > y);
    }
}
//# sourceMappingURL=types.js.map