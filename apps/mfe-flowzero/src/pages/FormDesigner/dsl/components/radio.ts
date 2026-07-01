import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Radio",
  required: false,
  options: [{ label: "", value: "" }],
};

export const radioDSL: ComponentDSLDefinition = {
  type: ComponentType.RADIO,
  displayName: "Radio",
  version: "1.0.0",
  category: "form-control",
  description: "Radio group with configurable choices.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the radio group.",
      defaultValue: defaultProps.label,
    },
    {
      name: "options",
      label: "Options",
      type: "options",
      description: "Choices shown for the radio group.",
      defaultValue: defaultProps.options,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this radio field must be selected.",
      defaultValue: defaultProps.required,
    },
  ],
};
