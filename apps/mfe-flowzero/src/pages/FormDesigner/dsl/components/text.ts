import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  content: "This is a text block. You can edit this content.",
  style: { color: "#64748b", fontSize: "14px" },
};

export const textDSL: ComponentDSLDefinition = {
  type: ComponentType.TEXT,
  displayName: "Text",
  version: "1.0.0",
  category: "display",
  description: "Simple text element for descriptive copy.",
  defaultProps,
  props: [
    {
      name: "content",
      label: "Text Content",
      type: "string",
      description: "Displayed paragraph text.",
      defaultValue: defaultProps.content,
    },
    {
      name: "style",
      label: "Style",
      type: "style",
      description: "Inline style overrides for the text node.",
      defaultValue: defaultProps.style,
    },
  ],
};
