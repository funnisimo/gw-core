## Canvas

The Canvas is the place to draw text. You can draw into the canvas Buffer.

```js
const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 50,
    height: 30,
    loop: LOOP,
});
SHOW(canvas.node);
SHOW(canvas.glyphs.node);

const buffer = canvas.buffer;
GWU.xy.forRect(canvas.width, canvas.height, (x, y) => {
    const ch = String.fromCharCode(65 + GWU.rng.random.number(26));
    const fg = GWU.rng.random.number(0x1000);
    const bg = GWU.rng.random.number(0x1000);
    buffer.draw(x, y, ch, fg, bg);
});
buffer.render();
```
