# HTML Borders

Elements can have a solid border around them.

```js
const app = GWU.app.make({ width: 60, height: 20, loop: LOOP });
SHOW(app);

const scene = app.scene;
const build = scene.build;

// gives us inner dimensions of 9 x 3
build.pos(5, 5).border({ width: 11, height: 5, fg: 'green' });

build.text('Testing 1');
build.text('Testing 2');
build.text('Testing 3');
```
