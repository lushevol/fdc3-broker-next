import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Text Area",
  placeholder: "Enter long text",
  required: false,
};

export const textareaDSL: ComponentDSLDefinition = {
  type: ComponentType.TEXTAREA,
  displayName: "Text Area",
  version: "1.0.0",
  category: "form-control",
  description: "Multi-line text input.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the textarea.",
      defaultValue: defaultProps.label,
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
      description: "Hint text shown when the textarea is empty.",
      defaultValue: defaultProps.placeholder,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this textarea must be filled.",
      defaultValue: defaultProps.required,
    },
  ],
};
