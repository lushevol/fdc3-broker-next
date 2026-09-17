import React from "react";
import type { Preview } from "@storybook/react-vite";
import { RatanDesignProvider } from "../src";
import "../assets/styles.css";

const preview: Preview = {
  globalTypes: {
    mode: { toolbar: { items: ["light", "dark"] } },
    designGeneration: { toolbar: { items: ["legacy", "webkit"] } },
  },
  initialGlobals: { mode: "light", designGeneration: "legacy" },
  decorators: [
    (Story, { globals }) => (
      <RatanDesignProvider
        mode={globals.mode}
        designGeneration={globals.designGeneration}
      >
        <Story />
      </RatanDesignProvider>
    ),
  ],
};
export default preview;
