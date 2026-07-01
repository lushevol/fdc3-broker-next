import { ComponentType, FormNode } from "../types";
import { componentDSLs } from "./components";
import { FormDSLDocument, FormDSLSpec } from "./types";

export const FORM_DSL_VERSION = "1.0.0";

export const formDSLSpec: FormDSLSpec = {
  version: FORM_DSL_VERSION,
  components: componentDSLs,
};

export const createFormDocument = (
  nodes: FormNode[],
  metadata?: FormDSLDocument["metadata"]
): FormDSLDocument => ({
  version: FORM_DSL_VERSION,
  metadata,
  nodes,
});

export const validateFormDocument = (doc: FormDSLDocument): string[] => {
  const errors: string[] = [];

  const walk = (node: FormNode, parentType?: ComponentType) => {
    const dsl = componentDSLs[node.type];

    if (!dsl) {
      errors.push(`Unknown component type "${node.type}" at node ${node.id}`);
      return;
    }

    if (!dsl.children && node.children.length > 0) {
      errors.push(
        `Component "${node.id}" of type ${node.type} should not have children`
      );
    }

    if (dsl.children) {
      node.children.forEach((child) => {
        if (!dsl.children?.allow.includes(child.type)) {
          errors.push(
            `Child type ${child.type} is not allowed inside ${node.type} (parent node ${node.id})`
          );
        }
      });
    }

    node.children.forEach((child) => walk(child, node.type));
  };

  doc.nodes.forEach((node) => walk(node));

  return errors;
};
