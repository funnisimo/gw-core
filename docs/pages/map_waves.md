## Waves

Waves on water are a fun way to showcase how effects can string together to create interactive maps.

Here we create a **WAVE** tile that when placed, will expand outward and replace itself with a **WAVE_DONE** tile. The **WAVE_DONE** tile will replace itself with a **LAKE** tile to reset the cycle.

Click on the map to start a wave. Notice how multiple waves will cancel each other out.

```js
GW.tile.install('WAVE_DONE', {
    ch: '~',
    fg: 'teal',
    bg: 'blue',
    priority: 70,
    flags: 'T_DEEP_WATER',
    name: 'water',
    article: 'some',
    effects: {
        tick: { tile: 'LAKE', flags: 'E_SUPERPRIORITY, E_PROTECTED' },
    },
});

GW.tile.install('WAVE', {
    ch: '^',
    fg: 'white',
    bg: 'blue',
    priority: 60,
    flags: 'T_DEEP_WATER',
    name: 'wave crest',
    article: 'the',
    effects: {
        tick: {
            tile: {
                id: 'WAVE',
                match: 'LAKE',
                spread: 100,
                decrement: 100,
            },
            flags: 'E_NEXT_ALWAYS',
            next: { tile: 'WAVE_DONE' },
        },
    },
});

const map = GW.map.make(20, 20, {
    tile: 'LAKE',
    boundary: 'WALL',
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
map.drawInto(canvas.buffer);
canvas.buffer.render();
SHOW(canvas.node);

LOOP.run(
    {
        click: async (e) => {
            await map.setTile(e.x, e.y, 'WAVE');
            map.drawInto(canvas.buffer);
            canvas.buffer.render();
        },
        tick: async (e) => {
            await map.tick();
            map.drawInto(canvas.buffer);
            canvas.buffer.render();
        },
    },
    500
);
```
