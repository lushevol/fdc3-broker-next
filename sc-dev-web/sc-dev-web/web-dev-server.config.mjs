import proxy from 'koa-proxies';

// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: process.env.CI || process.argv.includes('--no-open') ? false : '/demo/',
  /** Use regular watch mode if HMR is not enabled. */
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  // appIndex: 'demo/index.html',

  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],

  middleware: [
    (ctx, next) => {
      ctx.set('Content-Security-Policy', 'require-trusted-types-for \'script\';');
      return next();
    },
    proxy('/graphql', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
    }),
    proxy('/_data', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
    }),
  ],
  // See documentation for all available options
});
