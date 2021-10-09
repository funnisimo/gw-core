import 'jest-extended';
import { extractBufferText } from '../../test/utils';

import * as Buffer from './buffer';
import { colors } from '../color';

describe('buffer', () => {
    describe('DataBuffer', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        test('constructor', () => {
            const b = new Buffer.DataBuffer(10, 8);
            expect(b.width).toEqual(10);
            expect(b.height).toEqual(8);
            expect(b.info(0, 0)).toEqual({ glyph: 0, bg: 0, fg: 0 });
        });

        test('draw', () => {
            const b = new Buffer.DataBuffer(10, 8);
            b.draw(1, 2, 3, 0xf00, 0x0f0);
            expect(b.info(1, 2)).toEqual({ glyph: 3, fg: 0xf00, bg: 0x0f0 });

            b.draw(1, 2);
            expect(b.info(1, 2)).toEqual({ glyph: 3, fg: 0xf00, bg: 0x0f0 });

            b.draw(2, 3, 'A', colors.white, colors.gray);
            expect(b.info(2, 3)).toEqual({ glyph: 65, fg: 0xfff, bg: 0x888 });

            // @ts-ignore
            b.draw(2, 3, null, null, null);
            expect(b.info(2, 3)).toEqual({ glyph: 65, fg: 0xfff, bg: 0x888 });
        });

        test('drawSprite', () => {
            const b = new Buffer.DataBuffer(10, 8);
            b.drawSprite(1, 2, { ch: 'A', fg: 0xf00, bg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x0f0 });

            // @ts-ignore
            b.drawSprite(1, 2, { ch: null, fg: null, bg: null });
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x0f0 });

            b.drawSprite(1, 2, {});
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x0f0 });

            b.drawSprite(1, 2, { ch: 'B' });
            expect(b.info(1, 2)).toEqual({ glyph: 66, fg: 0xf00, bg: 0x0f0 });

            b.drawSprite(1, 2, { fg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ glyph: 66, fg: 0x0f0, bg: 0x0f0 });
        });

        test('blackOut', () => {
            const b = new Buffer.DataBuffer(10, 8);
            b.drawSprite(1, 2, { ch: 'A', fg: 0xf00, bg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x0f0 });

            b.blackOut(1, 2);
            expect(b.info(1, 2)).toEqual({ glyph: 0, fg: 0, bg: 0 });

            b.drawSprite(1, 2, { ch: 'A', fg: 0xf00, bg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x0f0 });

            b.fill('A', 0x321, 0x987);
            expect(b.info(0, 0)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });
            expect(b.info(0, 7)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });
            expect(b.info(9, 7)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });
            expect(b.info(9, 0)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });

            b.blackOut();
            expect(b.info(0, 0)).toEqual({ glyph: 0, fg: 0, bg: 0 });
            expect(b.info(0, 7)).toEqual({ glyph: 0, fg: 0, bg: 0 });
            expect(b.info(9, 7)).toEqual({ glyph: 0, fg: 0, bg: 0 });
            expect(b.info(9, 0)).toEqual({ glyph: 0, fg: 0, bg: 0 });
        });

        test('fill', () => {
            const b = new Buffer.DataBuffer(10, 8);
            expect(b.info(1, 2)).toEqual({ glyph: 0, fg: 0, bg: 0 });

            b.fill('A', 0x321, 0x987);
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });
            expect(b.info(9, 7)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });

            b.fill();
            expect(b.info(1, 2)).toEqual({ glyph: 0, fg: 0xfff, bg: 0x000 });
        });

        test('copy', () => {
            const b = new Buffer.DataBuffer(10, 8);
            expect(b.info(1, 2)).toEqual({ glyph: 0, fg: 0, bg: 0 });

            b.fill('A', 0x321, 0x987);
            expect(b.info(1, 2)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });

            const a = new Buffer.DataBuffer(10, 8);
            a.copy(b);
            expect(a.info(1, 2)).toEqual({ glyph: 65, fg: 0x321, bg: 0x987 });
        });

        test('drawText', () => {
            const b = new Buffer.DataBuffer(50, 10);
            expect(b.drawText(0, 0, 'test')).toEqual(1);
            expect(b.info(0, 0)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });
            expect(b.info(1, 0)).toEqual({
                glyph: 'e'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });
            expect(b.info(2, 0)).toEqual({
                glyph: 's'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });
            expect(b.info(3, 0)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });

            expect(b.drawText(0, 1, 'test', 'red', 'green')).toEqual(1);
            expect(b.info(0, 1)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xf00,
                bg: 0x0f0,
            });
            expect(b.info(1, 1)).toEqual({
                glyph: 'e'.charCodeAt(0),
                fg: 0xf00,
                bg: 0x0f0,
            });
            expect(b.info(2, 1)).toEqual({
                glyph: 's'.charCodeAt(0),
                fg: 0xf00,
                bg: 0x0f0,
            });
            expect(b.info(3, 1)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xf00,
                bg: 0x0f0,
            });

            // it will not wrap
            expect(b.drawText(8, 2, 'test', '#f00', '#0F0')).toEqual(1);
            expect(b.info(8, 2)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xf00,
                bg: 0x0f0,
            });
            expect(b.info(9, 2)).toEqual({
                glyph: 'e'.charCodeAt(0),
                fg: 0xf00,
                bg: 0x0f0,
            });
            expect(b.info(0, 3)).toEqual({ glyph: 0, fg: 0, bg: 0 });

            b.drawText(
                0,
                3,
                'testing longer values that should be truncated',
                'white',
                'black',
                10
            );
            expect(extractBufferText(b, 0, 3, 40)).toEqual('testing lo');
        });

        test('drawText - align', () => {
            const b = new Buffer.DataBuffer(20, 10);

            b.drawText(0, 0, 'Test', 'white', 'black', 10);
            expect(extractBufferText(b, 0, 0, 10, false)).toEqual('Test      ');

            b.drawText(0, 1, 'Test', 'white', 'black', 10, 'right');
            expect(extractBufferText(b, 0, 1, 10, false)).toEqual('      Test');

            b.drawText(0, 2, 'Test', 'white', 'black', 10, 'center');
            expect(extractBufferText(b, 0, 2, 10, false)).toEqual('   Test   ');
        });

        test('wrapText', () => {
            const b = new Buffer.DataBuffer(20, 10);
            expect(
                b.wrapText(0, 0, 10, 'testing a wrapped text string')
            ).toEqual(4);
            expect(b.info(0, 0)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });
            expect(b.info(0, 1)).toEqual({
                glyph: 'w'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });
            expect(b.info(0, 2)).toEqual({
                glyph: 't'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });
            expect(b.info(0, 3)).toEqual({
                glyph: 's'.charCodeAt(0),
                fg: 0xfff,
                bg: 0,
            });

            expect(
                b.wrapText(
                    0,
                    5,
                    10,
                    'testing a wrapped text string',
                    'red',
                    'blue'
                )
            ).toEqual(4);
            expect(extractBufferText(b, 0, 5, 10)).toEqual('testing a');
            expect(extractBufferText(b, 0, 6, 10)).toEqual('wrapped');
            expect(extractBufferText(b, 0, 7, 10)).toEqual('text');
            expect(extractBufferText(b, 0, 8, 10)).toEqual('string');
            // it fills out the line to the full width with the bg color
            expect(b.info(9, 5)).toEqual({ glyph: 0, fg: 0, bg: 0x00f });
            expect(b.info(9, 6)).toEqual({ glyph: 0, fg: 0, bg: 0x00f });
            expect(b.info(9, 7)).toEqual({ glyph: 0, fg: 0, bg: 0x00f });
            expect(b.info(9, 8)).toEqual({ glyph: 0, fg: 0, bg: 0x00f });
        });

        test('fillRect', () => {
            const b = new Buffer.DataBuffer(10, 10);
            b.fillRect(2, 3, 3, 2, 'A', 'red', 'blue');
            expect(extractBufferText(b, 2, 3, 6)).toEqual('AAA');
            expect(extractBufferText(b, 2, 4, 6)).toEqual('AAA');
            expect(extractBufferText(b, 2, 5, 6)).toEqual('');
            expect(b.info(2, 3)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x00f });

            b.fillRect(2, 3, 3, 2, null, null, null);
            expect(extractBufferText(b, 2, 3, 6)).toEqual('AAA');
            expect(extractBufferText(b, 2, 4, 6)).toEqual('AAA');
            expect(extractBufferText(b, 2, 5, 6)).toEqual('');
            expect(b.info(2, 3)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x00f });

            b.fillRect(2, 3, 3, 2, null, 0x0f0, null);
            expect(b.info(2, 3)).toEqual({ glyph: 65, fg: 0x0f0, bg: 0x00f });

            b.fillRect(2, 3, 3, 2);
            expect(b.info(2, 3)).toEqual({ glyph: 65, fg: 0x0f0, bg: 0x00f });
        });

        test('blackOutRect', () => {
            const b = new Buffer.DataBuffer(10, 10);
            b.fill('A', 0xf00, 0x00f);
            b.blackOutRect(1, 1, 2, 2);
            expect(b.info(0, 0)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x00f });
            expect(b.info(1, 1)).toEqual({ glyph: 0, fg: 0, bg: 0 });
            expect(b.info(2, 2)).toEqual({ glyph: 0, fg: 0, bg: 0 });
            expect(b.info(3, 3)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x00f });

            b.blackOutRect(2, 2, 2, 2, 'green');
            expect(b.info(0, 0)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x00f });
            expect(b.info(1, 1)).toEqual({ glyph: 0, fg: 0, bg: 0 });
            expect(b.info(2, 2)).toEqual({ glyph: 0, fg: 0x0f0, bg: 0x0f0 });
            expect(b.info(3, 3)).toEqual({ glyph: 0, fg: 0x0f0, bg: 0x0f0 });
        });

        test('highlight', () => {
            const b = new Buffer.DataBuffer(10, 10);
            b.fill('A', 0xf00, 0x00f);
            expect(b.info(0, 0)).toEqual({ glyph: 65, fg: 0xf00, bg: 0x00f });
            // adds
            b.highlight(1, 1, 'white', 50);
            expect(b.info(1, 1)).toEqual({ glyph: 65, fg: 0xf88, bg: 0x88f });
            b.highlight(2, 2, 0x222, 50);
            expect(b.info(2, 2)).toEqual({ glyph: 65, fg: 0xf11, bg: 0x11f });
        });

        // test('mix', () => {
        //     const b = new Buffer.DataBuffer(10, 10);
        //     b.fill('A', 0xf00, 0x00f);
        //     // combines
        //     b.mix('green', 50);
        //     expect(b.info(0, 0)).toEqual({ glyph: 65, fg: 0x880, bg: 0x088 });

        //     b.mix(0xfff, 50);
        //     expect(b.info(0, 0)).toEqual({ glyph: 65, fg: 0xcc8, bg: 0x8cc });
        // });

        test('dump', () => {
            const b = new Buffer.DataBuffer(5, 5);
            b.fill('A', 0xf00, 0x00f);
            jest.spyOn(console, 'log').mockReturnValue();

            b.draw(2, 2, 0);
            b.dump();

            expect(console.log).toHaveBeenCalledWith(
                '     01234\n\n 0]  AAAAA\n 1]  AAAAA\n 2]  AA AA\n 3]  AAAAA\n 4]  AAAAA'
            );
        });
    });

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
