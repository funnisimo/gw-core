import 'jest-extended';
import { getBufferText } from '../test/utils';

import * as Buffer from './buffer';
import { colors } from './color';

describe('buffer', () => {
    describe('DataBuffer', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        test('constructor', () => {
            const b = new Buffer.Buffer(10, 8);
            expect(b.width).toEqual(10);
            expect(b.height).toEqual(8);
            expect(b.info(0, 0)).toEqual({ ch: null, bg: 0x0000, fg: 0x0000 });
        });

        test('draw', () => {
            const b = new Buffer.Buffer(10, 8);
            b.draw(1, 2, '3', 0xf00, 0x0f0);
            expect(b.info(1, 2)).toEqual({ ch: '3', fg: 0xf00f, bg: 0x0f0f });

            b.draw(1, 2);
            expect(b.info(1, 2)).toEqual({ ch: '3', fg: 0xf00f, bg: 0x0f0f });

            b.draw(2, 3, 'A', colors.white, colors.gray);
            expect(b.info(2, 3)).toEqual({ ch: 'A', fg: 0xffff, bg: 0x888f });

            // @ts-ignore
            b.draw(2, 3, null, null, null);
            expect(b.info(2, 3)).toEqual({ ch: 'A', fg: 0xffff, bg: 0x888f });
        });

        test('drawSprite', () => {
            const b = new Buffer.Buffer(10, 8);
            b.drawSprite(1, 2, { ch: 'A', fg: 0xf00, bg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x0f0f });

            // @ts-ignore
            b.drawSprite(1, 2, { ch: null, fg: null, bg: null });
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x0f0f });

            b.drawSprite(1, 2, {});
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x0f0f });

            b.drawSprite(1, 2, { ch: 'B' });
            expect(b.info(1, 2)).toEqual({ ch: 'B', fg: 0xf00f, bg: 0x0f0f });

            b.drawSprite(1, 2, { fg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ ch: 'B', fg: 0x0f0f, bg: 0x0f0f });
        });

        test('blackOut', () => {
            const b = new Buffer.Buffer(10, 8);
            b.drawSprite(1, 2, { ch: 'A', fg: 0xf00, bg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x0f0f });

            b.blackOut(1, 2);
            expect(b.info(1, 2)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });

            b.drawSprite(1, 2, { ch: 'A', fg: 0xf00, bg: 0x0f0 });
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x0f0f });

            b.fill('A', 0x321, 0x987);
            expect(b.info(0, 0)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });
            expect(b.info(0, 7)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });
            expect(b.info(9, 7)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });
            expect(b.info(9, 0)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });

            b.blackOut();
            expect(b.info(0, 0)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
            expect(b.info(0, 7)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
            expect(b.info(9, 7)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
            expect(b.info(9, 0)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
        });

        test('fill', () => {
            const b = new Buffer.Buffer(10, 8);
            expect(b.info(1, 2)).toEqual({ ch: null, fg: 0x0000, bg: 0 });

            b.fill('A', 0x321, 0x987);
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });
            expect(b.info(9, 7)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });

            b.fill();
            expect(b.info(1, 2)).toEqual({ ch: ' ', fg: 0xffff, bg: 0x000f });
        });

        test('copy', () => {
            const b = new Buffer.Buffer(10, 8);
            expect(b.info(1, 2)).toEqual({ ch: null, fg: 0x0000, bg: 0 });

            b.fill('A', 0x321, 0x987);
            expect(b.info(1, 2)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });

            const a = new Buffer.Buffer(10, 8);
            a.copy(b);
            expect(a.info(1, 2)).toEqual({ ch: 'A', fg: 0x321f, bg: 0x987f });
        });

        test('drawText', () => {
            const b = new Buffer.Buffer(50, 10);
            expect(b.drawText(0, 0, 'test')).toEqual(1);
            expect(b.info(0, 0)).toEqual({
                ch: 't',
                fg: 0xffff,
                bg: 0x0000,
            });
            expect(b.info(1, 0)).toEqual({
                ch: 'e',
                fg: 0xffff,
                bg: 0x0000,
            });
            expect(b.info(2, 0)).toEqual({
                ch: 's',
                fg: 0xffff,
                bg: 0x0000,
            });
            expect(b.info(3, 0)).toEqual({
                ch: 't',
                fg: 0xffff,
                bg: 0x0000,
            });

            expect(b.drawText(0, 1, 'test', 'red', 'green')).toEqual(1);
            expect(b.info(0, 1)).toEqual({
                ch: 't',
                fg: 0xf00f,
                bg: 0x0f0f,
            });
            expect(b.info(1, 1)).toEqual({
                ch: 'e',
                fg: 0xf00f,
                bg: 0x0f0f,
            });
            expect(b.info(2, 1)).toEqual({
                ch: 's',
                fg: 0xf00f,
                bg: 0x0f0f,
            });
            expect(b.info(3, 1)).toEqual({
                ch: 't',
                fg: 0xf00f,
                bg: 0x0f0f,
            });

            // it will not wrap
            expect(b.drawText(8, 2, 'test', '#f00', '#0F0')).toEqual(1);
            expect(b.info(8, 2)).toEqual({
                ch: 't',
                fg: 0xf00f,
                bg: 0x0f0f,
            });
            expect(b.info(9, 2)).toEqual({
                ch: 'e',
                fg: 0xf00f,
                bg: 0x0f0f,
            });
            expect(b.info(0, 3)).toEqual({ ch: null, fg: 0x0000, bg: 0x0000 });

            b.drawText(
                0,
                3,
                'testing longer values that should be truncated',
                'white',
                'black',
                10
            );
            expect(getBufferText(b, 0, 3, 40)).toEqual('testing lo');
        });

        test('drawText - align', () => {
            const b = new Buffer.Buffer(20, 10);

            b.drawText(0, 0, 'Test', 'white', 'black', 10);
            expect(getBufferText(b, 0, 0, 10, false)).toEqual('Test      ');

            b.drawText(0, 1, 'Test', 'white', 'black', 10, 'right');
            expect(getBufferText(b, 0, 1, 10, false)).toEqual('      Test');

            b.drawText(0, 2, 'Test', 'white', 'black', 10, 'center');
            expect(getBufferText(b, 0, 2, 10, false)).toEqual('   Test   ');
        });

        test('wrapText', () => {
            const b = new Buffer.Buffer(20, 10);
            expect(
                b.wrapText(0, 0, 10, 'testing a wrapped text string')
            ).toEqual(4);
            expect(b.info(0, 0)).toEqual({
                ch: 't',
                fg: 0xffff,
                bg: 0x0000,
            });
            expect(b.info(0, 1)).toEqual({
                ch: 'w',
                fg: 0xffff,
                bg: 0x0000,
            });
            expect(b.info(0, 2)).toEqual({
                ch: 't',
                fg: 0xffff,
                bg: 0x0000,
            });
            expect(b.info(0, 3)).toEqual({
                ch: 's',
                fg: 0xffff,
                bg: 0x0000,
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
            expect(getBufferText(b, 0, 5, 10)).toEqual('testing a');
            expect(getBufferText(b, 0, 6, 10)).toEqual('wrapped');
            expect(getBufferText(b, 0, 7, 10)).toEqual('text');
            expect(getBufferText(b, 0, 8, 10)).toEqual('string');
            // it fills out the line to the full width with the bg color
            expect(b.info(9, 5)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x00ff });
            expect(b.info(9, 6)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x00ff });
            expect(b.info(9, 7)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x00ff });
            expect(b.info(9, 8)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x00ff });
        });

        test('fillRect', () => {
            const b = new Buffer.Buffer(10, 10);
            b.fillRect(2, 3, 3, 2, 'A', 'red', 'blue');
            expect(getBufferText(b, 2, 3, 6)).toEqual('AAA');
            expect(getBufferText(b, 2, 4, 6)).toEqual('AAA');
            expect(getBufferText(b, 2, 5, 6)).toEqual('');
            expect(b.info(2, 3)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x00ff });

            b.fillRect(2, 3, 3, 2, null, null, null);
            expect(getBufferText(b, 2, 3, 6)).toEqual('AAA');
            expect(getBufferText(b, 2, 4, 6)).toEqual('AAA');
            expect(getBufferText(b, 2, 5, 6)).toEqual('');
            expect(b.info(2, 3)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x00ff });

            b.fillRect(2, 3, 3, 2, null, 0x0f0, null);
            expect(b.info(2, 3)).toEqual({ ch: 'A', fg: 0x0f0f, bg: 0x00ff });

            b.fillRect(2, 3, 3, 2);
            expect(b.info(2, 3)).toEqual({ ch: 'A', fg: 0x0f0f, bg: 0x00ff });
        });

        test('blackOutRect', () => {
            const b = new Buffer.Buffer(10, 10);
            b.fill('A', 0xf00, 0x00f);
            b.blackOutRect(1, 1, 2, 2);
            expect(b.info(0, 0)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x00ff });
            expect(b.info(1, 1)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
            expect(b.info(2, 2)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
            expect(b.info(3, 3)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x00ff });

            b.blackOutRect(2, 2, 2, 2, 'green');
            expect(b.info(0, 0)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x00ff });
            expect(b.info(1, 1)).toEqual({ ch: ' ', fg: 0x000f, bg: 0x000f });
            expect(b.info(2, 2)).toEqual({ ch: ' ', fg: 0x0f0f, bg: 0x0f0f });
            expect(b.info(3, 3)).toEqual({ ch: ' ', fg: 0x0f0f, bg: 0x0f0f });
        });

        test('highlight', () => {
            const b = new Buffer.Buffer(10, 10);
            b.fill('A', 0xf00, 0x00f);
            expect(b.info(0, 0)).toEqual({ ch: 'A', fg: 0xf00f, bg: 0x00ff });
            // adds
            b.highlight(1, 1, 'white', 50);
            expect(b.info(1, 1)).toEqual({ ch: 'A', fg: 0xf88f, bg: 0x88ff });
            b.highlight(2, 2, 0x222, 50);
            expect(b.info(2, 2)).toEqual({ ch: 'A', fg: 0xf11f, bg: 0x11ff });
        });

        // test('mix', () => {
        //     const b = new Buffer.Buffer(10, 10);
        //     b.fill('A', 0xf00, 0x00f);
        //     // combines
        //     b.mix('green', 50);
        //     expect(b.info(0, 0)).toEqual({ ch: 'A', fg: 0x880, bg: 0x088 });

        //     b.mix(0xffff, 50);
        //     expect(b.info(0, 0)).toEqual({ ch: 'A', fg: 0xcc8, bg: 0x8cc });
        // });

        test('dump', () => {
            const b = new Buffer.Buffer(5, 5);
            b.fill('A', 0xf00, 0x00f);
            jest.spyOn(console, 'log').mockReturnValue();

            b.draw(2, 2, ' ');
            b.dump();

            expect(console.log).toHaveBeenCalledWith(
                '     01234\n\n 0]  AAAAA\n 1]  AAAAA\n 2]  AA AA\n 3]  AAAAA\n 4]  AAAAA'
            );
        });
    });
});
