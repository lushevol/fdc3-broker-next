import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Number Input",
  placeholder: "Enter Value",
  required: false,
};

export const inputNumberDSL: ComponentDSLDefinition = {
  type: ComponentType.INPUT_NUMBER,
  displayName: "Number Input",
  version: "1.0.0",
  category: "form-control",
  description: "Numeric input field.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the number input.",
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
