import * as React from "react";
import DraggableReact from "react-draggable";
import { Paper } from "ratan-design-origin/primitives";
import { PaperProps } from "./types";

export default function Draggable({ idTitle, ...rest }: Readonly<PaperProps>) {
  return (
    <DraggableReact
      handle={`#${idTitle}`}
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...rest} />
    </DraggableReact>
  );
}
