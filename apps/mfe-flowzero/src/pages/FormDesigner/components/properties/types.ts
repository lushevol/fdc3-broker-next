import type { CSSProperties } from "react";

import { ComponentProps, ComponentType, FormNode } from "../../types";

export type UpdateNodeFn = (
  id: string,
  updates: Partial<FormNode> | Partial<ComponentProps>
) => void;

export type AddNodeFn = (
  type: ComponentType,
  parentId: string | null,
  index?: number
) => void;

export type RemoveNodeFn = (id: string) => void;

export type PropChangeFn = (
  key: keyof ComponentProps,
  value: ComponentProps[keyof ComponentProps]
) => void;

export type StyleChangeFn = (
  key: keyof CSSProperties,
  value: CSSProperties[keyof CSSProperties]
) => void;

export interface SectionProps {
  selectedNode: FormNode;
  onPropChange: PropChangeFn;
  onStyleChange: StyleChangeFn;
}
