## Map Visibility

By default every cell on a map is visible. That will remain true until you start to manage the visibility. Here is how it is done. Move the mouse around the map to change the FOV starting point.

```js
const map = GW.map.make(20, 20, {
    fov: true,
    tile: 'FLOOR',
    boundary: 'WALL',
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
map.drawInto(canvas);
canvas.render();
SHOW(canvas.node);

canvas.onclick = (e) => {
    if (map.isBoundaryXY(e.x, e.y)) return;
    const tile = map.hasTile(e.x, e.y, 'FLOOR') ? 'WALL' : 'FLOOR';
    map.setTile(e.x, e.y, tile, true);
    map.fov.update(e.x, e.y, 5);
    map.drawInto(canvas);
    canvas.render();
};

canvas.onmousemove = (e) => {
    map.fov.update(e.x, e.y, 5);
    map.drawInto(canvas);
    canvas.render();
};
```
