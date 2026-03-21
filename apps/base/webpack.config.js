const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
const Dotenv = require("dotenv-webpack");
// const {
//   ModuleFederationPlugin,
// } = require("@module-federation/enhanced/webpack");
// const mfConfigs = require("./module-federation.config");

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
  const isStandalone = Boolean(webpackConfigEnv && webpackConfigEnv.standalone);

  defaultConfig.module.rules = defaultConfig.module.rules.map((rule) => {
    if (String(rule.test) === "/\\.css$/i" || String(rule.test) === "/\\.module\\.css$/i") {
      return {
        ...rule,
        use: [
          ...rule.use,
          {
            loader: require.resolve("postcss-loader"),
          },
        ],
      };
    }

    return rule;
  });

  return merge(defaultConfig, {
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "root"),
    resolve: {
      ...defaultConfig.resolve,
      alias: {
        ...(defaultConfig.resolve?.alias || {}),
        "@": path.resolve(__dirname, "src", "next-packages"),
      },
    },
    devServer: {
      port,
      // headers: {
      //   // Cache static assets for better performance
      //   'Cache-Control': 'public, max-age=31536000, immutable',
      // },
    },
    output: {
      filename: "base.js",
      publicPath: isStandalone ? "" : `http://localhost:${port}/`,
      chunkFilename: "[chunkhash].[name].base.js",
    },
    // optimization: {
    //   runtimeChunk: false,
    //   splitChunks: {
    //     cacheGroups: {
    //       defaultVendors: false,
    //       default: false,
    //     },
    //   },
    // },
    plugins: [
      new Dotenv({
        path: "./.env.mfe", // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
      // new ModuleFederationPlugin(mfConfigs),
    ],
  });
};
