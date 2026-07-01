import { WorkflowNodeType } from "../../../types";
import {
  AbstractWorkflowNode,
  AbstractWorkflowNodeProps,
  HandleMetaProps,
} from "./AbstractWorkflowNode";

export type ExclusiveGatewayProps<T> = AbstractWorkflowNodeProps<T>;

export class ExclusiveGateway<T> extends AbstractWorkflowNode<T> {
  getBpmnAttributes(moddle: any, nodeData: any): Record<string, any> {
    const attributes: Record<string, any> = {};

    // Expression is stored in node data but will be used in edges, not on the gateway itself
    // This is intentionally empty as per BPMN spec - expressions go on sequenceFlows

    return attributes;
  }

  /**
   * Generate condition expression for an outgoing edge based on sourceHandle
   * @param moddle - BPMN moddle instance
   * @param nodeData - Gateway node data containing expression
   * @param edge - The edge (sequenceFlow) information
   * @returns conditionExpression object or undefined
   */
  getEdgeConditionExpression(moddle: any, nodeData: any, edge: any): any {
    const expression = nodeData?.expression;

    if (!expression) {
      return undefined;
    }

    // Try to get branch info from sourceHandle first, then fallback to edge.id
    let branchIndicator = edge.sourceHandle || edge.id || "";

    // Determine if this is the true or false branch based on sourceHandle or edge.id
    const isTrueBranch = branchIndicator.toLowerCase().includes("true");
    const isFalseBranch = branchIndicator.toLowerCase().includes("false");

    if (isTrueBranch) {
      // True branch: use the expression as-is
      return moddle.create("bpmn:FormalExpression", {
        body: expression,
      });
    } else if (isFalseBranch) {
      // False branch: per Camunda BPMN standard, the default flow has no conditionExpression.
      // The gateway's "default" attribute points to this sequence flow.
      return undefined;
    }

    return undefined;
  }

  /**
   * Check if an edge is the default (false) branch of this gateway.
   * Per Camunda BPMN standard, the default flow is set via the gateway's "default" attribute
   * and must NOT have a conditionExpression.
   */
  isDefaultEdge(edge: any): boolean {
    const branchIndicator = edge.sourceHandle || edge.id || "";
    return branchIndicator.toLowerCase().includes("false");
  }

  constructor(model: ExclusiveGatewayProps<T>) {
    super(model);
    this.type = WorkflowNodeType.EXCLUSIVE_GATEWAY;
    if (!(this.data.handlesMeta as HandleMetaProps[])?.length) {
      this.data.handlesMeta = [
        { id: `${this.id}_in`, role: "target", label: "In" },
        { id: `${this.id}_true`, role: "source", label: "True" },
        { id: `${this.id}_false`, role: "source", label: "Default" },
      ];
    }
  }

  getModel() {
    // TODO: implement ExclusiveGateway specific logic
    return {
      ...super.getModel(),
      type: this.type,
    };
  }

  validation() {
    // TODO: implement ExclusiveGateway specific validation
    return super.validation();
  }
}
