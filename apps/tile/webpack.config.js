const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
const Dotenv = require("dotenv-webpack");

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
    projectName: "template",
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
    },
    output: {
      filename: "template.js",
      publicPath: `http://localhost:${port}/`,
      chunkFilename: "[chunkhash].[name].template.js",
    },
    plugins: [
      new Dotenv({
        path: "./.env.mfe", // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
    ],
  });
};
