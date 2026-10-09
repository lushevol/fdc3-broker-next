const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = async (_env = {}, argv = {}) => {
  const production = argv.mode === 'production';
  const { installMockApi } = await import('./dev/mock-api.mjs');
  return {
  mode: production ? 'production' : 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/new-styles/dev-host.tsx'),
  output: { filename: 'dev-host.js', path: path.resolve(__dirname, production ? 'dist-host-production' : 'dist-host'),
    publicPath: production ? '/production-proof/' : '/' },
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },
  module: { rules: [
    { test: /\.m?js$/, include: /node_modules[\\/]ratan-design-origin[\\/]/, resolve: { fullySpecified: false } },
    { test: /\.[jt]sx?$/, exclude: /node_modules/, use: 'babel-loader' },
    { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    { test: /\.(png|svg|woff2?)$/, type: 'asset/resource' },
  ] },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src/new-styles/dev-host.html') })],
  devServer: { host: '127.0.0.1', port: Number(process.env.PORTAL_PORT ?? '8181'), historyApiFallback: true,
    static: [
      { directory: path.resolve(__dirname, process.env.PORTAL_ARTIFACT_DIR ?? 'dist-development'), publicPath: '/base' },
      { directory: path.resolve(__dirname, 'dist'), publicPath: '/base-production' },
      { directory: path.resolve(__dirname, 'dist-host-production'), publicPath: '/production-proof' },
    ],
    setupMiddlewares(middlewares, devServer) {
      installMockApi(devServer.app);
      return middlewares;
    },
    headers: { 'Cache-Control': 'no-store' } },
  };
};
