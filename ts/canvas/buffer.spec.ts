import 'jest-extended';

import * as Buffer from './buffer';

describe('buffer', () => {
    describe('Buffer', () => {
        let target = makeTarget();

        function makeTarget() {
            return {
                width: 10,
                height: 8,
                copyTo: jest.fn(),
                draw: jest.fn(),
                toGlyph: jest.fn().mockImplementation((ch) => ch.charCodeAt(0)),
            };
        }

        beforeEach(() => {});

        test('basics', () => {
            const b = new Buffer.Buffer(target);
            expect(b.width).toEqual(target.width);
            expect(b.height).toEqual(target.height);
            expect(target.copyTo).toHaveBeenCalled();

            target.copyTo.mockClear();
            target.draw.mockClear();

            b.render();
            expect(target.draw).toHaveBeenCalled();

            target.copyTo.mockClear();
            target.draw.mockClear();

            b.load();
            expect(target.copyTo).toHaveBeenCalled();

            b.draw(3, 2, '@', 0xfff);
            expect(target.toGlyph).toHaveBeenCalledWith('@');
        });
    });
});
