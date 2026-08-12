import { styled, css } from "@mui/material";
const DialogBorderRadius = "10px";
const StyledResizableMuiDialog = (muiDialog, _enableResize: boolean) => {
  return styled(muiDialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      borderRadius: DialogBorderRadius,
      ...(theme.palette.mode === "dark"
        ? { background: "#141B21" }
        : { background: "#F7F9FD" }),
    },
    "& .MuiDialogTitle-root": {
      padding: "8px 12px",
      fontSize: "1rem",
    },
    "& .MuiDialogContent-root": {
      borderRadius: DialogBorderRadius,
      padding: "0",
    },
    ".close-btn": css`
      position: absolute;
      right: 16px;
      top: 6px;
      border-radius: inherit;
      color: inherit;
    `,
    ".max-btn": css`
      position: absolute;
      right: 96px;
      top: 6px;
      border-radius: inherit;
      color: inherit;
    `,
    ".resize-btn": css`
      position: absolute;
      right: 0px;
      bottom: 0px;
      width: 20px;
      height: 20px;
      background: none;
      border: none;
      cursor: se-resize;
      outline: none;
      &::before {
        position: absolute;
        left: 9px;
        top: 9px;
        content: "";
        width: 5px;
        height: 5px;
        border: 1px solid var(--theme-color-modal-filed-panel-border);
        border-left: 1px solid transparent;
        border-top: 1px solid transparent;
        border-bottom-right-radius: ${DialogBorderRadius};
      }
      &::after {
        position: absolute;
        left: 8px;
        top: 8px;
        content: "";
        width: 10px;
        height: 10px;
        border: 1px solid var(--theme-color-modal-filed-panel-border);
        border-left: 1px solid transparent;
        border-top: 1px solid transparent;
        border-bottom-right-radius: ${DialogBorderRadius};
      }
    `,
  }));
};
export default StyledResizableMuiDialog;
