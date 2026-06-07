import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Input Box",
  placeholder: "Enter text",
  required: false,
};

export const inputDSL: ComponentDSLDefinition = {
  type: ComponentType.INPUT,
  displayName: "Input Box",
  version: "1.0.0",
  category: "form-control",
  description: "Single line text input.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the input.",
      defaultValue: defaultProps.label,
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
      description: "Hint text shown when the input is empty.",
      defaultValue: defaultProps.placeholder,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this input must be filled.",
      defaultValue: defaultProps.required,
    },
  ],
};
