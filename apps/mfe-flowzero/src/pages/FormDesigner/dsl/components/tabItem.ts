import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";
import { ALL_COMPONENT_TYPES } from "./shared";

const defaultProps: ComponentProps = {
  label: "Untitled Tab",
  // style: { padding: "20px", minHeight: "100px" },
  columns: 1,
  gap: 16,
};

export const tabItemDSL: ComponentDSLDefinition = {
  type: ComponentType.TAB_ITEM,
  displayName: "Tab Item",
  version: "1.0.0",
  category: "layout",
  description: "Content pane for a Tabs component.",
  defaultProps,
  props: [
    {
      name: "label",
      label: "View Label",
      type: "string",
      description: "Displayed text for the view trigger.",
      defaultValue: defaultProps.label,
    },
    {
      name: "columns",
      label: "Grid Columns",
      type: "number",
      description: "How many grid columns to render inside the tab content.",
      defaultValue: defaultProps.columns,
    },
    {
      name: "gap",
      label: "Grid Gap",
      type: "number",
      description: "Spacing between grid items in pixels.",
      defaultValue: defaultProps.gap,
    },
    {
      name: "style",
      label: "Style",
      type: "style",
      description: "Inline style overrides for the tab content area.",
      defaultValue: defaultProps.style,
    },
  ],
  children: {
    allow: ALL_COMPONENT_TYPES,
    description: "Tab items can host any other component.",
  },
};
