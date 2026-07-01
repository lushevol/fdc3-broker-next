import React, { createContext, useContext, useState } from "react";

interface EdgeHoverContextType {
  hoveredEdge: {
    edgeId: string | null;
    sourceNodeId?: string;
    targetNodeId?: string;
  } | null;
  setHoveredEdgeId: (
    edgeId: string | null,
    sourceNodeId?: string,
    targetNodeId?: string
  ) => void;
  getHandleColor: (
    nodeId: string,
    handleType: "source" | "target",
    defaultColor: string
  ) => string;
}

const EdgeHoverContext = createContext<EdgeHoverContextType | undefined>(
  undefined
);

export const EdgeHoverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hoveredEdge, setHoveredEdge] = useState<{
    edgeId: string | null;
    sourceNodeId?: string;
    targetNodeId?: string;
  } | null>(null);

  const setHoveredEdgeId = (
    edgeId: string | null,
    sourceNodeId?: string,
    targetNodeId?: string
  ) => {
    if (edgeId && sourceNodeId && targetNodeId) {
      setHoveredEdge({ edgeId, sourceNodeId, targetNodeId });
    } else {
      setHoveredEdge(null);
    }
  };

  const getHandleColor = (
    nodeId: string,
    handleType: "source" | "target",
    defaultColor: string
  ) => {
    if (!hoveredEdge) return defaultColor;
    if (
      (handleType === "source" && hoveredEdge.sourceNodeId === nodeId) ||
      (handleType === "target" && hoveredEdge.targetNodeId === nodeId)
    ) {
      return "#FBBD43";
    }
    return defaultColor;
  };

  return (
    <EdgeHoverContext.Provider
      value={{ hoveredEdge, setHoveredEdgeId, getHandleColor }}
    >
      {children}
    </EdgeHoverContext.Provider>
  );
};

export const useEdgeHover = () => {
  const ctx = useContext(EdgeHoverContext);
  if (!ctx)
    throw new Error("useEdgeHover must be used within EdgeHoverProvider.");
  return ctx;
};
