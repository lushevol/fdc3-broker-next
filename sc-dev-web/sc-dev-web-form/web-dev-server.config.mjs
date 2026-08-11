// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import proxy from 'koa-proxies';
import { fileURLToPath } from 'url';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/sc-form/',
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
      // shorthand for loaders: { '.ts': 'ts' }
      ts: true,
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url))
    }),
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],


  middleware: [
    proxy('/app/sc-form', {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: path => path.replace('/app/sc-form', '')
    }),
    proxy('/graphql', {
      target: 'https://servicebench-sit.global.standardchartered.com/graphql',
      changeOrigin: true,
      secure: false,
    }),
    proxy('/sb-app/', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      headers: {
        Host: 'servicebench-sit.global.standardchartered.com',
      },
      changeOrigin: true,
      secure: false,
    }),
    proxy('/sb-widget/', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      headers: {
        Host: 'servicebench-sit.global.standardchartered.com',
      },
      changeOrigin: true,
      secure: false,
    }),
    proxy('/rest', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      headers: {
        Host: 'servicebench-sit.global.standardchartered.com',
      },
      changeOrigin: true,
      secure: false,
    }),
  ],

  // See documentation for all available options
  
});
