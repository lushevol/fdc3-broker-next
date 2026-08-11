import proxy from 'koa-proxies';

// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

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
    (ctx, next) => {
      ctx.set('Content-Security-Policy', 'require-trusted-types-for \'script\';');
      return next();
    },
    proxy('/graphql', {
      // target: 'https://jumbo-sit-graphql.servicebench.global.standardchartered.com/v1',
      target: 'https://graphql-servicebench-sit-stg.55313.app.standardchartered.com/v1',
      changeOrigin: true,
      secure: false,
    }),
    proxy('/storage-api/', {
      target: 'https://servicebench-storage-sit-stg.55313.app.standardchartered.com',
      changeOrigin: true,
      secure: false,
      rewrite: path => path.replace('/storage-api/v1/', '/api/'),
      // events: {
      //   proxyReq: (proxyReq, req, res) => {
      //     // Ensure the 'Accept' header is set correctly for SSE
      //     proxyReq.setHeader('Accept', 'text/event-stream');
      //   },
      //   proxyRes: (proxyRes, req, res) => {
      //     // Ensure the 'Content-Type' is 'text/event-stream' and streaming is handled
      //     if (proxyRes.headers['content-type'] === 'text/event-stream') {
      //       res.writeHead(proxyRes.statusCode, proxyRes.headers);
      //       proxyRes.pipe(res); // Stream the response directly
      //     }
      //   }
      // }      
    }),
    proxy('/rest', {
      target: 'https://servicebench-dev-stg.55313.app.standardchartered.com',
      changeOrigin: true,
      secure: false,
      logs: true,
      headers: {
        Authorization: 'Bearer '
      }
    }), 
    proxy('/_data', {
      target: 'https://servicebench-sit.global.standardchartered.com',
      changeOrigin: true,
      secure: false,
    }),
  ],
  // See documentation for all available options
});
