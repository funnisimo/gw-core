# HTML FieldSet

FieldSets allow you to group things.

```js
const app = GWU.app.make({ width: 60, height: 20, loop: LOOP });
SHOW(app);

const scene = app.scene;
const build = scene.build;

scene.styles.add('field', { fg: 'light_blue' });
scene.styles.add('fieldset', { fg: 'green' });
scene.styles.add('legend', { fg: 'gold' });
scene.styles.add('label', { fg: 'pink' });

const f = build
    .fieldset({
        x: 5,
        y: 4,
        width: 20,
        dataWidth: 10,
        legend: 'FIELDSET',
    })
    .add('Name', '{{name%10s}}')
    .add('Age', '{{age%10d}}')
    .add('Score', '{{score%10d}}');

f.data({ name: 'Malcolm', age: 35, score: 98 });

const g = build
    .fieldset({
        x: 5,
        y: 10,
        width: 20,
        dataWidth: 10,
        legend: 'FIELDSET',
        legendAlign: 'center',
        border: 'ascii',
    })
    .add('Name', '{{name%10s}}')
    .add('Age', '{{age%10d}}')
    .add('Score', '{{score%10d}}');

g.data({ name: 'Malcolm', age: 35, score: 98 });
```
