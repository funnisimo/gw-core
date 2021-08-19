## Fire

Fire effects on a map can be spectacular. The spreading of a small fire from one corner of the map, across all of the burnable terrain can quickly engulf an adventurer, causing all sorts of havoc. Maybe the fire burns open a cell door containing fierce adversaries. Maybe it ignites a cloud of nearby gas or a pool of liquid. Lots of interesting environmental things can occur.

Creating fire in a **gw-map** Map involves a number of tiles and some setup. But once you get the hang of it, fun things can happen.

First, there is our burnable tile. Burnable tiles have two important things in their setup: 1) They are marked as **T_IS_FLAMMABLE**, and 2) They have a **fire** effect that identifies their fire tile. The burnable tile is the tile that is in the world before the fire starts. Lets say that somehow that tile is exposed to a fire. That's when we activate the tile's **fire** effect. This effect will replace the burnable tile with a fire tile. The setup looks something like this:

```js
GW.tile.install('GRASS', {
    depth: 'SURFACE',
    ch: '"',
    fg: 'green',
    name: 'grass',
    flags: 'T_IS_FLAMMABLE',
    effects: {
        fire: { tile: 'GRASS_ON_FIRE', chance: 80 * 100 },
    },
});
SHOW(GW.tile.tiles.GRASS.sprite.toString());
```

Fire tiles are normal tiles, but are marked with a special flag that indicates that they are a fire tile: **T_IS_FIRE**. Every time we **tick** the map, each fire tile tries to expand the fire to its neighbors. Each neighbor is inspected and if it has a **T_IS_FLAMMABLE** tile, and if a random check of the ignition chance (chance on fire event) passes, then the tile ignites and the fire effect is run.

Also, the **tick** event on the fire tile is run, this is where fire decay happens. So your fire should burn itself out using the **tick** event and spread using the **fire** event.

Here is an example of our burining grass:

```js
GW.tile.install('GRASS_BURNT', {
    depth: 'SURFACE',
    ch: '"',
    fg: 'dark_brown',
    name: 'burnt grass',
});

GW.tile.install('GRASS_ON_FIRE', {
    depth: 'SURFACE',
    ch: '^',
    fg: 'red',
    name: 'burning grass',
    flags: 'T_IS_FIRE',
    priority: 100,
    effects: {
        tick: {
            tile: 'GRASS_BURNT',
            chance: 30 * 100,
            flags: 'E_SUPERPRIORITY',
        },
    },
});
SHOW(GW.tile.tiles.GRASS_ON_FIRE.hasEffect('tick'));
```

Lets combine these to see a simple fire situation. Move the mouse to place grass and click to start a fire.

```js
const map = GW.map.make(20, 20, {
    tile: 'FLOOR',
    boundary: 'WALL',
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
const buffer = canvas.buffer;
// map.drawInto(buffer);
// buffer.render();
SHOW(canvas.node);

LOOP.run(
    {
        mousemove: async (e) => {
            if (!map.isBoundaryXY(e.x, e.y)) {
                await map.setTile(e.x, e.y, 'GRASS');
            }
        },
        click: async (e) => {
            map.setTile(e.x, e.y, 'GRASS_ON_FIRE'); // always ignite
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(buffer);
            buffer.render();
        },
    },
    500
);
```
