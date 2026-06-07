import { Tooltip } from "antd";
import cn from "classnames";
import { memo, useRef, useState } from "react";

import Icon from "../../node_icon/Inclusive_Gateway.png";
import MergeIcon from "../../node_icon/Inclusive_Gateway_Merge.png";
import { BaseNodeProps } from "./BaseLayout";
import { DeleteBtn, Label, LabelWrap, NodeContainer, SubLabel } from "./style";

const InclusiveGatewayNodeLayout = memo((props: BaseNodeProps) => {
  const { data, onDelete, nodeId } = props;
  const [showDelete, setShowDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setShowDelete(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => {
      setShowDelete(false);
      setIsHovered(false);
    }, 500);
  };

  const sourceCount = ((data as any)?.handlesMeta || []).filter(
    (h: any) => h.role === "source"
  ).length;
  const hasBranch = ((data as any)?.handlesMeta || []).some(
    (h: any) => h.role === "source" && h.isBranch
  );
  const nodeIcon = hasBranch ? Icon : MergeIcon;
  const useBottomHandles = sourceCount >= 3;

  const label = data?.label || "Inclusive Gateway";
  const subLabel = "Inclusive Gateway";

  return (
    <NodeContainer
      className={cn(
        "relative dark:bg-[#262626]",
        useBottomHandles
          ? "!flex-row !items-center !w-[294px] px-[16px] gap-x-[16px]"
          : "p-4 flex flex-col items-center justify-center"
      )}
      isHovered={isHovered}
      icon={useBottomHandles ? undefined : nodeIcon}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {onDelete && showDelete && (
        <DeleteBtn
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(nodeId ?? data?.id);
          }}
          aria-label="Delete Node"
        >
          <span
            className="flowzero-iconfont icon-field-trash dark:text-[#808080]"
            style={{ color: "#808080", width: 20, height: 20 }}
          />
        </DeleteBtn>
      )}
      {useBottomHandles ? (
        <div className="w-full flex items-center justify-start">
          <img
            src={nodeIcon}
            alt="Inclusive Gateway"
            className="w-[75px] h-[75px] shrink-0 mr-[2px]"
          />
          <div className="flex flex-col justify-center overflow-hidden">
            <Tooltip
              title={label}
              placement="top"
              overlayClassName="dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]"
            >
              <div
                className={cn(
                  "font-semibold text-[16px] text-[#0367d2] dark:text-[#9AC7F6] max-w-[170px]",
                  "whitespace-nowrap overflow-hidden text-ellipsis"
                )}
              >
                {label}
              </div>
            </Tooltip>
            <div className="text-[14px] font-medium text-[#a9a9ab] mt-[2px] whitespace-nowrap">
              {subLabel}
            </div>
          </div>
        </div>
      ) : (
        <LabelWrap>
          <Tooltip
            title={label}
            placement="left"
            overlayClassName="dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]"
          >
            <Label>{label}</Label>
          </Tooltip>
          <SubLabel>{subLabel}</SubLabel>
        </LabelWrap>
      )}
    </NodeContainer>
  );
});

// Note: handles are provided by node entity via `node.data.handlesMeta`

export { InclusiveGatewayNodeLayout };
