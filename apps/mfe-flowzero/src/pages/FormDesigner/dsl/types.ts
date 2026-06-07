import { ComponentProps, ComponentType, FormNode } from "../types";

export type DSLPrimitiveType =
  | "string"
  | "boolean"
  | "number"
  | "enum"
  | "options"
  | "style";

export interface ComponentPropDSL {
  name: keyof ComponentProps | string;
  label: string;
  type: DSLPrimitiveType;
  description?: string;
  defaultValue?: unknown;
  enumValues?: { label: string; value: string }[];
}

export interface ChildrenDSL {
  allow: ComponentType[];
  description?: string;
  min?: number;
  max?: number;
}

export interface ComponentDSLDefinition {
  type: ComponentType;
  displayName: string;
  version: string;
  category: "layout" | "form-control" | "display";
  description: string;
  defaultProps: ComponentProps;
  props: ComponentPropDSL[];
  children?: ChildrenDSL;
}

export interface FormDSLDocument {
  version: string;
  metadata?: {
    name?: string;
    description?: string;
  };
  nodes: FormNode[];
}

export interface FormDSLSpec {
  version: string;
  components: Record<ComponentType, ComponentDSLDefinition>;
}
