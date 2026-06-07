// Data type color mapping for field creation UI
export interface DataTypeColorMap {
  label?: string;
  icon?: string;
  color: string;
  bg: string;
  hoverColor: string;
  hoverBg: string;
  selectedColor: string;
  selectedBg: string;
  darkColor?: string;
  darkBg?: string;
}

const DATA_TYPE_COLOR = {
  STRING: {
    icon: "icon-format-italic",
    color: "#0250A3",
    bg: "#CCE3FA",
    hoverColor: "#0250A3",
    hoverBg: "#F2F2F2",
    selectedColor: "#FFFFFF",
    selectedBg: "#0473EA",
    darkColor: "",
    darkBg: "",
  },
  NUMBER: {
    icon: "icon-social-hashtag",
    color: "#96680C",
    bg: "#FEEFD0",
    hoverColor: "#E19C12",
    hoverBg: "#FEF6E7",
    selectedColor: "#322304",
    selectedBg: "#FCC65B",
    darkColor: "",
    darkBg: "",
  },
  DATE: {
    icon: "icon-calendar",
    color: "#207E00",
    bg: "#D7F7CD",
    hoverColor: "#32BD00",
    hoverBg: "#EBFBE6",
    selectedColor: "#FFFFFF",
    selectedBg: "#207E00",
    darkColor: "",
    darkBg: "",
  },
  DATETIME: {
    label: "DateTime",
    icon: "icon-clock-pending",
    color: "#4141AA",
    bg: "#DADAF2",
    hoverColor: "#4848BD",
    hoverBg: "#EDEDF8",
    selectedColor: "#FFFFFF",
    selectedBg: "#4141AA",
    darkColor: "",
    darkBg: "",
  },
  BOOLEAN: {
    icon: "icon-Icon-switch-on",
    color: "#5A631C",
    bg: "#F0F3D7",
    hoverColor: "#5A631C",
    hoverBg: "#F7F9EB",
    selectedColor: "#FFFFFF",
    selectedBg: "#5A631C",
    darkColor: "",
    darkBg: "",
  },
  ARRAY: {
    icon: "icon-check-tick-circle",
    color: "#7D330D",
    bg: "#FFEFE6",
    hoverColor: "",
    hoverBg: "",
    selectedColor: "#FFFFFF",
    selectedBg: "#B9511B",
    darkColor: "#FFBE9C",
    darkBg: "#321405",
  },
};
export type FieldTypes =
  | "INPUT"
  | "TEXT_AREA"
  | "RADIO"
  | "CHECKBOX"
  | "SINGLE_CHOICE_DROPDOWN"
  | "MULTIPLE_CHOICE_DROPDOWN"
  | "SWITCH"
  | "INPUT_NUMBER"
  | "DATE_PICKER"
  | "TIME_PICKER"
  | "IMAGE"
  | "FILE_UPLOAD";
const FIELD_TYPE_MAPPING: Record<FieldTypes, { label: string; icon: string }> =
  {
    INPUT: { label: "InputBox", icon: "icon-format-italic" },
    TEXT_AREA: { label: "TextArea", icon: "icon-text" },
    RADIO: { label: "Radio", icon: "icon-field-radio" },
    CHECKBOX: { label: "Checkbox", icon: "icon-field-check-tick-box" },
    SINGLE_CHOICE_DROPDOWN: {
      label: "SingleSelect",
      icon: "icon-field-dropdown",
    },
    MULTIPLE_CHOICE_DROPDOWN: {
      label: "MultiSelect",
      icon: "icon-field-dropdown",
    },
    SWITCH: { label: "Switch", icon: "icon-Icon-switch-on" },
    INPUT_NUMBER: { label: "InputNumber", icon: "icon-social-hashtag" },
    DATE_PICKER: { label: "DatePicker", icon: "icon-calendar" },
    TIME_PICKER: { label: "TimePicker", icon: "icon-timer-clock" },
    IMAGE: { label: "IMAGE", icon: "icon-field-image-picture" },
    FILE_UPLOAD: { label: "FileUpload", icon: "icon-field-document-page" },
  } as const;

// this is defined by backend.
export type FieldDataType = keyof typeof DATA_TYPE_COLOR;

const isFieldDataType = (value: string): value is FieldDataType => {
  return Object.keys(DATA_TYPE_COLOR).includes(value);
};

const FIELD_DATATYPE_MAP: Record<FieldDataType, string> = {
  STRING: "String",
  BOOLEAN: "Boolean",
  NUMBER: "Number",
  DATE: "Date",
  DATETIME: "DateTime",
  ARRAY: "Array",
  // IMAGE: "Image",
  // FILE: "File",
};

export {
  DATA_TYPE_COLOR,
  FIELD_DATATYPE_MAP,
  FIELD_TYPE_MAPPING,
  isFieldDataType,
};
