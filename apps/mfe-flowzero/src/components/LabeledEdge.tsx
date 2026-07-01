import {
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  MarkerType,
} from "@xyflow/react";
import React from "react";

import { useEdgeHover } from "../context/EdgeHoverContext";

const labelColors = {
  true: "#808080",
  false: "#808080",
};

const LabeledEdge: React.FC<EdgeProps> = (props) => {
  const {
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    sourceHandleId,
  } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = React.useState(false);
  const { setHoveredEdgeId } = useEdgeHover();
  let label: React.ReactNode = null;
  // Delete handler: expects onDelete prop in edge data
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.data && typeof props.data.onDelete === "function") {
      props.data.onDelete(id);
    }
    setHoveredEdgeId(null); // Clear hover state after delete
  };

  const isTrueEdge = sourceHandleId === "true";
  const isIfNode = !!sourceHandleId;
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <marker
            id={`arrowclosed-${id}`}
            markerWidth={16}
            markerHeight={16}
            refX={14}
            refY={8}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon
              points="2,2 14,8 2,14"
              fill={isHovered ? "#FBBD43" : "#808080"}
            />
          </marker>
        </defs>
      </svg>
      <g
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredEdgeId(id, props.source, props.target);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredEdgeId(null);
        }}
      >
        {/* Hover trigger: invisible wide path */}
        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={16}
          style={{ cursor: "pointer" }}
        />
        <path
          id={id}
          d={edgePath}
          fill="none"
          strokeWidth={isHovered ? 3 : 2}
          markerEnd={`url(#arrowclosed-${id})`}
          style={{
            stroke: isHovered ? "#FBBD43" : "#808080",
            transition: "stroke 0.2s, stroke-width 0.2s",
          }}
        />
        {/* True/False labels near source point */}
        {isIfNode && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(20%, -50%) translate(${sourceX}px, ${sourceY}px)`,
                backgroundColor: "white",
                padding: "2px",
              }}
            >
              <span
                style={{
                  color: isTrueEdge ? labelColors.true : labelColors.false,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {isTrueEdge ? "True" : "False"}
              </span>
            </div>
          </EdgeLabelRenderer>
        )}
        {/* Delete icon at center, only show on hover */}
        {isHovered && (
          <g
            style={{ cursor: "pointer" }}
            transform={`translate(${labelX - 10}, ${labelY - 10})`}
          >
            {/* Increase clickable area */}
            <circle
              cx={10}
              cy={10}
              r={12}
              fill="transparent"
              style={{ cursor: "pointer", pointerEvents: "all" }}
              onClick={handleDelete}
            />
            {/* Mask circle to block the line visually */}
            <circle cx={10} cy={10} r={11} fill="white" stroke="none" />
            <circle
              cx={10}
              cy={10}
              r={10}
              fill="none"
              stroke="#FBBD43"
              strokeWidth={2}
            />
            <circle cx={10} cy={10} r={8} fill="white" stroke="none" />
            <svg
              x={2}
              y={2}
              width={16}
              height={16}
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.75 1.5C3.75 0.87868 4.25368 0.375 4.875 0.375H7.125C7.74632 0.375 8.25 0.87868 8.25 1.5V2.625H9.93169C9.93517 2.62497 9.93865 2.62497 9.94214 2.625H10.5C10.8107 2.625 11.0625 2.87684 11.0625 3.1875C11.0625 3.49816 10.8107 3.75 10.5 3.75H10.4613L10.0107 10.0577C9.94763 10.9408 9.21282 11.625 8.32749 11.625H3.67251C2.78718 11.625 2.05237 10.9408 1.9893 10.0577L1.53875 3.75H1.5C1.18934 3.75 0.9375 3.49816 0.9375 3.1875C0.9375 2.87684 1.18934 2.625 1.5 2.625H2.05786C2.06135 2.62497 2.06483 2.62497 2.06831 2.625H3.75V1.5ZM2.66661 3.75L3.11144 9.97758C3.13246 10.2719 3.3774 10.5 3.67251 10.5H8.32749C8.6226 10.5 8.86754 10.2719 8.88856 9.97758L9.33339 3.75H2.66661ZM7.125 2.625H4.875V1.5H7.125V2.625ZM4.875 4.875C5.18566 4.875 5.4375 5.12684 5.4375 5.4375V8.8125C5.4375 9.12316 5.18566 9.375 4.875 9.375C4.56434 9.375 4.3125 9.12316 4.3125 8.8125V5.4375C4.3125 5.12684 4.56434 4.875 4.875 4.875ZM7.125 4.875C7.43566 4.875 7.6875 5.12684 7.6875 5.4375V8.8125C7.6875 9.12316 7.43566 9.375 7.125 9.375C6.81434 9.375 6.5625 9.12316 6.5625 8.8125V5.4375C6.5625 5.12684 6.81434 4.875 7.125 4.875Z"
                fill="#FBBD43"
              />
            </svg>
          </g>
        )}
      </g>
      {label}
    </>
  );
};

export default LabeledEdge;
