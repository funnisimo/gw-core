import 'jest-extended';
import * as Tween from './tween';

describe('Tween', () => {
    test('tick before start', () => {
        const obj = { x: 0, y: 0 };
        const startCb = jest.fn();
        const tween = Tween.make(obj)
            .to(
                {
                    x: 10,
                },
                1000
            )
            .onStart(startCb);

        expect(tween.isRunning()).toBeFalsy();
        tween.tick(100);
        expect(tween.isRunning()).toBeFalsy();
        expect(startCb).not.toHaveBeenCalled();
    });

    test('async finish', async () => {
        const obj = { x: 0, y: 0 };
        const finishCb = jest.fn().mockResolvedValue(123);
        const tween = Tween.make(obj)
            .to({
                x: 10,
            })
            .duration(1000)
            .onFinish(finishCb);

        const p = tween.start();
        while (tween.isRunning()) {
            tween.tick(100);
        }

        expect(await p).toEqual(123);
        expect(finishCb).toHaveBeenCalledWith(obj, true);
    });

    test('basic', () => {
        const obj = { x: 0, y: 0 };
        const tween = Tween.make(obj);
        expect(tween).toBeInstanceOf(Tween.Tween);

        tween.to(
            {
                x: 10,
            },
            1000
        );

        expect(tween._goal.x).toEqual(10);
        expect(tween.duration()).toEqual(1000);

        expect(tween.isRunning()).toBeFalsy();
        tween.start();
        expect(tween.isRunning()).toBeTruthy();

        tween.tick(50);
        expect(obj.x).toEqual(0);
        tween.tick(50);
        expect(obj.x).toEqual(1);
        tween.tick(400);
        expect(obj.x).toEqual(5);
        tween.tick(500);
        expect(obj.x).toEqual(10);

        expect(tween.isRunning()).toBeFalsy();
    });

    test('update', () => {
        const obj = { x: 0, y: 0 };
        const updateCb = jest.fn();
        const tween = Tween.make(obj)
            .to({
                x: 10,
            })
            .duration(1000)
            .onUpdate(updateCb);
        tween.start();

        while (tween.isRunning()) {
            tween.tick(50);
        }

        // only called when there is a change
        expect(updateCb).toHaveBeenCalledTimes(10);
    });

    test('start twice', () => {
        const obj = { x: 0, y: 0 };
        const tw = Tween.make(obj).to({ x: 10 }, 100);
        tw.start();

        while (tw.isRunning()) {
            tw.tick(50);
        }

        expect(obj.x).toEqual(10);

        obj.x = 20;
        tw.start();

        while (tw.isRunning()) {
            tw.tick(50);
        }

        expect(obj.x).toEqual(10);
    });

    test('repeat', async () => {
        const obj = { x: 0, y: 0 };
        const tween = Tween.make(obj);
        expect(tween).toBeInstanceOf(Tween.Tween);

        tween
            .to(
                {
                    x: 10,
                },
                1000
            )
            .repeat(3);

        expect(tween.repeat()).toEqual(3);

        const cbStart = jest.fn().mockImplementation((o) => {
            expect(o.x).toEqual(0);
        });
        tween.onStart(cbStart);

        const cbRepeat = jest.fn().mockImplementation((o) => {
            expect(o.x).toEqual(0); // resets to starting value
        });
        tween.onRepeat(cbRepeat);

        const cbFinish = jest.fn().mockImplementation((o) => {
            expect(o.x).toEqual(10);
            return 123; // You can change the return value of the promise
        });
        tween.onFinish(cbFinish);

        const p = tween.start();
        while (tween.isRunning()) {
            tween.tick(100);
        }

        expect(await p).toEqual(123);

        expect(cbStart).toHaveBeenCalledTimes(1);
        expect(cbRepeat).toHaveBeenCalledTimes(2);
        expect(cbFinish).toHaveBeenCalledTimes(1);
    });

    test('delay', () => {
        const obj = { x: 0, y: 0 };
        const tween = Tween.make(obj)
            .to(
                {
                    x: 10,
                },
                1000
            )
            .delay(500);

        expect(tween.delay()).toEqual(500);

        const cbStart = jest.fn().mockImplementation((o) => {
            expect(o.x).toEqual(0);
        });
        tween.onStart(cbStart);

        tween.start();
        expect(tween.isRunning()).toBeTruthy();

        expect(cbStart).not.toHaveBeenCalled();

        tween.tick(100);
        expect(cbStart).not.toHaveBeenCalled();
        tween.tick(100);
        expect(cbStart).not.toHaveBeenCalled();
        tween.tick(100);
        expect(cbStart).not.toHaveBeenCalled();
        tween.tick(100);
        expect(cbStart).not.toHaveBeenCalled();
        expect(tween.isRunning()).toBeTruthy();

        tween.tick(100);
        expect(cbStart).toHaveBeenCalled();
        expect(tween.isRunning()).toBeTruthy();

        while (tween.isRunning()) {
            tween.tick(50);
        }

        expect(obj.x).toEqual(10);
    });

    test('repeatDelay', () => {
        const obj = { x: 0, y: 0 };
        const tween = Tween.make(obj)
            .to({
                x: 10,
            })
            .duration(1000)
            .delay(0)
            .repeat(3)
            .repeatDelay(500);
        tween.start();

        expect(tween.repeatDelay()).toEqual(500);

        let totalTime = 0;
        while (tween.isRunning()) {
            tween.tick(100);
            totalTime += 100;
        }

        expect(totalTime).toEqual(0 + 1000 + 500 + 1000 + 500 + 1000);
    });

    test('yoyo', () => {
        const obj = { x: 0, y: 0 };
        const tween = Tween.make(obj)
            .to({
                x: 10,
            })
            .duration(1000)
            .repeat(2)
            .yoyo(true);
        tween.start();

        expect(tween.yoyo()).toBeTruthy();

        while (tween.isRunning()) {
            tween.tick(100);
        }

        // end up back where we started
        expect(obj.x).toEqual(0);
    });

    test('from', () => {
        const obj = { x: 0, y: 0 };
        const tween = Tween.make(obj).from(
            {
                x: 10,
            },
            1000
        );
        tween.start();

        expect(tween.isRunning()).toBeTruthy();
        expect(obj.x).toEqual(10);

        tween.tick(50);
        expect(obj.x).toEqual(9);
        tween.tick(50);
        expect(obj.x).toEqual(9);
        tween.tick(400);
        expect(obj.x).toEqual(5);
        tween.tick(500);
        expect(obj.x).toEqual(0);

        expect(tween.isRunning()).toBeFalsy();
    });

    test('blink - boolean', () => {
        const obj = { visible: true };
        const tween = Tween.make(obj)
            .to({ visible: false })
            .repeat(3)
            .repeatDelay(100)
            .duration(100);
        tween.start();

        expect(tween.isRunning()).toBeTruthy();
        expect(obj.visible).toBeTrue();

        // Repeat 1
        tween.tick(90);
        expect(obj.visible).toBeTrue();
        tween.tick(10);
        expect(obj.visible).toBeFalse();

        // Delay 1
        tween.tick(90);
        expect(obj.visible).toBeFalse();
        tween.tick(10);
        expect(obj.visible).toBeTrue();

        // Repeat 2
        tween.tick(90);
        expect(obj.visible).toBeTrue();
        tween.tick(10);
        expect(obj.visible).toBeFalse();

        // Delay 2
        tween.tick(90);
        expect(obj.visible).toBeFalse();
        tween.tick(10);
        expect(obj.visible).toBeTrue();

        // Repeat 3
        tween.tick(90);
        expect(obj.visible).toBeTrue();
        tween.tick(10);
        expect(obj.visible).toBeFalse();

        // done
        expect(tween.isRunning()).toBeFalsy();
    });
});
