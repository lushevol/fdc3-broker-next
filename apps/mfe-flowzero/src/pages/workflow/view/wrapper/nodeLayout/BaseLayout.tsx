import styled from "@emotion/styled";
import { Handle, Position } from "@xyflow/react";
import React, { memo } from "react";
import { useEdgeHover } from "src/context/EdgeHoverContext";
const COLOR_NODE_BORDER = "#808080";

/**
 * Base Node Component - Only handles positioning and handles
 * All visual rendering should be implemented in specific node components
 */
export interface BaseNodeHandle {
  type: "target" | "source";
  position: Position;
  id?: string;
  style?: React.CSSProperties;
  label?: string;
}

export interface BaseNodeData {
  label?: string;
  subLabel?: string;
  id?: string;
}

export interface BaseNodeProps {
  type?: string;
  data?: BaseNodeData;
  nodeId?: string;
  handles?: BaseNodeHandle[];
  children?: React.ReactNode;
  onDelete?: (id?: string) => void;
  [key: string]: any;
}

// Styled wrappers for handle groups
const Handles = styled("div")`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Sources = styled(Handles)`
  right: 0;
  top: 0;
  height: 100%;
  transform: translate(50%, 0);
  justify-content: center;
  gap: 20px;
`;

const BottomSources = styled("div")`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100%;
  transform: translate(0, 50%);
`;

const Targets = styled(Handles)`
  left: 0;
  top: 0;
  height: 100%;
  transform: translate(-50%, 0);
`;

const StyledHandle = styled(Handle)`
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  transform: none !important;
`;

const BaseLayout = memo((props: BaseNodeProps) => {
  const { getHandleColor } = useEdgeHover();
  const { type, data, nodeId, handles = [], children, ...rest } = props;
  const realNodeId = nodeId ?? data?.id ?? props.id;

  const isInclusiveGateway = type === "InclusiveGatewayNode";
  const rightSourceHandles = isInclusiveGateway
    ? handles.filter(
        (h) => h.type === "source" && h.position !== Position.Bottom
      )
    : handles.filter((h) => h.type === "source");
  const bottomSourceHandles = isInclusiveGateway
    ? handles.filter(
        (h) => h.type === "source" && h.position === Position.Bottom
      )
    : [];

  return (
    <>
      {/* Target handles */}
      <Targets className="handles targets">
        {handles
          .filter((h) => h.type === "target")
          .map((h, idx) => (
            <div key={"target-wrap-" + idx}>
              <StyledHandle
                type="target"
                position={h.position}
                id={h.id}
                style={{
                  width: 6,
                  height: 14,
                  borderRadius: 0,
                  border: "none",
                  backgroundColor: getHandleColor(
                    realNodeId ?? "",
                    "target",
                    typeof h.style?.background === "string"
                      ? h.style.background
                      : COLOR_NODE_BORDER
                  ),
                  transition: "background-color 0.2s",
                  ...h.style,
                }}
              />
            </div>
          ))}
      </Targets>

      {/* Node content - delegated to children */}
      {children}

      {/* Right source handles */}
      <Sources className="handles sources">
        {rightSourceHandles.map((h, idx) => (
          <div key={"source-wrap-" + idx} style={{ position: "relative" }}>
            <StyledHandle
              type="source"
              position={h.position}
              id={h.id}
              style={{
                ...h.style,
                backgroundColor: getHandleColor(
                  realNodeId ?? "",
                  "source",
                  typeof h.style?.background === "string"
                    ? h.style.background
                    : COLOR_NODE_BORDER
                ),
                transition: "background-color 0.2s",
                cursor: "pointer",
              }}
            />
            {/* Branch/IfNode label: move above handle, not beside edge */}
            {isInclusiveGateway && h.label !== "Out" && (
              <span
                style={{
                  position: "absolute",
                  left: 20,
                  top: -2,
                  whiteSpace: "nowrap",
                  fontSize: 12,
                  color: "#808080",
                  fontWeight: 500,
                  pointerEvents: "none",
                }}
              >
                {h.label}
              </span>
            )}
            {type === "IfNode" && (idx === 0 || idx === 1) && (
              <span
                style={{
                  position: "absolute",
                  left: 20,
                  top: -2,
                  whiteSpace: "nowrap",
                  fontSize: 14,
                  color: "#808080",
                  fontWeight: 600,
                  pointerEvents: "none",
                }}
              >
                {idx === 0 ? "true" : "false"}
              </span>
            )}
          </div>
        ))}
      </Sources>

      {/* Bottom source handles for InclusiveGateway (3rd branch onward) */}
      {isInclusiveGateway && bottomSourceHandles.length > 0 && (
        <BottomSources className="handles bottom-sources">
          {bottomSourceHandles.map((h, idx) => (
            <div
              key={"bottom-wrap-" + idx}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <StyledHandle
                type="source"
                position={h.position}
                id={h.id}
                style={{
                  ...h.style,
                  backgroundColor: getHandleColor(
                    realNodeId ?? "",
                    "source",
                    typeof h.style?.background === "string"
                      ? h.style.background
                      : COLOR_NODE_BORDER
                  ),
                  transition: "background-color 0.2s",
                  cursor: "pointer",
                }}
              />
              {h.label && (
                <span
                  style={{
                    position: "absolute",
                    display: "inline-block",
                    top: "calc(100% + 4px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "normal",
                    wordBreak: "break-all",
                    fontSize: 12,
                    color: "#808080",
                    fontWeight: 500,
                    lineHeight: "100%",
                    pointerEvents: "none",
                    width: "66px",
                  }}
                >
                  {h.label}
                </span>
              )}
            </div>
          ))}
        </BottomSources>
      )}
    </>
  );
});

export default BaseLayout;
