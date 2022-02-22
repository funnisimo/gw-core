# Scenes

Scenes are different sections of code that show a display on the canvas. By default, every App has a `default` scene running. This is the scene that is configured in the app creation step.

There can be many scenes running on the canvas at once. If so, the scenes are drawn from first to last and they handle events from last to first.

### Installing a scene

Scenes are identified and managed by using their `id`. To install a new scene, use the `install` method on the App's scenes property.

```js
const app = GWU.app.make({
    width: 30,
    height: 20,
    loop: LOOP,
});
SHOW(app);

const scene = app.scenes.install('main', {
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

app.scenes.start('main');
```
