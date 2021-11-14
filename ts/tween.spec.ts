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
            .onUpdate(updateCb)
            .start();

        while (tween.isRunning()) {
            tween.tick(50);
        }

        // only called when there is a change
        expect(updateCb).toHaveBeenCalledTimes(10);
    });

    test('start twice', () => {
        const obj = { x: 0, y: 0 };
        const tw = Tween.make(obj).to({ x: 10 }, 100).start();

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

    test('repeat', () => {
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
        });
        tween.onFinish(cbFinish);

        tween.start();
        while (tween.isRunning()) {
            tween.tick(100);
        }

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
            .repeatDelay(500)
            .start();

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
            .yoyo(true)
            .start();

        expect(tween.yoyo()).toBeTruthy();

        while (tween.isRunning()) {
            tween.tick(100);
        }

        // end up back where we started
        expect(obj.x).toEqual(0);
    });
});
