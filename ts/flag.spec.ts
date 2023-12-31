import * as GW from './index';

const Fl = GW.flag.fl;

describe('flag', () => {
    test('enum', () => {
        enum Flag {
            A = Fl(0),
            B = Fl(1),
            C = Fl(2),
            D = Fl(3),
            E = Fl(3), // same as D
            AB = A | B,
            BC = B | C,
            AD = A | D,
        }

        expect(Flag.A).toEqual(1);
        expect(Flag.B).toEqual(2);
        expect(Flag.C).toEqual(4);
        expect(Flag.D).toEqual(8);
        expect(Flag.AB).toEqual(3);
        expect(Flag.BC).toEqual(6);
        expect(Flag.AD).toEqual(9);

        expect(GW.flag.toString(Flag, 11)).toEqual('A | B | D | E');
        expect(GW.flag.from(Flag, 'A')).toEqual(Flag.A);
        expect(GW.flag.from(Flag, 'UNKNOWN')).toEqual(0);
        expect(GW.flag.from(Flag, 'A | B')).toEqual(Flag.AB);

        expect(GW.flag.from(Flag, '2 | A')).toEqual(Flag.AB);
        expect(GW.flag.from(Flag, Flag.D, '2 | A')).toEqual(
            Flag.D | Flag.A | Flag.B
        );
        expect(GW.flag.from(Flag, Flag.AB, '!A')).toEqual(Flag.B);
        expect(GW.flag.from(Flag, Flag.AB, '0, D')).toEqual(Flag.D);
        expect(GW.flag.from(Flag, undefined, '1', 2)).toEqual(3);
        expect(GW.flag.from(Flag, [1, '2'])).toEqual(3);
        expect(GW.flag.from(Flag, null, undefined)).toEqual(0);

        expect(GW.flag.from(Flag, 'C,3')).toEqual(7);
        expect(GW.flag.from(Flag, ['A|B', 4])).toEqual(7);

        expect(
            GW.flag.toString(Flag, Flag.A | Flag.B | Flag.C | Flag.D)
        ).toEqual('A | B | C | D | E');
    });

    test('make - obj', () => {
        const source = {
            A: 1,
            B: '2',
            C: 'A | B',
            D: 'C, 4',
            E: [1, 2],
            F: ['A', 'B'],
            G: ['A | B', 4],
        };

        const flag = GW.flag.make(source);
        expect(flag).toEqual({
            A: 1,
            B: 2,
            C: 3,
            D: 7,
            E: 3,
            F: 3,
            G: 7,
        });
    });

    test('make - array', () => {
        const source = ['A', 'B', 'C=A|B', 'D=4', 'E=1|2', 'F', 'G=A|B|4'];

        const flag = GW.flag.make(source);
        expect(flag).toEqual({
            A: 1,
            B: 2,
            C: 3,
            D: 4,
            E: 3,
            F: 8,
            G: 7,
        });
    });

    test('make - simple', () => {
        const flag = GW.flag.make('A,B,C,D,E,F,G,H,I');
        expect(flag).toEqual({
            A: 1,
            B: 2,
            C: 4,
            D: 8,
            E: 16,
            F: 32,
            G: 64,
            H: 128,
            I: 256,
        });

        expect(256 & flag.I).toBeTruthy();
        expect(256 & flag.H).toBeFalsy();
    });

    test('make - too big', () => {
        const flag = GW.flag.make(
            'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,BB,CC,DD,EE,FF'
        );
        expect(flag.A).toEqual(1);
        expect(flag.A).toEqual(2 ** 0);
        expect(flag.FF).toEqual(2 ** 31);
        expect(() => {
            GW.flag.make(
                'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,BB,CC,DD,EE,FF,GG'
            );
        }).toThrow();
    });
});
