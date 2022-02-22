## Blob

The Blob class allows you to generate random blob shapes.

```js
const canvas = GWU.canvas.make({
    width: 50,
    height: 30,
    loop: LOOP,
});
SHOW(canvas);
const buffer = GWU.buffer.make(canvas);

const blob = GWU.blob.make({
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
    canvas.render(buffer);
}

canvas.onclick = carve;
carve();
```
