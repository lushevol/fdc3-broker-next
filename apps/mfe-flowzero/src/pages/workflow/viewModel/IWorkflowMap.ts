import type { AbstractWorkflowNode } from "../model/entities/reactflowElement/AbstractWorkflowNode";
import type { Edge } from "../model/entities/reactflowElement/Edge";

export interface IWorkflowMap {
  nodes: AbstractWorkflowNode<any>[];
  edges: Edge<any>[];
}
