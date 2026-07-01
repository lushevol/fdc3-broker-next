import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  content: "Submit",
  buttonType: "submit",
  style: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
  },
};

export const buttonDSL: ComponentDSLDefinition = {
  type: ComponentType.BUTTON,
  displayName: "Button",
  version: "1.0.0",
  category: "form-control",
  description:
    "Form button that can submit, reset, or act as a plain action trigger.",
  defaultProps,
  props: [
    {
      name: "content",
      label: "Label",
      type: "string",
      description: "Text shown inside the button.",
      defaultValue: defaultProps.content,
    },
    {
      name: "buttonType",
      label: "Button Type",
      type: "enum",
      description: "The native button type attribute.",
      defaultValue: defaultProps.buttonType,
      enumValues: [
        { label: "Submit", value: "submit" },
        { label: "Button", value: "button" },
        { label: "Reset", value: "reset" },
      ],
    },
    {
      name: "style",
      label: "Style",
      type: "style",
      description: "Inline style overrides for the button.",
      defaultValue: defaultProps.style,
    },
  ],
};
