import React, { FC, memo, PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, theme } from "antd";
import cn from "classnames";

import "./style.less";
import useController from "./common/useController";

interface DialogProps {
  className?: string;
  testId?: string;
  minWidth?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  isDestroy?: boolean;
  isOpen: boolean;
  onReady?: Function;
  onClose: Function;
  variable?: boolean;
  title?: string;
  enableOtherClose?: boolean;
}

export const Dialog: FC<PropsWithChildren<DialogProps>> = memo((props) => {
  const {
    className,
    testId = "closeBtn",
    isDestroy = true,
    isOpen,
    onReady,
    onClose,
    variable,
    title,
    children,
  } = props;

  const newClassName = cn("dialog", className, { hide: !isOpen });

  useEffect(() => {
    onReady && onReady();
  });

  const { style, startMove, moving, endMove, close } = useController(props);

  const keyDownHander = () => {
    return null;
  };

  return createPortal(
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm }}
      prefixCls="rtDialog"
    >
      <div
        className={newClassName}
        onMouseUp={endMove}
        onMouseMove={moving}
        onMouseLeave={endMove}
        onClick={close}
        onKeyDown={keyDownHander}
        data-testid="dialog"
      >
        <div
          className="dialog-window"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={keyDownHander}
          style={style}
        >
          <h3 className="dialog-title">{title}</h3>
          <Button
            className="close-btn"
            data-testid={testId}
            type="text"
            icon={<CloseOutlined />}
            onClick={() => onClose()}
          />
          <div className="dialog-body">
            {(!isDestroy || isOpen) && children}
          </div>
          {variable ? (
            <button className="dialog-variable-btn" onMouseDown={startMove} />
          ) : (
            ""
          )}
        </div>
      </div>
    </ConfigProvider>,
    document.body
  );
});
