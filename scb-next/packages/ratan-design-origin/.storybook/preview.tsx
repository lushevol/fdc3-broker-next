import React from "react";
import type { Preview } from "@storybook/react-vite";
import { RatanDesignProvider } from "../src";
import "../assets/styles.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "error",
    },
  },
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
        <div style={{ minHeight: "100vh" }}>
          <Story />
        </div>
      </RatanDesignProvider>
    ),
  ],
};
export default preview;
