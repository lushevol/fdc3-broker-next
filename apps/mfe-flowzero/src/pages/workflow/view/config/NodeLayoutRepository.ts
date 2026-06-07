import { WorkflowNodeType } from "../../types/nodeTypes";
import { ILayoutsConfig } from "./ILayoutsConfig";
import {
  EndEventLayoutConfig,
  ExclusiveGatewayLayoutConfig,
  InclusiveGatewayLayoutConfig,
  ParallelGatewayLayoutConfig,
  StartEventLayoutConfig,
  UserTaskLayoutConfig,
} from "./layoutConfigs";

export class NodeLayoutRepository {
  private static readonly layoutRegistry: Map<
    WorkflowNodeType,
    ILayoutsConfig
  > = new Map([
    [WorkflowNodeType.START_EVENT, StartEventLayoutConfig],
    [WorkflowNodeType.END_EVENT, EndEventLayoutConfig],
    [WorkflowNodeType.USER_TASK, UserTaskLayoutConfig],
    [WorkflowNodeType.EXCLUSIVE_GATEWAY, ExclusiveGatewayLayoutConfig],
    [WorkflowNodeType.PARALLEL_GATEWAY, ParallelGatewayLayoutConfig],
    [WorkflowNodeType.INCLUSIVE_GATEWAY, InclusiveGatewayLayoutConfig],
  ]);

  static getLayoutConfig(type: WorkflowNodeType): ILayoutsConfig | undefined {
    return this.layoutRegistry.get(type);
  }

  static hasLayout(type: WorkflowNodeType): boolean {
    return this.layoutRegistry.has(type);
  }

  static registerLayout(type: WorkflowNodeType, config: ILayoutsConfig): void {
    this.layoutRegistry.set(type, config);
  }

  static getAllNodeTypes(): WorkflowNodeType[] {
    return Array.from(this.layoutRegistry.keys());
  }

  static getAllLayouts(): Map<WorkflowNodeType, ILayoutsConfig> {
    return new Map(this.layoutRegistry);
  }
}
