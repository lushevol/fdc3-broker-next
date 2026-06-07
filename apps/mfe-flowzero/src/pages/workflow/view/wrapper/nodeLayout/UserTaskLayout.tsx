import { Position } from "@xyflow/react";
import { Tooltip } from "antd";
import { memo, useRef, useState } from "react";

import WorkflowStepIcon from "../../node_icon/User_Task.png";
import { BaseNodeHandle, BaseNodeProps } from "./BaseLayout";
import { DeleteBtn, Label, LabelWrap, NodeContainer, SubLabel } from "./style";

const UserTaskNodeLayout = memo((props: BaseNodeProps) => {
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

  const label = data?.label || "User Task";
  const subLabel = "Workflow Step";

  return (
    <NodeContainer
      className="p-4 flex flex-col items-center justify-center relative dark:bg-[#262626]"
      isHovered={isHovered}
      icon={WorkflowStepIcon}
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
    </NodeContainer>
  );
});

// Note: handles are provided by node entity via `node.data.handlesMeta`

export { UserTaskNodeLayout };
