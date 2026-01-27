const { dependencies } = require("./package.json");

module.exports = {
  name: "baseContainer",
  remotes: {
    mf_container: "mf_container@http://localhost:3000/mf-manifest.json",
    mf_tile: "mf_tile@http://localhost:3002/mf-manifest.json",
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
    },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["react-dom"],
    },
  },
};
