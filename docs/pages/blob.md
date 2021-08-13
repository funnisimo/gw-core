## Blob

The Blob class allows you to generate random blob shapes.

```js
const canvas = GW.canvas.make({
    font: 'monospace',
    width: 50,
    height: 30,
    loop: LOOP,
});
SHOW(canvas.node);
const buffer = canvas.buffer;

const blob = GW.blob.make({
    minWidth: 5,
    maxWidth: 30,
    minHeight: 5,
    maxHeight: 20,
});

function carve() {
    buffer.blackOut();
    blob.carve(50, 30, (x, y) => {
        buffer.draw(x, y, ' ', 0, 0xf00);
    });
    buffer.render();
}

canvas.onclick = carve;
carve();
```
