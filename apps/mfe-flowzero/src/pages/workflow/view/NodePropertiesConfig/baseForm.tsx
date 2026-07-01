import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { Node } from "@xyflow/react";
import { Drawer } from "antd";
import React, { memo } from "react";

import HeaderBg from "/src/images/WorkflowDesignPanelBg.png";
import HeaderDarkBg from "/src/images/WorkflowDesignPanelDarkBg.png";

const DrawerWrapper = styled("div")`

  .ant-drawer-content-wrapper{
    box-shadow: none !important;
    border-left:solid 1px #ccc !important;
    border-top:none;
    .dark & {
       border-left:solid 1px #666 !important;
    }
  }
  .userTask-drawer .ant-drawer-header {
    padding-top: 0;
    padding-bottom: 0;
    background-image: url(${HeaderBg});
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: cover;
.dark & {
    background-image: url(${HeaderDarkBg});
    .ant-drawer-close {
    color: #f2f2f2 !important;
  }
  }
  
  .ant-form-item-control-input-content {
    .dark & {
      .ant-input {
        color: #808080;
        background: #171d24 !important;
        border: 1px solid #737373 !important;
      }
      .ant-select-selector {
        color: #808080;
        background: #171d24 !important;
        border: 1px solid #737373 !important;
      }
    }
  }
`;

const drawerHeader = css`
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: visible;
`;

const headerTitle = css`
  position: relative;
  z-index: 1;
  color: #595959;
  font-weight: 500;
  font-size: 18px;
  .dark & {
    color: #f2f2f2 !important;
  }
`;

export const sectionTitle = css`
  color: #0367d2;
  font-weight: 600;
  margin: 24px 0 8px 0;
  font-size: 16px;
`;

export const sectionDivider = css`
  border-bottom: 1px solid #cccccc;
  margin-bottom: 16px;
`;

/**
 * Base Properties Panel Props
 */
export interface BasePanelProps {
  open: boolean;
  onClose: () => void;
  nodeData?: any;
  nodeType?: string;
  upstreamNodes?: Node[];
  allNodes?: Node[];
  title?: string;
  children?: React.ReactNode;
  onNodeDataChange?: (data: any) => void;
}

const TITLE_MAP: Record<string, string> = {
  StartEventNode: "Start Event",
  WorkFlowStepNode: "Workflow Step",
  EndNode: "End Event",
  IfNode: "Exclusive Gateway",
  InclusiveGatewayNode: "Inclusive Gateway",
  ParallelGatewayNode: "Parallel Gateway",
};

/**
 * Base Properties Panel Component
 * Only handles drawer container and header
 * Specific form content should be passed as children
 */
export const BasePropertiesPanel = memo((props: BasePanelProps) => {
  const {
    open,
    onClose,
    title,
    nodeType,
    nodeData,
    upstreamNodes,
    allNodes,
    children,
    onNodeDataChange,
  } = props;

  const displayTitle = title || (nodeType ? TITLE_MAP[nodeType] : "");

  return (
    <DrawerWrapper>
      <Drawer
        className="userTask-drawer dark:bg-[#171d24]"
        mask={false}
        title={
          <div className={drawerHeader}>
            <span className={headerTitle}>{displayTitle}</span>
          </div>
        }
        placement="right"
        width={478}
        onClose={onClose}
        open={open}
        closable={true}
        getContainer={false}
        zIndex={10000}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children, {
              nodeData,
              nodeType,
              upstreamNodes,
              allNodes,
              onNodeDataChange,
            } as any)
          : children}
      </Drawer>
    </DrawerWrapper>
  );
});

BasePropertiesPanel.displayName = "BasePropertiesPanel";

export default BasePropertiesPanel;
