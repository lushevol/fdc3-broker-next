import { Position } from "@xyflow/react";
import { FormInstance } from "antd";
import { FC } from "react";
import {
  BaseNodeHandle,
  BaseNodeProps,
} from "src/pages/workflow/view/wrapper/nodeLayout/BaseLayout";

export interface ILayoutsConfig {
  nodeLayout: FC<BaseNodeProps>;
  propertiesLayout: FC<PropertiesPanelProps>;
}

export interface NodeLayoutProps extends BaseNodeProps {
  icon?: string;
  label?: string;
  subLabel?: string;
  handles?: BaseNodeHandle[];
  style?: React.CSSProperties;
}

export interface PropertiesPanelProps {
  open?: boolean;
  onClose?: () => void;
  nodeData?: any;
  nodeType?: string;
  upstreamNodes?: any[];
  allNodes?: any[];
  onNodeDataChange?: (data: any) => void;
  onRemoveEdgesByHandle?: (handleId: string) => void;
}

export interface BaseLayoutProps<T = any> {
  icon?: string;
  label?: string;
  subLabel?: string;
  handles?: BaseNodeHandle[];
  style?: React.CSSProperties;
  data?: T;
  onDelete?: (id?: string) => void;
  nodeId?: string;
  showLabel?: boolean;
}

/**
 * Factory Base Properties Configuration
 * Defines common properties for node creation
 */
export interface FactoryBaseProps {
  icon: string;
  label: string;
  subLabel: string;
  borderRadius?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
  handles: BaseNodeHandle[];
}
