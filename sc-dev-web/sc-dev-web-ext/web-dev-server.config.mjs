import proxy from 'koa-proxies';

// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

const accessToken = '';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/demo/',
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
    proxy('/graphql', {
      target:
        'https://graphql-servicebench-sit-stg.55313.app.standardchartered.com/v1',
      changeOrigin: true,
      secure: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      logs: true,
    }),
    proxy('/ag-ui', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
      logs: true,
      events: {
        proxyReq: req => {
          const requestPath = req.path || req.url || '';
          if (requestPath.includes('/cancel')) {
            req.setHeader('Accept', 'application/json');
            return;
          }
          req.setHeader('Accept', 'text/event-stream');
        },
      },
    }),
    proxy('/sse', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
      logs: true,
      events: {
        proxyReq: req => {
          req.setHeader('Accept', 'text/event-stream');
        },
      },
    }),
    proxy('/storage-api/', {
      target:
        'https://servicebench-storage-sit-stg.55313.app.standardchartered.com',
      changeOrigin: true,
      secure: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      rewrite: path => path.replace('/storage-api/v1/', '/api/'),
    }),
    proxy('/rest', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    proxy('/_data', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ],
  // See documentation for all available options
});
