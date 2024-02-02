import * as GW from '../index';
import { SetVisibleFn } from './types';

describe('FOV', () => {
    let fov: GW.fov.FOV;
    let tiles: GW.grid.NumGrid;
    let results: GW.grid.NumGrid;
    let msgs: string[] = [];
    let setVisible: SetVisibleFn;

    function setResults(
        results: GW.grid.NumGrid,
        x: number,
        y: number,
        _v: number
    ) {
        // console.log(x, y, v);
        results.set(x, y, 1);
    }

    function setup(w: number, h: number, _captureDebug = false) {
        tiles = GW.grid.alloc(w, h, 0);
        results = GW.grid.alloc(w, h, 0);

        setVisible = setResults.bind(undefined, results);

        // let debug = GW.utils.NOOP;
        // if (captureDebug) {
        //     debug = function capture(...args) {
        //         msgs.push(args.join(', '));
        //     };
        // }

        fov = new GW.fov.FOV({
            isBlocked(x: number, y: number) {
                return tiles._data[x][y] > 0;
            },
            hasXY(x: number, y: number) {
                return tiles.hasXY(x, y);
            },
            // debug,
        });
    }

    beforeEach(() => {
        msgs = [];
    });

    afterEach(() => {
        GW.grid.free(tiles);
        GW.grid.free(results);

        if (msgs.length) {
            console.log(msgs.join('\n'));
        }
    });

    test('do not need hasXY', () => {
        const w = 20,
            h = 20;
        tiles = GW.grid.alloc(w, h, 0);
        results = GW.grid.alloc(w, h, 0);

        setVisible = setResults.bind(undefined, results);

        // let debug = GW.utils.NOOP;
        // if (captureDebug) {
        //     debug = function capture(...args) {
        //         msgs.push(args.join(', '));
        //     };
        // }

        fov = new GW.fov.FOV({
            isBlocked(x: number, y: number) {
                return !tiles.hasXY(x, y) || tiles._data[x][y] > 0;
            },
            // debug,
        });

        tiles._data[2][5] = 1;
        tiles._data[5][2] = 1;

        fov.calculate(5, 5, 10, setVisible);

        // results.dump();

        expect(results._data[5][5]).toEqual(1); // center is always visible
        expect(results._data[2][5]).toEqual(1);
        expect(results._data[1][5]).toEqual(0);
        expect(results._data[5][2]).toEqual(1);
        expect(results._data[5][1]).toEqual(0);

        expect(results._data[5][10]).toEqual(1); // 10 away
    });

    test('will calculate FOV', () => {
        setup(50, 50);

        tiles._data[20][25] = 1;
        tiles._data[25][20] = 1;

        fov.calculate(25, 25, 10, setVisible);

        expect(results._data[25][25]).toEqual(1); // center is always visible
        expect(results._data[20][25]).toEqual(1);
        expect(results._data[19][25]).toEqual(0);
        expect(results._data[25][20]).toEqual(1);
        expect(results._data[25][19]).toEqual(0);

        // grid[25][25] = 2;
        // grid.dump();

        expect(results._data[25][35]).toEqual(1); // 10 away
    });

    describe('tests', () => {
        function fillBlocked(pattern: string[]) {
            pattern.forEach((line, j) => {
                for (let i = 0; i < line.length; ++i) {
                    const ch = line[i];
                    const tile = ch == '#' || ch == '+' ? 1 : 0;
                    tiles._data[i][j] = tile;
                }
            });
        }

        function toText(): string[] {
            const pattern: string[] = [];
            for (let y = 0; y < tiles.height; ++y) {
                let row = '';
                for (let x = 0; x < tiles.width; ++x) {
                    const v = results._data[x][y];
                    const tile = tiles._data[x][y];
                    let ch = tile == 0 ? '.' : '#';
                    if (v <= 0) {
                        ch = ch == '#' ? '+' : 's';
                    }
                    row += ch;
                }
                pattern.push(row);
            }
            return pattern;
        }

        function check(expected: string[], actual: string[]) {
            expect(actual.length).toEqual(expected.length);
            expect(actual).toEqual(expected);
        }

        function calcFov(expected: string[], opts: any = {}) {
            let x = 0;
            let y = 0;

            for (let j = 0; j < expected.length; ++j) {
                const text = expected[j];
                for (let i = 0; i < text.length; ++i) {
                    if (text[i] == '@') {
                        x = i;
                        y = j;
                    }
                }
            }

            fov.calculate(x, y, opts.radius || 100, setVisible);

            // tiles.dump();
            // results.dump();
        }

        function testFov(text: string[], opts: any = {}) {
            if (opts === true) {
                opts = { captureDebug: true };
            }
            const h = text.length;
            const w = text[0].length;

            setup(w, h, opts.captureDebug);

            fillBlocked(text);
            calcFov(text, opts);
            const actual = toText();
            const expected = text.map((line) => line.replace('@', '.'));
            check(expected, actual);
        }

        // http://roguebasin.roguelikedevelopment.org/index.php?title=FOV_using_recursive_shadowcasting
        test('does not match roguebasin', () => {
            testFov(
                [
                    '....sssss..s...ss.', // '....ssssss.....ss'
                    '.....ssss#.s...ss.', // '.....ssss#..s..ss'
                    '.....ssss#.....ss.', // '.....ssss#..s..ss'
                    '......ss##..#..##.', //
                    '.......##.........', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '..................', //
                    '................@.',
                    '..................', //
                ],
                true
            ); //
        });

        test('no barriers', () => {
            testFov([
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '........@........', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................',
            ]); //
        });

        test('small range', () => {
            testFov(
                [
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'ssssss.....ssssss', //
                    'sssss.......sssss', //
                    'sssss.......sssss', //
                    'sssss...@...sssss', //
                    'sssss.......sssss', //
                    'sssss.......sssss', //
                    'ssssss.....ssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss', //
                    'sssssssssssssssss',
                ],
                { radius: 3 }
            ); //
        });

        test('random barriers', () => {
            testFov([
                '......sss........sss.', //
                '.......ss.......sss..', //
                '.......ss......sss...', //
                '........s......ss....', //
                's.......s.....ss.....', //
                'sss...........s......', //
                'sss#.....#...#......s', //
                '...#..............sss', //
                '................#....', //
                '.....................', //
                'ssss#.....@..........', //
                '.....................', //
                '..........#..........', //
                '..........s..........', //
                '.........sss.........', //
                '.........sss.........', //
                '.........sss.........', //
                '........sssss........', //
                '........sssss........', //
                '........sssss........', //
                '.......sssssss.......',
            ]); //
        });

        test('one wall - vertical', () => {
            testFov([
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '........s........', //
                '........s........', //
                '........s........', //
                '........s........', //
                '........s........', //
                '........#........', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '........@........', //
                '.................',
            ]); //

            testFov([
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '........s........', //
                '........s........', //
                '........s........', //
                '........s........', //
                '........#........', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '........@........', //
                '.................',
            ]); //

            testFov([
                '......sssss......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '........s........', //
                '........s........', //
                '........s........', //
                '........#........', //
                '.................', //
                '.................', //
                '.................', //
                '........@........', //
                '.................',
            ]); //

            testFov([
                '......sssss......', //
                '......sssss......', //
                '......sssss......', //
                '......sssss......', //
                '......sssss......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '........s........', //
                '........s........', //
                '........#........', //
                '.................', //
                '.................', //
                '........@........', //
                '.................',
            ]); //

            testFov([
                '....sssssssss....', //
                '....sssssssss....', //
                '....sssssssss....', //
                '.....sssssss.....', //
                '.....sssssss.....', //
                '.....sssssss.....', //
                '......sssss......', //
                '......sssss......', //
                '......sssss......', //
                '.......sss.......', //
                '.......sss.......', //
                '.......sss.......', //
                '........s........', //
                '........#........', //
                '.................', //
                '........@........', //
                '.................',
            ]); //

            testFov([
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                '.sssssssssssssss.', //
                '..sssssssssssss..', //
                '...sssssssssss...', //
                '....sssssssss....', //
                '.....sssssss.....', //
                '......sssss......', //
                '.......sss.......', //
                '........#........', //
                '........@........', //
                '.................',
            ]); //
        });

        test('one wall - horizontal', () => {
            testFov([
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                'ssss.............', //
                'sssssssss#.....@.', //
                'ssss.............', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................',
            ]); //

            testFov([
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                'ssssss...........', //
                'ssssssssss#....@.', //
                'ssssss...........', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................',
            ]); //

            testFov([
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                's................', //
                'ssssssss.........', //
                'sssssssssss#...@.', //
                'ssssssss.........', //
                's................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................',
            ]); //

            testFov([
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                'sssss............', //
                'ssssssssss.......', //
                'ssssssssssss#..@.', //
                'ssssssssss.......', //
                'sssss............', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................',
            ]); //

            testFov([
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                '.................', //
                'sss..............', //
                'ssssss...........', //
                'sssssssss........', //
                'ssssssssssss.....', //
                'sssssssssssss#.@.', //
                'ssssssssssss.....', //
                'sssssssss........', //
                'ssssss...........', //
                'sss..............', //
                '.................', //
                '.................', //
                '.................',
            ]); //

            testFov([
                'ssssss...........', //
                'sssssss..........', //
                'ssssssss.........', //
                'sssssssss........', //
                'ssssssssss.......', //
                'sssssssssss......', //
                'ssssssssssss.....', //
                'sssssssssssss....', //
                'ssssssssssssss...', //
                'ssssssssssssss#@.', //
                'ssssssssssssss...', //
                'sssssssssssss....', //
                'ssssssssssss.....', //
                'sssssssssss......', //
                'ssssssssss.......', //
                'sssssssss........', //
                'ssssssss.........',
            ]); //
        });

        test('door peek scenario', () => {
            testFov([
                'sssssssssssssssss', //  This is what I do not like:
                'sssssssssssssssss', //
                'sssssssssssssssss', // 'sssssssssssssssss'
                'sssssssssssssssss', // 'sssssssssssssssss'
                'sssssssssssssssss', // 'sssssssssssssssss'
                'sssssssssssssssss', // 'sssssssssssssssss'
                'sssssssssssssssss', // '.ssssssssssssssss'
                'sssssssssssssssss', // '..sssssssssssssss'
                'sssssssssssssssss', // '...ssssssssssssss'
                'sssssssssssssssss', // '....sssssssssssss'
                'sssssssssssssssss', // '.....ssssssssssss'
                'sssssssssssssssss', // '......sssssssssss'
                'sssssssssssssssss', // '.......ssssssssss'
                '....ssssssss#####', // '........ssss#####'
                '.........####....', // '.........####....'
                'sss..............', // '.................'
                'sssssssss#......@',
            ]); //'sssssssss#......@'

            testFov([
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                'sssssssssssssssss', //
                '#####ssssssss....', //
                '....####.........', //
                '..............sss', //
                '@......#sssssssss',
            ]); //
        });

        test('weird bleed through problem', () => {
            testFov([
                '++##################', // 0
                '++#.............@...',
                '++#.................',
                '++#.................',
                '++#.................',
                '++#.................', // 5
                '++#.................',
                '++#.................',
                '++#.................',
                '++#.................',
                '++#.................', // 10
                '++#.................',
                '++#.................',
                '++####..............', // 13
                '++++s..#...###......',
                '+++s..s.###++#......', // 15
                '+++..sss+++++##....#',
                '+++..s.s++++++#....#', // 17
                '++##s.s+++++++######',
                '++++++++ssssssssssss', // 19
                '++++ss++ssssssssssss',
                '++sssss+ssssssssssss', // 21
                '++sssss+ssssssssssss',
                '++s+ss++ssssssssssss', // 23
                '++++++++++++++++++++',
            ]);

            testFov([
                '++##################', // 0
                '++#.................',
                '++#.................',
                '++#.................',
                '++#.................',
                '++#.................', // 5
                '++#.................',
                '++#.................',
                '++#.................',
                '++#........@........',
                '++#.................', // 10
                '++#.................',
                '++#.................',
                '++####..............', // 13
                '++++s..#...###......',
                '+++s..s.###+++s.....', // 15
                '++#..sss+++++++....#',
                '++#.ss.s+++++++s...#', // 17
                '++#+s.s+++++++++####',
                '++++++++ssssssssssss', // 19
                '++++ss++ssssssssssss',
                '++sssss+ssssssssssss', // 21
                '++sssss+ssssssssssss',
                '++s+ss++ssssssssssss', // 23
                '++++++++++++++++++++',
            ]);
        });
    });
});
