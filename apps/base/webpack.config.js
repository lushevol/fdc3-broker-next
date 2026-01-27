const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
const Dotenv = require("dotenv-webpack");
// const { ModuleFederationPlugin } = require("webpack").container;
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");
const mfConfigs = require("./module-federation.config");

module.exports = (webpackConfigEnv, argv) => {
  const port = process.env.port;
  const mode = process.env.mode;
  const orgName = process.env.orgName;
  const cduplatform = process.env.cduplatform;
  const devtool =
    process.env.devtool?.toLocaleLowerCase() === "false"
      ? false
      : process.env.devtool;
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "base",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "root"),
    devServer: {
      port,
    },
    output: {
      filename: "base.js",
      publicPath: `http://localhost:${port}/`,
      chunkFilename: "[chunkhash].[name].base.js",
    },
    plugins: [
      new Dotenv({
        path: "./.env.mfe", // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
      // new ModuleFederationPlugin({
      //   name: "baseContainer",
      //   remotes: {
      //     cduplatform,
      //   },
      //   shared: {
      //     react: { singleton: true },
      //     "react-dom": { singleton: true },
      //   },
      // }),
      new ModuleFederationPlugin(mfConfigs),
    ],
  });
};
