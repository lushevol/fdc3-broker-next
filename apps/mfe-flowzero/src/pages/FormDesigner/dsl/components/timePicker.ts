import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "DateTime Picker",
  placeholder: "Enter value",
  required: false,
};

export const timePickerDSL: ComponentDSLDefinition = {
  type: ComponentType.TIME_PICKER,
  displayName: "DateTime Picker",
  version: "1.0.0",
  category: "form-control",
  description: "Time picker field for selecting a time value.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the time picker.",
      defaultValue: defaultProps.label,
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
      description: "Hint text shown when no time is selected.",
      defaultValue: defaultProps.placeholder,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this time field must be filled.",
      defaultValue: defaultProps.required,
    },
  ],
};
