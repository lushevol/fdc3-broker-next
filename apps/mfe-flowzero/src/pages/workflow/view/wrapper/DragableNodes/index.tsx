import React, { createContext, ReactNode } from "react";
export interface BaseDragNodeContext {
  nodeConfig: NodeConfig;
  children?: ReactNode;
  isDragging?: boolean;
  isOverlay?: boolean;
}
export interface NodeConfig {
  name: string;
  id: string;
  type: string;
}
export const DragableNodeContext = createContext<BaseDragNodeContext | null>(
  null
);

export const isNodeConfigType = (config: any): config is NodeConfig => {
  if (config.type && config.type != "") {
    return true;
  }
  return false;
};

const DragableNodes = (
  props: Pick<BaseDragNodeContext, "nodeConfig" | "children">
) => {
  const { children, nodeConfig } = props;
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeConfig)
    );
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div draggable onDragStart={handleDragStart}>
      {children}
    </div>
  );
};

export default DragableNodes;
