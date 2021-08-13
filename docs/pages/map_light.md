## Map Lighting

By default maps have their ambient light set to white light. That makes the default map look fully vibrant and true to the drawing colors in the individual tiles. However, we can change the ambient light on the map to give it different feels.

```js
const charToTile = {
    '.': 'FLOOR',
    '#': 'WALL',
    '+': 'DOOR',
    '~': 'LAKE',
    '=': 'BRIDGE',
};

const prefab = [
    '##########',
    '#...#....#',
    '#...+....#',
    '#...#....#',
    '##+####+##',
    '#...~~~..#',
    '#...~~...#',
    '#..~~~...#',
    '#...~~~..#',
    '##########',
];

const map = GW.map.from(prefab, charToTile);
map.light.setAmbient([150, 100, 100]);
map.light.update();

const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
SHOW(canvas.node);

map.drawInto(canvas);
canvas.render();
```

In addition to ambient light, you can add static lights to the map. Static lights have the following information:

-   color
-   radius - How many cells to illuminate
-   fadeTo - What percent of the light should be present at the edge of the radius

```js
const charToTile = {
    '.': 'FLOOR',
    '#': 'WALL',
    '+': 'DOOR',
    '~': 'LAKE',
};

const prefab = [
    '##########',
    '#...#....#',
    '#...+....#',
    '#...#....#',
    '##+####+##',
    '#...~~~..#',
    '#...~~...#',
    '#..~~~...#',
    '#...~~~..#',
    '##########',
];

const map = GW.map.from(prefab, charToTile);
map.light.addStatic(5, 3, { color: 'yellow', radius: 5, fadeTo: 25 });
map.light.update();

const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
SHOW(canvas.node);

map.drawInto(canvas);
canvas.render();
```

Tiles can also have lights associated with them. The lights are automatically managed as the tile is added/removed.

Click on a square to toggle between a wall, torch wall, and floor.

```js
GW.tile.install('TORCH_WALL', 'WALL', {
    ch: '!',
    light: { color: 'yellow', radius: 5, fadeTo: 50 },
});

const map = GW.map.make(20, 20, {
    tile: 'FLOOR',
    boundary: 'WALL',
    ambient: [25, 25, 25],
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
SHOW(canvas.node);

map.drawInto(canvas);
canvas.render();

canvas.onclick = (e) => {
    if (map.isBoundaryXY(e.x, e.y)) return;
    let tile = 'FLOOR';
    if (map.hasTile(e.x, e.y, 'FLOOR')) {
        tile = 'TORCH_WALL';
    } else if (map.hasTile(e.x, e.y, 'TORCH_WALL')) {
        tile = 'WALL';
    }
    map.setTile(e.x, e.y, tile);
    map.light.update();
    map.drawInto(canvas);
    canvas.render();
};
```
