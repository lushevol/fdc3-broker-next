import React from "react";

import { DialogProps } from "./types";
declare const useController: (props: DialogProps) => {
  dialogRef: React.RefObject<HTMLDivElement>;
  idTitle: string;
  width: React.MutableRefObject<number | undefined>;
  height: React.MutableRefObject<number | undefined>;
  initDrag: (e: any) => void;
  stopDrag: () => void;
  doDrag: (e: any) => void;
  idModal: string;
  onResize: () => void;
  isMax: boolean;
  dialogContentRef: React.RefObject<HTMLDivElement>;
  hideOverflow: (parent: any, hideScroll: boolean) => void;
  setheight: (parent: any, MuiBackdrop: any) => void;
  getPosition: (
    width_: any,
    height_: any
  ) => {
    top: number;
    left: number;
  };
  top: number;
  left: number;
  onMouseDown: () => void;
  setZIndex: (modal: any, id: any) => void;
  hide: (parent: any, open: boolean, max: boolean) => void;
  closeDialog: () => void;
  handleModalEvent: (workspaces: any, tabid: any) => void;
};
export default useController;
