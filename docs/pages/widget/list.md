# List

The List widget shows a list of choices.

```js
const app = GWU.app.make({ width: 100, height: 38, loop: LOOP, scene: true });
SHOW(app);

app.styles.add('th', { bg: 'light_teal', fg: 'dark_blue' });
app.styles.add('td', { bg: 'darker_gray' });
app.styles.add('td:odd', { bg: 'gray' });
app.styles.add('td:hover', { bg: 'light_gray' });
app.styles.add('td:selected', { bg: 'light_green' });

const scene = app.scene;
const build = scene.build;

const list = build.datalist({
    id: 'LIST',
    x: 10,
    y: 5,
    width: 20,
    height: 28,

    header: 'Food Items',
    align: 'center',
    border: false,
});

const text = build.text('Choose.', {
    x: 10,
    y: 3,
    width: 30,
});

list.data(['Taco', 'Burger', 'Salad', 'Fruit Cup']);
list.select(0, 0);

list.on('change', () => {
    if (!list.selectedData) return;
    text.text('You are looking at : #{teal}' + list.selectedData);
});

scene.on('LIST', () => {
    if (!list.selectedData) return;
    text.text('You chose : #{red}' + list.selectedData);
});
```
