import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtins from '@mehmetb/rollup-plugin-node-builtins';
import inject from '@rollup/plugin-inject';
import path from 'path';
import copy from 'rollup-plugin-copy';
import linenumber from './scripts/linenumber.js';
import alias from '@rollup/plugin-alias';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: ['src/index.ts', 'elements/index.ts'],
  output: {
    preserveModules: true,
    format: 'es',
    dir: 'dist',
    sourcemap: process.env.NODE_ENV === 'production',
  },

  plugins: [
    builtins(),
    linenumber(),
    alias({
      entries: [
        { find: 'exceljs', replacement: 'exceljs/dist/exceljs.min.js' },
      ],
    }),
    nodeResolve({
      preferBuiltins: false,
    }),
    commonjs(),
    // useder to replace some global nodejs variable without import something
    inject({
      process: path.resolve('./runtimes/process.js'),
      global: path.resolve('./runtimes/global.js'),
      Buffer: ['buffer-es6', 'Buffer'],
    }),
    json(),
    typescript(),
    copy({
      targets: [
        {
          src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
          dest: 'dist',
          rename: 'pdf.worker.min.js',
        },
      ],
    }),
  ],
};
