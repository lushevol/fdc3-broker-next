import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Switch",
  defaultValue: false,
  required: false,
};

export const switchDSL: ComponentDSLDefinition = {
  type: ComponentType.SWITCH,
  displayName: "Switch",
  version: "1.0.0",
  category: "form-control",
  description: "Switch control with configurable default value and validation.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the switch.",
      defaultValue: defaultProps.label,
    },
    {
      name: "defaultValue",
      label: "Default Value",
      type: "boolean",
      description: "Default checked state for the switch.",
      defaultValue: defaultProps.defaultValue,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this switch must be enabled.",
      defaultValue: defaultProps.required,
    },
  ],
};
