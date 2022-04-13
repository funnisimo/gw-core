// GW-UTILS: rollup.config.js

import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: 'ts/index.ts',
        plugins: [nodeResolve(), commonjs(), typescript()],
        output: [
            {
                file: 'dist/gw-utils.min.js',
                format: 'umd',
                name: 'GWU',
                // freeze: false,
                // extend: true,
                sourcemap: true,
                plugins: [terser()],
            },
            {
                file: 'dist/gw-utils.mjs',
                format: 'es',
                // freeze: false,
                sourcemap: true,
            },
            {
                file: 'dist/gw-utils.js',
                format: 'umd',
                name: 'GWU',
                // freeze: false,
                // extend: true,
                sourcemap: true,
            },
        ],
    },
    {
        input: 'ts/index.ts',
        output: [{ file: 'dist/gw-utils.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
