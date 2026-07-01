/**
 * WorkflowNodeType - Domain Enumeration
 * Represents the type of BPMN node/element
 */
import { WorkflowNodeType } from "./nodeTypes";
export const isValidBpmnNodeType = (type: string): type is WorkflowNodeType => {
  return Object.values(WorkflowNodeType).includes(type as WorkflowNodeType);
};

/**
 * Map ReactFlow node types to BPMN element types
 */
export const getBpmnElementType = (nodeType: WorkflowNodeType): string => {
  const mapping: Record<WorkflowNodeType, string> = {
    [WorkflowNodeType.START_EVENT]: "bpmn:StartEvent",
    [WorkflowNodeType.END_EVENT]: "bpmn:EndEvent",
    [WorkflowNodeType.USER_TASK]: "bpmn:UserTask",
    [WorkflowNodeType.EXCLUSIVE_GATEWAY]: "bpmn:ExclusiveGateway",
    [WorkflowNodeType.PARALLEL_GATEWAY]: "bpmn:ParallelGateway",
    [WorkflowNodeType.INCLUSIVE_GATEWAY]: "bpmn:InclusiveGateway",
  };
  return mapping[nodeType] || "bpmn:Task";
};
