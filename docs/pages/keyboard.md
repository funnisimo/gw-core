## Using the Keyboard

By default, in examples, the results <DIV> has keyboard events hooked into the LOOP. When you run the LOOP, it will let you handle keypress events.

```js
LOOP.run(
    {
        keypress(e) {
            SHOW(e.key);
        },
    },
    1000
);
```

You can also trap specific key combinations.

```js
LOOP.run(
    {
        t(e) {
            SHOW('lowercase : ' + e.key);
        },
        T(e) {
            SHOW('uppercase : ' + e.key);
        },
        '^t': (e) => {
            SHOW('control : ' + e.key);
        },
        '^T': (e) => {
            SHOW('uppercase control : ' + e.key);
        },
    },
    1000
);
```
