### Third Example - Scene

```js
const gw = GWU.gw.gw({
    width: 30,
    height: 20,
    loop: LOOP,
});
SHOW(gw.node);

const scene = gw.scenes.install('main', {
    start() {
        this.repeat(500, draw);
    },
});

function draw() {
    const buffer = this.buffer;
    GWU.xy.forRect(buffer.width, buffer.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        buffer.draw(x, y, ch, fg, bg);
    });
}

gw.scenes.start('main');
```
