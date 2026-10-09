import type { Preview } from "@storybook/react";
import './global.css';
import MuiTheme from "./MuiTheme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const decorators = [MuiTheme];

export const globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      title: "Appearance",
      dynamicTitle: true,
      items: [
        { value: "light", left: "☀️", title: "Light mode" },
        { value: "dark", left: "🌙", title: "Dark mode" },
      ],
    },
  },
  designGeneration: {
    name: "Design generation",
    description: "Compare the copied portal's Legacy and WebKit controls",
    defaultValue: "webkit",
    toolbar: {
      icon: "contrast",
      title: "Design generation",
      dynamicTitle: true,
      items: [
        { value: "legacy", title: "Legacy" },
        { value: "webkit", title: "WebKit" },
      ],
    },
  },
};