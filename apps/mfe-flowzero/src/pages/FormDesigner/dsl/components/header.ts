import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  content: "Form Title",
  style: { fontSize: "24px", fontWeight: "bold", color: "#1e293b" },
};

export const headerDSL: ComponentDSLDefinition = {
  type: ComponentType.TITLE,
  displayName: "Title",
  version: "1.0.0",
  category: "display",
  description: "Title text.",
  defaultProps,
  props: [
    {
      name: "content",
      label: "Title Text",
      type: "string",
      description: "Displayed title string.",
      defaultValue: defaultProps.content,
    },
    {
      name: "style",
      label: "Style",
      type: "style",
      description: "Inline style overrides for the title.",
      defaultValue: defaultProps.style,
    },
  ],
};
