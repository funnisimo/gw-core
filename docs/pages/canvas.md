# Canvas

The Canvas is the place to draw text. You can draw into the canvas Buffer.

## Draw using canvas.buffer

Here we draw directly on the canvas buffer.

```js
const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 50,
    height: 30,
    loop: LOOP,
});
SHOW(canvas);
SHOW(canvas.glyphs);

function draw() {
    GWU.xy.forRect(canvas.width, canvas.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        canvas.draw(x, y, ch, fg, bg);
    });
}

draw();
setInterval(draw, 500);
```

## Draw using a buffer

Here we make a buffer and use it to draw.

```js
const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 50,
    height: 30,
    loop: LOOP,
});
SHOW(canvas);
SHOW(canvas.glyphs);

const buffer = new GWU.canvas.Buffer(canvas.layer());

function draw() {
    GWU.xy.forRect(buffer.width, buffer.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        buffer.draw(x, y, ch, fg, bg);
    });
    buffer.render();
}

draw();
setInterval(draw, 500);
```

## Draw using created buffer

Here we create a buffer and draw on it. Notice that you must now call `canvas.draw` instead of `buffer.render`. That is because the created buffer is not associated with the canvas.

**NOTE** - Keep in mind that the canvas.buffer no longer has the same data as what has been rendered.

```js
const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 50,
    height: 30,
    loop: LOOP,
});
SHOW(canvas.node);
SHOW(canvas.glyphs.node);

const buffer = GWU.buffer.make(canvas.width, canvas.height);

function draw() {
    GWU.xy.forRect(buffer.width, buffer.height, (x, y) => {
        const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
        const fg = GWU.rng.random.number(0x1000);
        const bg = GWU.rng.random.number(0x1000);
        buffer.draw(x, y, ch, fg, bg);
    });
    canvas.layer().copy(buffer);
}

draw();
setInterval(draw, 500);
```
