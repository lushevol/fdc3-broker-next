import { FormNode } from "../../types";

export const COLOR_OPTIONS = [
  "#1e293b",
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#ffffff",
] as const;

export const FONT_SIZE_OPTIONS = [
  { label: "Small", value: "12px" },
  { label: "Normal", value: "14px" },
  { label: "Medium", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "Extra Large", value: "24px" },
  { label: "Huge", value: "32px" },
];

export const findNodeById = (
  nodes: FormNode[],
  id: string
): FormNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

export const getPxNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseInt(value.replace("px", ""), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};
