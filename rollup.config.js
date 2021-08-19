// GW-UTILS: rollup.config.js

import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'js/index.js',
        external: ['rot-js'],
        plugins: [nodeResolve()],
        output: [
            {
                file: 'dist/gw-utils.min.js',
                format: 'umd',
                name: 'GW',
                freeze: false,
                extend: true,
                sourcemap: true,
                plugins: [terser()],
                globals: {
                    'rot-js': 'ROT',
                },
            },
            {
                file: 'dist/gw-utils.mjs',
                format: 'es',
                freeze: false,
                globals: {
                    'rot-js': 'ROT',
                },
            },
            {
                file: 'dist/gw-utils.js',
                format: 'umd',
                name: 'GW',
                freeze: false,
                extend: true,
                globals: {
                    'rot-js': 'ROT',
                },
            },
        ],
    },
    {
        input: './js/index.d.ts',
        output: [{ file: 'dist/gw-utils.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
