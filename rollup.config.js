
// GW-UTILS: rollup.config.js

import { terser } from "rollup-plugin-terser";

export default [
{
  input: 'js/gw.js',
  output: [{
    file: 'dist/gw-utils.min.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    plugins: [terser()]
  },
  {
    file: 'dist/gw-utils.mjs',
    format: 'es',
    freeze: false,
  },
  {
    file: 'dist/gw-utils.cjs',
    format: 'cjs',
    freeze: false,
  }
  ]
}
];
