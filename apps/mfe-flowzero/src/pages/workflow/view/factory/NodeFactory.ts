import { FC } from "react";
import {
  BaseNodeHandle,
  BaseNodeProps,
} from "src/pages/workflow/view/wrapper/nodeLayout/BaseLayout";

import { WorkflowNodeType } from "../../types/nodeTypes";
import { PropertiesPanelProps } from "../config/ILayoutsConfig";
import { NodeLayoutRepository } from "../config/NodeLayoutRepository";

export class NodeFactory {
  static getNodeLayoutByType(type: WorkflowNodeType): FC<BaseNodeProps> | null {
    const config = NodeLayoutRepository.getLayoutConfig(type);
    return config?.nodeLayout ?? null;
  }

  static getPanelFormByType(
    type: WorkflowNodeType
  ): FC<PropertiesPanelProps> | null {
    const config = NodeLayoutRepository.getLayoutConfig(type);
    return config?.propertiesLayout ?? null;
  }

  static isTypeSupported(type: WorkflowNodeType): boolean {
    return NodeLayoutRepository.hasLayout(type);
  }

  static getSupportedTypes(): WorkflowNodeType[] {
    return NodeLayoutRepository.getAllNodeTypes();
  }
}
