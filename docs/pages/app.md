# App

An app is a way to handle events, drawing, and updates to the game all in one package.

Apps also allow you to run different scenes. (More on that later).

## Simple

This example creates a bare bones App that draws on a timer and handles keyboard input as well as mouse clicks.

```js
const gw = GWU.app.make({
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

This example introduces that concept of a scene that is configured at App creation time.

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

const scene = gw.scene;
const buffer = scene.buffer;

function draw() {
    GWU.xy.forRect(buffer.width, buffer.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        buffer.draw(x, y, ch, fg, bg);
    });
}

scene.repeat(1000, draw);
```
