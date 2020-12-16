
// GW-AI: rollup.config.js

import { terser } from "rollup-plugin-terser";

export default [
{
  input: 'js/gw.js',
  output: [{
    file: 'dist/gw-core.min.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    plugins: [terser()]
  },
  {
    file: 'dist/gw-core.mjs',
    format: 'es',
    freeze: false,
  },
  {
    file: 'dist/gw-core.cjs',
    format: 'cjs',
    freeze: false,
  }
  ]
}
];