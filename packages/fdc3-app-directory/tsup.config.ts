import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    mock: 'src/mock.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['react', 'react-dom', '@finos/fdc3'],
  splitting: false,
  minify: process.env.NODE_ENV === 'production',
});
