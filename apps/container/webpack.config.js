const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const PackageJson = require("./package.json");

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
    projectName: "template_container",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "root"),
    devServer: {
      port,
      client: {
        overlay: false,
      },
    },
    output: {
      filename: "template_container.js",
      publicPath: `http://localhost:${port}/`,
      chunkFilename: "[chunkhash].[name].template_container.js",
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
      new MiniCssExtractPlugin({
        ignoreOrder: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
  });
};
