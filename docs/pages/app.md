# GW

```js
const gw = GWU.app.make({
    font: 'monospace',
    width: 30,
    height: 20,
    loop: LOOP,
});
SHOW(gw.node);
// SHOW(gw.canvas.glyphs.node);

const buffer = gw.buffer;

gw.repeat(500, () => {
    GWU.xy.forRect(buffer.width, buffer.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        buffer.draw(x, y, ch, fg, bg);
    });
});

gw.on('click', (ev) => {
    console.log('click', ev.x, ev.y);
});

gw.on('keypress', (ev) => {
    console.log('keypress', ev.key);
});
```

## Second example

```js
const gw = GWU.app.make({
    width: 30,
    height: 20,
    loop: LOOP,
    scene: {
        click(ev) {
            console.log('click', ev.x, ev.y);
        },
        keypress(ev) {
            console.log('key', ev.key);
        },
    },
});
SHOW(gw.node);

const buffer = gw.buffer;

function draw() {
    GWU.xy.forRect(buffer.width, buffer.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        buffer.draw(x, y, ch, fg, bg);
    });
}

gw.repeat(1000, draw);
```
