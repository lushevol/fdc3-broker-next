const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const VersionFile = require('webpack-version-file');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const Dotenv = require("dotenv-webpack");
const PackageJson = require("./package.json");
const webpack = require("webpack");

module.exports = (webpackConfigEnv, argv) => {
  const port = process.env.port;
  const mode = process.env.mode;
  const orgName = process.env.orgName;
  const devtool =
    process.env.devtool.toLocaleLowerCase() === "false"
      ? false
      : process.env.devtool;
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "ratan_cashflow_blotter",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "root"),
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
        Import: path.resolve(__dirname, "src/Root/import"),
        "@Test": path.resolve(__dirname, "src/test"),
      },
      fallback: {
        net: false,
      },
    },
    devServer: {
      port,
    },
    output: {
      filename: "ratan_cashflow_blotter.js",
      publicPath: `http://localhost:${port}/`,
      chunkFilename: "[chunkhash].[name].ratan_cashflow_blotter.js",
    },
    plugins: [
      new Dotenv({
        path: "./.env.mfe", // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: () => `version: ${PackageJson.version}`,
      }),
      new VersionFile({
        output: "./dist/version.json",
        templateString: "{\n\t\"version\":\"<%= version %>\"\n}",
        data: {
          date: new Date(),
        },
        verbose: true,
      }),
      // new BundleAnalyzerPlugin({
      //   analyzerMode: "static",
      // }),
    ],
  });
};
