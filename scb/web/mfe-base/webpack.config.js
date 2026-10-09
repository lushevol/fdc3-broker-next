const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const path = require('node:path');
const Dotenv = require('dotenv-webpack');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (webpackConfigEnv = {}, argv = {}) => {
  const port = process.env.port ?? '8002';
  const mode = argv.mode ?? process.env.mode ?? 'development';
  const orgName = process.env.orgName ?? 'fm';
  const cduplatform = process.env.cduplatform;
  const devtoolSetting = process.env.devtool ?? 'source-map';
  const devtool = devtoolSetting.toLowerCase() === 'false' ? false : devtoolSetting;
  const defaultConfig = singleSpaDefaults({ orgName, projectName: 'base', webpackConfigEnv, argv });

  return merge(defaultConfig, {
    mode,
    devtool,
    entry: path.resolve(__dirname, 'src/root'),
    module: { rules: [{
      test: /\.m?js$/,
      include: /node_modules[\\/]ratan-design-origin[\\/]/,
      resolve: { fullySpecified: false },
    }] },
    devServer: { port: Number(port) },
    output: {
      path: path.resolve(__dirname, webpackConfigEnv.artifactDirectory ?? 'dist'),
      filename: 'base.js',
      publicPath: 'auto',
      chunkFilename: '[chunkhash].[name].base.js',
    },
    plugins: [
      new Dotenv({ path: './.env.mfe', safe: false }),
      new ModuleFederationPlugin({
        name: 'baseContainer',
        remotes: cduplatform ? { cduplatform } : {},
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
      }),
    ],
  });
};
