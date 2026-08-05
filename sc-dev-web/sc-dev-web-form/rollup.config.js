import { createBasicConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';
import merge from 'deepmerge';
import * as fs from 'fs';

const baseConfig = createBasicConfig({
  developmentMode: true,
  dir: './'
});

const elementFiles = fs.readdirSync('./elements');
const configs = elementFiles
  .filter(file => file !== 'index.js')
  .map(file => merge(baseConfig, { 
    input: `./elements/${file}`,
    output: {
      dir: './dist/elements',
    },
    plugins: [
      typescript({compilerOptions: { outDir: './dist/elements' }}),
    ]
  }));
configs.push(merge(baseConfig, { 
  input: './elements/index.js',
  output: {
    dir: './dist/elements',
  },
  plugins: [
    typescript({compilerOptions: { outDir: './dist/elements' }}),
  ],
}));

export default configs;
