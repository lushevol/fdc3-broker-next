import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  label: "Date Picker",
  placeholder: "Enter value",
  required: false,
};

export const datePickerDSL: ComponentDSLDefinition = {
  type: ComponentType.DATE_PICKER,
  displayName: "Date Picker",
  version: "1.0.0",
  category: "form-control",
  description: "Date picker field for selecting a calendar date.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "Label",
      type: "string",
      description: "Field label displayed above the date picker.",
      defaultValue: defaultProps.label,
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
      description: "Hint text shown when no date is selected.",
      defaultValue: defaultProps.placeholder,
    },
    {
      name: "required",
      label: "Required",
      type: "boolean",
      description: "Whether this date field must be filled.",
      defaultValue: defaultProps.required,
    },
  ],
};
