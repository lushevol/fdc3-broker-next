import { Button } from "antd";
import React from "react";

import { mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const ButtonElement: React.FC<ElementRendererProps> = ({ props }) => {
  const { content, buttonType, style, className } = props;

  return (
    <Button
      htmlType={buttonType}
      type="primary"
      className={mergeCn(className)}
      style={style}
    >
      {content}
    </Button>
  );
};
