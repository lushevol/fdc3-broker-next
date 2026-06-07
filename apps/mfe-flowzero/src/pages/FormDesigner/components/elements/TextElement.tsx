import React from "react";

import { mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const TextElement: React.FC<ElementRendererProps> = ({ props }) => {
  const { content, style, className } = props;
  return (
    <p
      className={mergeCn("text-slate-600 pointer-events-none", className)}
      style={style}
    >
      {content}
    </p>
  );
};
