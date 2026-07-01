import { NodeProps } from "@xyflow/react";

export interface NodePropsBase extends NodeProps {
  onDelete?: (nodeId?: string) => void;
  nodeId?: string;
}

export type BpmnNodeType =
  | "WorkFlowStepNode"
  | "HttpNode"
  | "EndNode"
  | "CodeNode"
  | "IfNode"
  | "ParallelGatewayNode"
  | "InclusiveGatewayNode"
  | "StartEventNode";

export interface BpmnNodeData {
  label: string;
  [key: string]: any;
}

export interface BpmnNode {
  id: string;
  type: BpmnNodeType;
  position: { x: number; y: number };
  data: BpmnNodeData;
}
