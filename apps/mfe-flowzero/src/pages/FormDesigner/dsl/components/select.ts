import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "SingleSelect",
  placeholder: "Select Value",
  required: false,
  options: [{ label: "", value: "" }],
};

export const selectDSL: ComponentDSLDefinition = {
  type: ComponentType.SELECT,
  displayName: "SingleSelect",
  version: "1.0.0",
  category: "form-control",
  description: "Single select dropdown with label and options.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the select.",
      defaultValue: defaultProps.label,
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
      description: "Placeholder text displayed when no value is selected.",
      defaultValue: defaultProps.placeholder,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this field must be selected.",
      defaultValue: defaultProps.required,
    },
    {
      name: "options",
      label: "Options",
      type: "options",
      description: "List of selectable options with label/value.",
      defaultValue: defaultProps.options,
    },
  ],
};
