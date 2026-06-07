import checkboxIcon from "../images/FormComponent/Checkbox.png";
import containerIcon from "../images/FormComponent/Container.png";
import datePickerIcon from "../images/FormComponent/DatePicker.png";
import dropdownIcon from "../images/FormComponent/Dropdown.png";
import inputBoxIcon from "../images/FormComponent/InputBox.png";
import inputNumberIcon from "../images/FormComponent/InputNumber.png";
import radioIcon from "../images/FormComponent/Radio.png";
import switchIcon from "../images/FormComponent/Switch.png";
import tabIcon from "../images/FormComponent/Tab.png";
import textIcon from "../images/FormComponent/Text.png";
import textAreaIcon from "../images/FormComponent/TextArea.png";
import timePickerIcon from "../images/FormComponent/TimePicker.png";
import titleIcon from "../images/FormComponent/Title.png";

export interface SidebarDragIconConfig {
  iconSrc: string;
  label: string;
}

/**
 * Maps the sidebar drag ID (with the "sidebar-" prefix stripped) to the
 * corresponding icon image and display label used in the DragOverlay.
 *
 * Keys are derived from the `dragId` prop passed to <SidebarItem>:
 *   dragId="sidebar-layout-container"  →  key "layout-container"
 */
export const SIDEBAR_DRAG_ICON_MAP: Record<string, SidebarDragIconConfig> = {
  "layout-container": { iconSrc: containerIcon, label: "Container" },
  "layout-text": { iconSrc: textIcon, label: "Text" },
  "layout-title": { iconSrc: titleIcon, label: "Title" },
  "layout-tabs": { iconSrc: tabIcon, label: "Tab" },
  "control-input-box": { iconSrc: inputBoxIcon, label: "Input Box" },
  "control-number-input": { iconSrc: inputNumberIcon, label: "Number Input" },
  "control-dropdown": { iconSrc: dropdownIcon, label: "Dropdown" },
  "control-switch": { iconSrc: switchIcon, label: "Switch" },
  "control-radio": { iconSrc: radioIcon, label: "Radio" },
  "control-checkbox": { iconSrc: checkboxIcon, label: "Checkbox" },
  "control-text-area": { iconSrc: textAreaIcon, label: "Text Area" },
  "control-date-picker": { iconSrc: datePickerIcon, label: "Date Picker" },
  "control-time-picker": { iconSrc: timePickerIcon, label: "DateTime Picker" },
};
