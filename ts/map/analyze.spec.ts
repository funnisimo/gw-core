import 'jest-extended';
import '../../test/matchers';
// import * as UTILS from '../test/utils';
// import * as GW from 'gw-utils';
import * as MAP from '.';

describe('analyze', () => {
    let map: MAP.Map;
    const TILES = {
        '#': 'WALL',
        ' ': 'FLOOR',
        '+': 'DOOR',
    };

    describe('updateLoopiness', () => {
        test('Marks loop', () => {
            map = MAP.from(
                [
                    '#########',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '##+###+##',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '#########',
                ],
                TILES
            );

            MAP.updateLoopiness(map);

            // map.dump((c) =>
            //     c.hasCellFlag(MAP.flags.Cell.IS_IN_LOOP) ? '*' : ' '
            // );

            expect(
                map.count((c) =>
                    c.hasCellFlag(MAP.flags.Cell.IS_IN_LOOP) ? true : false
                )
            ).toEqual(16);
        });
    });

    describe('chokepoints', () => {
        test('no gate sites or chokepoints', () => {
            map = MAP.from(
                [
                    '#########',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '##+###+##',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '#########',
                ],
                TILES
            );

            MAP.updateLoopiness(map);
            MAP.updateChokepoints(map, true);

            expect(
                map.count((c) => c.hasCellFlag(MAP.flags.Cell.IS_GATE_SITE))
            ).toEqual(0);
            expect(
                map.count((c) => c.hasCellFlag(MAP.flags.Cell.IS_CHOKEPOINT))
            ).toEqual(0);
        });

        test('gate sites and chokepoints', () => {
            map = MAP.from(
                [
                    '####################',
                    '#    +      #      #',
                    '#    #      #      #',
                    '#    #      +      #',
                    '##############+#####',
                    '#    #             #',
                    '#    +             #',
                    '#    #             #',
                    '#    #             #',
                    '##################+#',
                    '#    #      #      #',
                    '#    #      +      #',
                    '#    +      #      #',
                    '#    #      #      #',
                    '#    #      #      #',
                    '##+############+####',
                    '#    #             #',
                    '#    +             #',
                    '#    #             #',
                    '####################',
                ],
                TILES
            );

            MAP.updateLoopiness(map);
            MAP.updateChokepoints(map, true);

            // map.dump((c) =>
            //     c.hasCellFlag(MAP.flags.Cell.IS_GATE_SITE) ? '*' : ' '
            // );
            expect(
                map.count((c) => c.hasCellFlag(MAP.flags.Cell.IS_GATE_SITE))
            ).toEqual(5);
            expect(
                map.count((c) => c.hasCellFlag(MAP.flags.Cell.IS_CHOKEPOINT))
            ).toEqual(5);

            expect(map.cell(1, 1).chokeCount).toEqual(12);
            expect(map.cell(5, 1).chokeCount).toEqual(12);

            expect(map.cell(6, 1).chokeCount).toEqual(31);
            expect(map.cell(12, 3).chokeCount).toEqual(31);

            expect(map.cell(13, 3).chokeCount).toEqual(50);
            expect(map.cell(14, 4).chokeCount).toEqual(50);

            expect(map.cell(1, 5).chokeCount).toEqual(16);
            expect(map.cell(5, 6).chokeCount).toEqual(16);

            expect(map.cell(6, 5).chokeCount).toEqual(7 * 18 - 6);
            expect(map.cell(18, 9).chokeCount).toEqual(7 * 18 - 6);
        });
    });
});
