## Using the Keyboard

By default, in examples, the results <DIV> has keyboard events hooked into the LOOP. When you run the LOOP, it will let you handle keypress events.

```js
const handler = new GWU.io.Handler(LOOP);
handler.run(
    {
        keypress(e) {
            SHOW(e.key);
        },
    },
    1000
);
SHOW('Click on me and type any key.');
```

You can also trap specific key combinations.

```js
const handler = new GWU.io.Handler(LOOP);
handler.run(
    {
        t(e) {
            SHOW('lowercase : ' + e.key);
        },
        T(e) {
            SHOW('uppercase(shift) : ' + e.key);
        },
        '^t': (e) => {
            SHOW('control : ' + e.key);
        },
        '^T': (e) => {
            SHOW('uppercase(shift) control : ' + e.key);
        },
        keypress(e) {
            SHOW(
                `Not a "T", but... : key=${e.key}, shift=${e.shiftKey}, control=${e.ctrlKey}, alt=${e.altKey}, meta=${e.metaKey}`
            );
        },
    },
    1000
);
SHOW('Click on me and type the letter "T".');
```
