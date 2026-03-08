const { dependencies } = require("./package.json");

module.exports = {
  name: "baseContainer",
  remotes: {
    mf_container: "mf_container@http://localhost:3000/mf-manifest.json",
    mf_tile: "mf_tile@http://localhost:3001/mf-manifest.json",
  },
  exposes: {
    "./ChatbotSidebar": "./src/components/ChatbotSidebar",
    "./ChatbotProvider": "./src/components/ChatbotSidebar/common/ChatbotProvider",
    "./GenerativeUI": "./src/components/ChatbotSidebar/common/GenerativeUI",
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
    "@assistant-ui/react": {
      singleton: true,
      requiredVersion: dependencies["@assistant-ui/react"],
    },
    "@assistant-ui/react-ai-sdk": {
      singleton: true,
      requiredVersion: dependencies["@assistant-ui/react-ai-sdk"],
    },
    "ai": {
      singleton: true,
      requiredVersion: dependencies["ai"],
    },
    "zod": {
      singleton: true,
      requiredVersion: dependencies["zod"],
    },
  },
};
