import 'jest-extended';
import * as Buffer from './buffer';
import { colors } from './color';

describe('buffer', () => {


    describe('DataBuffer', () => {

        test('constructor', () => {
            const b = new Buffer.DataBuffer(10, 8);
            expect(b.width).toEqual(10);
            expect(b.height).toEqual(8);
            expect(b.get(0, 0)).toEqual({ ch: 0, bg: 0, fg: 0});
            expect(b.data).toBeObject();
        });

        test('draw', () => {
            const b = new Buffer.DataBuffer(10, 8);
            b.draw(1, 2, 3, 0xF00, 0x0F0);
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            b.draw(1, 2);
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            b.draw(2, 3, 'A', colors.white, colors.gray);
            expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0xFFF, bg: 0x888 });
        });

        test('drawSprite', () => {
            const b = new Buffer.DataBuffer(10, 8);
            b.drawSprite(1, 2, { ch: 3, fg: 0xF00, bg: 0x0F0 });
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            // @ts-ignore
            b.drawSprite(1, 2, { ch: null, fg: null, bg: null });
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            b.drawSprite(1, 2, {});
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            b.drawSprite(1, 2, { ch: 'A' });
            expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0xF00, bg: 0x0F0 });

            b.drawSprite(1, 2, { fg: 0x0F0 });
            expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0x0F0, bg: 0x0F0 });

        });

        test('blackOut', () => {
            const b = new Buffer.DataBuffer(10, 8);
            b.drawSprite(1, 2, { ch: 3, fg: 0xF00, bg: 0x0F0 });
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            b.blackOut(1, 2);
            expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });

            b.drawSprite(1, 2, { ch: 3, fg: 0xF00, bg: 0x0F0 });
            expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xF00, bg: 0x0F0 });

            b.blackOut();
            expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });
        });

        test('fill', () => {
            const b = new Buffer.DataBuffer(10, 8);
            expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });

            b.fill('A', 0x321, 0x987);
            expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0x321, bg: 0x987 });

            b.fill();
            expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0xFFF, bg: 0x000 });
        });

        test('copy', () => {
            const b = new Buffer.DataBuffer(10, 8);
            expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });

            b.fill('A', 0x321, 0x987);
            expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0x321, bg: 0x987 });

            const a = new Buffer.DataBuffer(10, 8);
            a.copy(b);
            expect(a.get(1, 2)).toEqual({ ch: 65, fg: 0x321, bg: 987 });
        });

    });

});
