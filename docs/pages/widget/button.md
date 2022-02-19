# HTML Button

Buttons are there for you to click!

```js
const app = GWU.app.make({ width: 60, height: 20, loop: LOOP });
SHOW(app);

const scene = app.scene;
const build = scene.build;

scene.styles.add('button:hover', { fg: 'teal', bg: 'gray' });
scene.styles.add('button:focus', { fg: 'dark_teal', bg: 'light_gray' });
scene.styles.add('#B:focus', { fg: 'yellow', bg: 'dark_gray' });

const t = build
    .pos(10, 3)
    .style({ fg: 'red', bg: 'black' })
    .text('events', { width: 20 });

build.reset();

const b = build.pos(10, 5).button({ text: 'This is a button.' });
b.on('action', () => {
    t.text('clicked!');
});

const b2 = build.pos(10, 7).button({ text: 'Another button', id: 'B' });
b2.on('action', () => {
    t.text('clicked 2!');
});
```
