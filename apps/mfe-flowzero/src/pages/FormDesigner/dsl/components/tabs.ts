import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";

const defaultProps: ComponentProps = {
  style: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
};

export const tabsDSL: ComponentDSLDefinition = {
  type: ComponentType.TABS,
  displayName: "Tab",
  version: "1.0.0",
  category: "layout",
  description: "A tab set that owns a list of tab items as children.",
  defaultProps,
  props: [
    {
      name: "defaultTabId",
      label: "Default Tab",
      type: "string",
      description: "The default active tab item id.",
    },
    {
      name: "style",
      label: "Style",
      type: "style",
      description: "Inline style overrides for the tabs wrapper.",
      defaultValue: defaultProps.style,
    },
  ],
  children: {
    allow: [ComponentType.TAB_ITEM],
    min: 1,
    description: "Tabs can only contain tab_item components.",
  },
};
