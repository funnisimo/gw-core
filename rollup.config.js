// GW-UTILS: rollup.config.js

import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'js/index.js',
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
            },
            {
                file: 'dist/gw-utils.mjs',
                format: 'es',
                freeze: false,
            },
            {
                file: 'dist/gw-utils.js',
                format: 'umd',
                name: 'GW',
                freeze: false,
                extend: true,
            },
        ],
    },
    {
        input: './js/index.d.ts',
        output: [{ file: 'dist/gw-utils.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
