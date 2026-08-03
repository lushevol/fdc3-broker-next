// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fileURLToPath } from 'url';
import proxy from 'koa-proxies';
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
  appIndex: 'service-bench.html',

  plugins: [
    esbuildPlugin({
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
    (context, next) => {
      if (context.url.startsWith('/_data/profile/pics')) {
        context.status = 404;
      } else {
        return next();
      }
    },
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
