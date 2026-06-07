/**
 * Branded Type for NodeId
 */
export type NodeId = string & { readonly __brand: "NodeId" };

export const createNodeId = (id: string): NodeId => {
  if (!id || id.trim().length === 0) {
    throw new Error("NodeId cannot be empty.");
  }
  return id as NodeId;
};

export const isNodeId = (value: any): value is NodeId => {
  return typeof value === "string" && value.trim().length > 0;
};
