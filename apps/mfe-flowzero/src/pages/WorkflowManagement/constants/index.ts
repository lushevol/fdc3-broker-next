import { FilterConfigItem } from "src/components/AdvancedFilterModal";

export const GRID_NAME = `workflow-management-data-grid`;

export const FLAG_MAP: Record<string, string> = {
  China: require("src/images/flag/China.svg"),
  "United Kingdom": require("src/images/flag/UK.svg"),
  Singapore: require("src/images/flag/Singapore.svg"),
  "United States": require("src/images/flag/United States.svg"),
  Thailand: require("src/images/flag/Thailand.svg"),
};

export const BASE_FILTER_CONFIG: Omit<FilterConfigItem, "options">[] = [
  {
    label: "Owner",
    value: "ownerIds",
    icon: "icon-user-person-profile",
    backgroundColor: "#faad14",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Country",
    value: "countryCodes",
    icon: "icon-flag",
    backgroundColor: "#52C41A",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
  },
  {
    label: "Business Area",
    value: "businessArea",
    icon: "icon-briefcase",
    backgroundColor: "#4A90D9",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
  },
];

export const POPOVER_MIN_HEIGHT = 234;
export const POPOVER_BOTTOM_OFFSET = 64;
export const BUTTON_POPOVER_GAP = 6;
