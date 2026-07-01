import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Checkbox",
  required: false,
  options: [{ label: "", value: "" }],
};

export const checkboxDSL: ComponentDSLDefinition = {
  type: ComponentType.CHECKBOX,
  displayName: "Checkbox",
  version: "1.0.0",
  category: "form-control",
  description: "Checkbox group with configurable choices.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label rendered next to the checkbox.",
      defaultValue: defaultProps.label,
    },
    {
      name: "options",
      label: "Options",
      type: "options",
      description: "Choices shown for checkbox and radio groups.",
      defaultValue: defaultProps.options,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether the checkbox must be checked.",
      defaultValue: defaultProps.required,
    },
  ],
};
