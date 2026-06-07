import { Tooltip } from "antd";
import React, { useRef, useState } from "react";

interface TruncatedTooltipProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const TruncatedTooltip = ({
  text,
  className = "text-[12px] flex-1 min-w-0 truncate",
  onClick,
}: TruncatedTooltipProps) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);

  return (
    <Tooltip title={overflow ? text : ""} placement="right">
      <span
        ref={spanRef}
        className={className}
        onClick={onClick}
        onMouseEnter={() => {
          if (spanRef.current) {
            setOverflow(
              spanRef.current.scrollWidth > spanRef.current.clientWidth
            );
          }
        }}
      >
        {text}
      </span>
    </Tooltip>
  );
};

export default TruncatedTooltip;
