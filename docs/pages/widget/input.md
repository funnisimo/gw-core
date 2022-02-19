# Handling User Input

There are some functions in the UI library that allow you to accept use input.

## Input Widget

This function allows you to read text from the user at a provided location on the current screen. It will return the text that you provided and will cleanup the screen after itself. If you want the text to remain, just draw it back after the return.

```js
const app = GWU.app.make({ width: 60, height: 20, loop: LOOP });
SHOW(app);

const scene = app.scene;
const build = scene.build;

const name = build.pos(40, 5).text('...', { class: 'result', width: 15 });

build.pos(5, 5).text('Name:');
build
    .pos(11, 5)
    .input({ width: 20, placeholder: 'Type here...', id: 'NAME' })
    .on('action', function () {
        name.text(this.text());
    });

const age = build.pos(40, 9).text('...', { class: 'result', width: 15 });

build.pos(5, 9).text('Age:');
build
    .pos(11, 9)
    .input({
        numbersOnly: true,
        min: 15,
        max: 99,
        placeholder: '15-99',
        id: 'AGE',
    })
    .on('action', function () {
        age.text(this.text());
    });
```
