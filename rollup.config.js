
// GW-AI: rollup.config.js

import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "./js/types/gw.d.ts",
    output: [{ file: "dist/gw-core.d.ts", format: "es" }],
    plugins: [dts()],
  },
{
  input: 'js/gw.js',
  output: {
    file: 'dist/gw-core.min.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    plugins: [terser()]
  }
},
{
  input: 'js/gw.js',
  output: {
    file: 'dist/gw-core.js',
    format: 'cjs',
    freeze: false,
  }
},

];