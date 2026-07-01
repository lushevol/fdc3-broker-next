import { Tooltip } from "antd";
import React, { useRef, useState } from "react";

interface EllipsisTooltipProps {
  value: React.ReactNode;
  className?: string;
  placement?: "top" | "left" | "right" | "bottom";
  onlyShowOnOverflow?: boolean;
}

const EllipsisTooltip: React.FC<EllipsisTooltipProps> = ({
  value,
  className = "",
  placement = "top",
  onlyShowOnOverflow = false,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  const tooltipTitle = onlyShowOnOverflow ? (overflow ? value : "") : value;

  return (
    <Tooltip
      title={tooltipTitle}
      placement={placement}
      overlayClassName="dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]"
    >
      <div
        ref={divRef}
        className={`max-w-full overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
        onMouseEnter={() => {
          if (onlyShowOnOverflow && divRef.current) {
            setOverflow(
              divRef.current.scrollWidth > divRef.current.clientWidth
            );
          }
        }}
      >
        {value}
      </div>
    </Tooltip>
  );
};

export default EllipsisTooltip;
