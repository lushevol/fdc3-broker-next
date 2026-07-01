import { ComponentProps, ComponentType } from "../../types";
import { ComponentDSLDefinition } from "../types";
import { ALL_COMPONENT_TYPES } from "./shared";

const defaultProps: ComponentProps = {
  // style: { padding: "0", borderRadius: "8px", minHeight: "100px" },
  columns: 1,
  gap: 16,
};

export const containerDSL: ComponentDSLDefinition = {
  type: ComponentType.CONTAINER,
  displayName: "Container",
  version: "1.0.0",
  category: "layout",
  description:
    "A generic layout wrapper that can host any other component in a grid.",
  defaultProps,
  props: [
    {
      name: "columns",
      label: "Grid Columns",
      type: "number",
      description: "How many grid columns to render inside the container.",
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
      description: "Inline style overrides for the container.",
      defaultValue: defaultProps.style,
    },
  ],
  children: {
    allow: ALL_COMPONENT_TYPES,
    description: "A container can nest any other component type.",
  },
};
