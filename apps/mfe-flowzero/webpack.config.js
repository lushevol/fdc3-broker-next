const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const VersionFile = require("webpack-version-file");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

const disableTypeScriptDiagnostics = (config) => ({
  ...config,
  plugins: config.plugins?.filter(
    (plugin) => plugin?.constructor?.name !== "ForkTsCheckerWebpackPlugin"
  ),
});

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
    projectName: "flowzero",
    webpackConfigEnv,
    argv,
  });

  return disableTypeScriptDiagnostics(
    merge(defaultConfig, {
      mode,
      devtool,
      entry: path.resolve(__dirname, "src", "root"),
      module: {
        rules: [
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ["postcss-loader"],
          },
        ],
      },
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
        client: {
          overlay: false,
        },
      },
      output: {
        filename: "flowzero.js",
        publicPath: `http://localhost:${port}/`,
        chunkFilename: "[chunkhash].[name].flowzero.js",
      },
      plugins: [
        new Dotenv({
          path: "./.env.mfe",
          safe: false,
        }),
        new webpack.NormalModuleReplacementPlugin(
          /\.(png|svg)$/,
          path.resolve(__dirname, "src", "blank-asset.js")
        ),
        new VersionFile({
          output: "./dist/version.json",
          templateString: '{\n\t"version":"<%= version %>"\n}',
          data: {
            date: new Date(),
          },
          verbose: true,
        }),
      ],
    })
  );
};
