# Tween examples

## Glowing background

```js
const game = GWU.app.make({
    width: 30,
    height: 20,
    bg: '#2d2d2d',
    scene: {
        start,
        destroy,
        draw,
    },
    loop: LOOP,
});
SHOW(game);

function start() {
    this.data = GWU.grid.alloc(this.width, this.height);

    this.data.forEach((v, x, y) => {
        const delay = (x + y) * 20;
        const tween = GWU.tween
            .make({ x, y, a: 0 })
            .duration(1000)
            .to({ a: 100 })
            .yoyo(true)
            .delay(delay)
            .repeatDelay(0)
            .repeat(-1)
            .onUpdate((d) => {
                this.data[d.x][d.y] = d.a;
                this.needsDraw = true;
            });
        tween.start();
        this.tweens.add(tween);
    });
}

function destroy() {
    GWU.grid.free(this.data);
    this.data = null;
}

function draw(buffer) {
    if (!this.data) return;
    buffer.fill(this.bg);
    this.data.forEach((a, x, y) => {
        const color = GWU.color.WHITE.alpha(a);
        buffer.draw(x, y, ' ', -1, color);
    });
}
```
