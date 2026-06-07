import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Drawer } from "antd";
import React from "react";

import HeaderBg from "/src/images/WorkflowDesignPanelBg.png";
import HeaderDarKBg from "/src/images/WorkflowDesignPanelDarkBg.png";
interface DrawerPanelProps {
  title: string;
  open: boolean;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}
const DrawerWrapper = styled("div")`
  .ant-drawer {
    .ant-drawer-content-wrapper {
      box-shadow: none !important;
    }
  }
  .ant-drawer-header {
    background: url(${HeaderBg}) !important;
    border-left-width: 1px !important;
    border-left-color: #ccc !important;
    .dark & {
      color: #f2f2f2 !important;
      background: url(${HeaderDarKBg}) !important;
      border-left-color: #666 !important;
    }
    .ant-drawer-close {
      .dark & {
        color: #f2f2f2 !important;
      }
    }
  }
`;
const DrawerBodyWhiteScrollbar = styled("div")(
  () => css`
    height: 100%;
    width: 100%;
    overflow-y: auto;
    scrollbar-color: #fff #f0f0f0;
    &::-webkit-scrollbar {
      width: 8px;
      background: #fff;
    }
    &::-webkit-scrollbar-thumb {
      background: #fff;
      border-radius: 8px;
    }
  `
);
const DrawerPanel: React.FC<DrawerPanelProps> = ({
  title,
  open,
  onClose,
  width = 360,
  children,
}) => {
  return (
    <DrawerWrapper className="workflow-drawer__wrapper  dark:border-l-[1px]">
      <Drawer
        className="function-drawer-panel"
        title={title}
        placement="right"
        onClose={onClose}
        open={open}
        width={width}
        bodyStyle={{ padding: 0, height: "100%" }}
        closable={true}
        maskClosable={true}
        mask={false}
        getContainer={false}
      >
        <DrawerBodyWhiteScrollbar>{children}</DrawerBodyWhiteScrollbar>
      </Drawer>
    </DrawerWrapper>
  );
};

export default DrawerPanel;
