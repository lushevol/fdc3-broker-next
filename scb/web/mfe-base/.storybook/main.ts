import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
const toPath = (filePath: string) => path.join(process.cwd(), filePath);
const config: StorybookConfig = {
  stories: [
    "../stories/Overview.stories.mdx", 
    "../stories/GettingStarted.stories.mdx", 
    "../stories/Theme.stories.mdx", 
    "../stories/Styling.stories.mdx", 
    "../stories/**/*.stories.@(js|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-styling",
    "@storybook/addon-a11y",
    "@storybook/addon-storysource",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  webpackFinal: async config => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...(config.module?.rules ?? []),
          { test: /\.m?js$/, include: /node_modules[\\/]ratan-design-origin[\\/]/, resolve: { fullySpecified: false } },
        ],
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config?.resolve?.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "emotion-theming": toPath("node_modules/@emotion/react"),
        }
      }
    };
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      allowSyntheticDefaultImports: false,
      esModuleInterop: false,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent
          ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName)
          : true,
    },
  },
};
export default config;
