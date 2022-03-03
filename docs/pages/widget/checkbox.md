# HTML CheckBox

Here is an example of an HTML style checkbox field. Notice that it is a <checkbox> element and not <input type=checkbox>.

```js
const app = GWU.app.make({ width: 60, height: 20, loop: LOOP, scene: true });
SHOW(app);

const scene = app.scene;
const build = new GWU.widget.Builder(scene);

scene.styles.add('checkbox:hover', { fg: 'teal' });
scene.styles.add('checkbox:focus', { fg: 'dark_teal' });

const t = build
    .pos(10, 3)
    .style('fg', 'red')
    .text('Click the checkboxes to see their values:');

const cb = build.pos(10, 5).checkbox({ id: 'A', text: 'This is a checkbox.' });
cb.on('action', () => {
    t.text('value = ' + cb.value());
});

const cb2 = build
    .pos(10, 7)
    .checkbox({ id: 'B', value: 'custom', text: 'Checkbox B' });
cb2.on('action', () => {
    t.text('value = ' + cb2.value());
});

const cb3 = build.pos(10, 9).checkbox({
    id: 'C',
    check: 'X',
    uncheck: 'O',
    checked: true,
    value: ['OFF', 'ON'],
    text: 'This is another checkbox.',
});
cb3.on('action', () => {
    t.text('value = ' + cb3.value());
});
```
