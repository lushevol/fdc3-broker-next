export enum WorkflowNodeType {
  START_EVENT = "StartEventNode",
  END_EVENT = "EndNode",
  USER_TASK = "WorkFlowStepNode",
  EXCLUSIVE_GATEWAY = "IfNode",
  PARALLEL_GATEWAY = "ParallelGatewayNode",
  INCLUSIVE_GATEWAY = "InclusiveGatewayNode",
}

export interface BPMNParser {
  fromXML: (xml: string) => any;
  toXML: (xml: string) => any;
}

export type Expression = string | { [key: string]: any };
