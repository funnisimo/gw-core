# UI

The UI is a set of classes that make building more complex user interfaces easier.

## Simplest

This is as bare bones as you can get. Just a blank canvas created in the default sizes and fonts. The glyphs that are available for drawing are also defaulted.

```js
const ui = new GWU.ui.UI();
SHOW(ui.canvas);
SHOW(ui.canvas.glyphs);
SHOW(ui.width, ui.height);

ui.buffer.drawText(30, 15, 'Hello World!', 'yellow');
ui.buffer.render();
```
