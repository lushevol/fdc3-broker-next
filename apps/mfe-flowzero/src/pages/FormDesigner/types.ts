import { CSSProperties } from "react";
import { FieldOption } from "src/api";
export enum ComponentType {
  // Layout
  CONTAINER = "container",
  TABS = "tabs",
  TAB_ITEM = "tab_item",
  TEXT = "text",
  TITLE = "title",

  // Form Controls
  INPUT = "input",
  INPUT_NUMBER = "input_number",
  DATE_PICKER = "date_picker",
  TIME_PICKER = "time_picker",
  TEXTAREA = "textarea",
  SELECT = "select",
  MULTI_SELECT = "multi_select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SWITCH = "switch",
  BUTTON = "button",
}

export interface ComponentProps {
  bindField?: string;
  fieldLocked?: boolean;
  indexedTerm?: string;
  label?: string;
  placeholder?: string;
  defaultTabId?: string;
  required?: boolean;
  defaultValue?: string | boolean;
  options?: { id?: string; label: string; value: string; default?: boolean }[]; // For select/checkbox/radio and other components that have options
  content?: string; // For text/title
  className?: string;
  style?: CSSProperties;
  buttonType?: "submit" | "button" | "reset";

  // Layout props
  columns?: number;
  gap?: number;

  // Field metadata
  dataType?: string;
}

export interface FormNode {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children: FormNode[];
}

export interface DragData {
  type: "sidebar-item" | "canvas-item" | "container-interior";
  componentType?: ComponentType;
  label?: string;
  id?: string;
  isContainer?: boolean;
  nodeType?: ComponentType;
  parentId?: string;
  fieldId?: string;
}

export interface ImportedField {
  id: string;
  indexedTerm: string;
  label: string;
  componentType: ComponentType;
  dataType: string;
  uiType: string;
  defaultValue?: string;
  metadata?: FieldOption[];
}
