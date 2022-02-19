## Using the Keyboard

By default, keyboard events are sent to the `keypress` event. You can add a handler for it to get the event. Keyboard events have the following properties:

-   key : string - the key that was pressed adjusted for the control keys (shift, etc...)
    -   For example: 'e' or 'E' or '^e' or 'Enter'
-   code : string - the browser code for the actual key pressed
    -   For example: 'KEY_A'
-   shift : boolean - whether or not the shift key is pressed
-   meta : boolean - whether or not the meta key is pressed
-   ctrl : boolean - whether or not the control key is pressed
-   alt : boolean - whether or not the alt key is pressed

In addition to handling events with the `keypress` event, you can also catch events for the specific key.

The following example lets you type into the canvas.

```js
const gw = GWU.app.make({
    font: 'monospace',
    width: 30,
    height: 20,
    loop: LOOP,
});
SHOW(gw.node);

const buffer = gw.buffer;
let x = 0;
let y = 0;

gw.on('Enter', (e) => {
    y = (y + 1) % buffer.height;
    x = 0;

    buffer.fillRect(x, y, buffer.width, 1, 0, 0, 0);
});

gw.on('Backspace', (e) => {
    if (x > 0) x -= 1;
    buffer.draw(x, y, ' ', 'white');
});

gw.on('keypress', (ev) => {
    if (GWU.app.isControlKey(ev)) return;
    buffer.draw(x, y, ev.key[0], 'white');
    x += 1;
    if (x >= buffer.width) {
        x = 0;
        y = (y + 1) % buffer.height;
    }
});
```
