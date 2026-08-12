const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const port = process.env.port;
  const mode = process.env.mode;
  const orgName = process.env.orgName;
  const devtool =
    process.env.devtool.toLocaleLowerCase() === "false"
      ? false
      : process.env.devtool;
  const isLocal = process.env.isLocal.toLocaleLowerCase() === "true";
  const publicUrl = process.env.publicUrl || "";
  const importmap = process.env.importmap || "";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "root"),
    output: {
      filename: "config.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal,
          orgName,
          publicUrl,
          importmap,
        },
      }),
    ],
    devServer: {
      hot: true,
      port,
      proxy: [
        {
          context: [
            "/api/ratan/",
            "/api/bff/",
            "/api/log/",
            "/api/auth/",
            "/api/analytics/",
            "/base",
            "/ratan_container",
            "/ratan_cashflow",
            "/ratan_trades",
            "/ratan_exception",
            "/ratan_rules",
            "/template_container",
            "/template"
          ],
          target: "https://fmo-mfe-dev.uk.dev.net:8453",
          // target: "https://fmo-mfe-fmrp2.pi.dev.net:8453",
          // target: "https://uklvadapp1344.uk.dev.net:8453",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/au_th/"],
          pathRewrite: { "^/api/auth": "" },
          target: "http://localhost:8088",
          secure: false,
          changeOrigin: true,
          ws: true,
        },
        {
          context: ["/api/cdups/"],
          target: "https://cdups-gateway-service-cdups-fit.apps.cdups-np.ocp.dev.net/",
          secure: false,
          pathRewrite: { "^/api/cdups": "" },
          ws: false,
          changeOrigin: true,
        },
        {
          context: ["/api/ssdr/"],
          pathRewrite: { "^/api/ssdr": "" },
          target: "https://uklvadfmd000c.pi.dev.net:6600",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/ssiplus/"],
          pathRewrite: { "^/api": "" },
          target: "http://uklvadssi03.uk.standardchartered.com:8501",
          secure: false,
          changeOrigin: true,
        },
        {
          context:["/api/fss/payments/reference/v1/"],
          target: "https://10.198.25.24:9090",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/fss/payments/transaction/v1/"],
          target: "https://10.198.25.24:8082",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/fss/payments/mirrormapping/core/v1/"],
          target: "https://10.198.25.24:9089",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/fss/payments/rules/"],
          target: "https://10.198.25.24:9098",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/"],
          target: "https://10.198.25.23:9095",
          secure: false,
          changeOrigin: true,
        },
        {
          context: ["/api/leap/"],
          pathRewrite: { "^/api/leap": "" },
          target: "https://leap.standardchartered.com",
          secure: false,
          changeOrigin: true,
        }
      ],
      allowedHosts: "all",
      compress: false,
      static: {
        directory: path.join(__dirname, "dist"),
      },
    },
  });
};
