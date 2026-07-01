import { WorkflowNodeType } from "../../types";
import {
  AbstractWorkflowNode,
  EndEvent,
  ExclusiveGateway,
  InclusiveGateway,
  ParallelGateway,
  StartEvent,
  UserTask,
} from "../entities/reactflowElement";

export class WorkflowNodeFactory {
  static createFromReactFlowNode(node: any): AbstractWorkflowNode<any> | null {
    const { id, type, position, data } = node;
    const baseProps = {
      id,
      label: data?.label || id,
      subLabel: data?.subLabel || "",
      type: type as WorkflowNodeType,
      x: position?.x || 0,
      y: position?.y || 0,
      icon: data?.icon || "",
      source: "",
      target: "",
      handlesMeta: data?.handlesMeta || [],
      fieldDefs: data?.fieldDefs || [],
      properties: data?.properties || data || {},
    };

    // Map node type to appropriate entity class
    switch (type) {
      case WorkflowNodeType.START_EVENT:
        return new StartEvent(baseProps);
      case WorkflowNodeType.END_EVENT:
        return new EndEvent(baseProps);
      case WorkflowNodeType.USER_TASK:
        return new UserTask(baseProps);
      case WorkflowNodeType.EXCLUSIVE_GATEWAY:
        return new ExclusiveGateway(baseProps);
      case WorkflowNodeType.INCLUSIVE_GATEWAY:
        return new InclusiveGateway(baseProps);
      case WorkflowNodeType.PARALLEL_GATEWAY:
        return new ParallelGateway(baseProps);

      default:
        console.warn(`Unknown node type: ${type}, creating generic node`);
        return new UserTask(baseProps); // Fallback to generic task
    }
  }

  /**
   * Create multiple entity instances from ReactFlow nodes array
   * @param nodes Array of ReactFlow nodes
   * @returns Array of entity instances
   */
  static createFromReactFlowNodes(nodes: any[]): AbstractWorkflowNode<any>[] {
    return nodes
      .map((node) => this.createFromReactFlowNode(node))
      .filter((entity): entity is AbstractWorkflowNode<any> => entity !== null);
  }
}
