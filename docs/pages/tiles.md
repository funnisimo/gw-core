## Basic Tiles

Creating a dungeon with just the basic tiles that come with gw-map is fine, but it is a lot more interesting if we add some interesting things into the world to make it more fun. Lets create some of those as a way to learn about the many options that exist for tiles in gw-map.

Lets say that we are walking through a set of ruins for this dungeon. So we are outside and their should be walls of buildings along with lots of foliage that is overgrowing the abandoned buildings.

First, lets add some grass alongside a pond of water. Grass is like a decorator that sits on top of the floor. It doesn't do anything yet, except for look pretty. We set the 'layer' of a tile that sits on top of the floor to 'SURFACE'. These are the layers that tiles can use:

-   GROUND
-   LIQUID
-   SURFACE
-   GAS

We will talk more about liquid and gas in the future.

The basic visual components of a tile are the sprite elements:

-   ch - the text character to draw
-   fg - the color of the text
-   bg - the background of the tile

All of these fields are optional. Tiles can be placed that have no visual elements to them at all. This could be useful for things like secrets that can be detected (traps?). But most of the time you will have some visual aspect to the tile.

```js
GW.tile.install('GRASS', {
    depth: 'SURFACE',
    ch: '"',
    fg: 'green',
});

const charToTile = {
    '"': 'GRASS',
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
    '#.."~~~".#',
    '#...==...#',
    '#."~~~"..#',
    '#.."~~~".#',
    '##########',
];

const map = GW.map.from(prefab, charToTile);
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
map.drawInto(canvas);
canvas.render();
SHOW(canvas.node);
```

Next, lets add a tree that is growing in one of the rooms. Maybe it has a little bit of grass around it as well. For trees, we have to decide whether or not we want the trees to block players' movement. We also need to decide whether or not the tree will block line of sight (vision). Let say that it blocks both.

We block vision and line of sight in tiles by setting flags on the tile. Here is a list of some of the flags that we have for tiles:

-   L_BLOCKS_MOVE - blocks actors (player + npc + monster) movement
-   L_BLOCKS_VISION - blocks FOV/line of sight
-   L_BLOCKS_SURFACE - This is used on a floor tile to indicate that it should not allow things like grass to grow on the tile. Doors are a good example of a tile that does not wany any decoration put on top of it.
-   L_BLOCKS_LIQUID - This tile does not allow liquids. Walls block liquids.
-   L_BLOCKS_GAS - This tile blocks gas from coming into it. Walls block gasses as well.
-   L_BLOCKS_ITEMS - You cannot place an item on this tile. In an active game, you should use 'placeItemNear(x, y, item)' to place items and that function will automatically move the placed item into a close cell that does not have this flag.
-   L_BLOCKS_ACTORS - This is like L_BLOCKS_MOVE, but also serves as information for the map building process about whether or not actors (maybe NPCs) can be placed on this tile at design time.
-   L_BLOCKS_EFFECTS - This tile is ignored when using effects to place tiles (more on this later).
-   L_BLOCKS_DIAGONAL - This indicates that you cannot cut the corner past this tile. It affects pathfinding and movement of actors.

If you mouse over the map you will see how the tree affects visibility.

```js
GW.tile.install('GRASS', {
    depth: 'SURFACE',
    ch: '"',
    fg: 'green',
});

GW.tile.install('TREE', {
    depth: 'SURFACE',
    ch: 'T',
    fg: 'green',
    flags: 'L_BLOCKS_MOVE, L_BLOCKS_VISION',
});

const charToTile = {
    '"': 'GRASS',
    T: 'TREE',
    '.': 'FLOOR',
    '#': 'WALL',
    '+': 'DOOR',
    '~': 'LAKE',
    '=': 'BRIDGE',
};

const prefab = [
    '##########',
    '#....."..#',
    '##.."T"..#',
    '#...TT"..#',
    '#.TT~~..##',
    '#.."~~~".#',
    '#...==...#',
    '#."~~~"..#',
    '#.."~~~".#',
    '##########',
];

const map = GW.map.from(prefab, charToTile, {
    fov: true,
    revealed: true,
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
map.drawInto(canvas);
canvas.render();
SHOW(canvas.node);

canvas.onmousemove = (e) => {
    map.fov.update(e.x, e.y, 10);
    map.drawInto(canvas);
    canvas.render();
};
```
