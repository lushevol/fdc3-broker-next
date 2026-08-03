import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';
import * as fs from 'fs';

const elementFiles = fs.readdirSync('./elements');
const configs = elementFiles
  .filter(file => file !== 'index.ts')
  .map(file => ({
    input: `./elements/${file}`,
    output: {
      entryFileNames: '[name].js',
      chunkFileNames: '[hash].js',
      assetFileNames: '[hash][extname]',
      format: 'es',
      dir: 'dist/elements',
      sourcemap: true,
    },
    preserveEntrySignatures: true,
    plugins: [
      nodeResolve(),
      typescript({ compilerOptions: { outDir: './dist/elements' } }),
      image(),
      babel({
        plugins: [
          [
            'babel-plugin-template-html-minifier',
            {
              modules: {
                lit: ['html', { name: 'css', encapsulation: 'style' }],
              },
              failOnError: false,
              strictCSS: true,
              htmlMinifier: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
                caseSensitive: true,
                minifyCSS: true,
              },
            },
          ],
        ],
      }),
    ],
  }));

configs.push({
  input: './elements/index.ts',
  output: {
    entryFileNames: '[name].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'dist/elements',
    sourcemap: true,
  },
  preserveEntrySignatures: true,
  external: ['@scdevkit/webkit', '@scdevkit/icons'],
  plugins: [
    nodeResolve(),
    typescript({ compilerOptions: { outDir: './dist/elements' } }),
    image(),
    babel({
      plugins: [
        [
          'babel-plugin-template-html-minifier',
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    copy({
      targets: [{ src: 'src/assets', dest: 'dist' }],
    }),
  ],
});

export default configs;
