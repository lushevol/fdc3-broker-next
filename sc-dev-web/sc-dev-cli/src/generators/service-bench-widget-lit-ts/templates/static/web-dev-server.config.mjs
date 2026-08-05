import { esbuildPlugin } from '@web/dev-server-esbuild';
import proxy from 'koa-proxies';
import { fileURLToPath } from 'url';
import rollupImage from '@rollup/plugin-image';
import { fromRollup } from '@web/dev-server-rollup';

const image = fromRollup(rollupImage);

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/<??= name ??>/',
  /** Use regular watch mode if HMR is not enabled. */
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  appIndex: 'service-bench-widgets.html',

  plugins: [
    esbuildPlugin({
      // shorthand for loaders: { '.ts': 'ts' }
      ts: true,
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url))
    }),
    image(),
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],


  middleware: [
    proxy('/app/<??= name ??>', {
      target: 'http://localhost:11001',
      changeOrigin: true,
      rewrite: path => path.replace('/app/<??= name ??>', '')
    }),
    proxy('/graphql', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
    }),
    proxy('/rest', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
    }), 
  ],

  // See documentation for all available options
  
});
