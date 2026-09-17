import * as React from "react";
import type { DialogTitleProps as MuiDialogTitleProps } from "@mui/material/DialogTitle";
import { newStyleTokens } from "./tokens/webkit.js";

export interface DialogTitleProps extends MuiDialogTitleProps {
  isDraggable?: boolean;
  isResizeble?: boolean;
  isMax?: boolean;
  disabledClose?: boolean;
  onClose: (...args: unknown[]) => void;
  onResize?: (...args: unknown[]) => void;
  testIdPrefix?: string;
}
import MuiDialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { AspectRatioOutlined as AspectRatioOutlinedIcon } from "@mui/icons-material";
import ToggleButton from "@mui/material/ToggleButton";
import { PREFIX } from "./dialog-style.js";
import type { Theme } from "@mui/material/styles";

export const darkBg =
  "linear-gradient(to right, rgb(17, 23, 29), rgb(17, 23, 29)) padding-box padding-box, linear-gradient(to right, rgb(65, 73, 85), rgb(29, 31, 34)) border-box border-box";
export const lightBg =
  "linear-gradient(to right, rgb(245, 245, 245), rgb(245, 245, 245)) padding-box padding-box, linear-gradient(to right, rgb(186, 186, 186), rgb(245, 245, 245)) border-box border-box";

export const setBg = (theme: Theme) =>
  theme.ratan?.designGeneration === "webkit" ? newStyleTokens.color.surfaceRaised : theme.palette.mode === "dark" ? darkBg : lightBg;

export default function DialogTitle(props: Readonly<DialogTitleProps>) {
  const {
    children,
    onClose,
    onResize,
    isResizeble,
    isDraggable,
    id,
    isMax,
    disabledClose,
    testIdPrefix = PREFIX,
    ...other
  } = props;
  return (
    <MuiDialogTitle
      id={id}
      sx={{ cursor: isDraggable ? "move" : undefined }}
      data-testid={`${testIdPrefix}-header`}
      {...other}
    >
      <Grid container sx={{ flexWrap: "nowrap" }}>
        <Grid item xs={8}>
          {children}
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right", minWidth: "fit-content" }}>
          {isResizeble && onResize ? (
            <ToggleButton
              value="check"
              aria-label="resize"
              onChange={onResize}
              color="primary"
              selected={isMax}
              data-testid={`${testIdPrefix}-maximize`}
              sx={{
                color: (theme) => theme.ratan?.designGeneration === "webkit" ? newStyleTokens.color.text : "#606060",
                borderRadius: "16px",
                padding: "1px 8px",
                height: "24px",
                background: setBg,
                borderColor: "transparent",
                marginRight: "8px",
                "& .MuiSvgIcon-root": {
                  marginLeft: "6px",
                  fontSize: "16px",
                },
              }}
            >
              Maximize <AspectRatioOutlinedIcon color="primary" />
            </ToggleButton>
          ) : null}
          <Chip
            label="Close"
            variant="outlined"
            onClick={onClose}
            onDelete={onClose}
            size="small"
            color="primary"
            data-testid={`${testIdPrefix}-close`}
            sx={{
              "& .MuiChip-label": {
                color: "#606060",
              },
            }}
            disabled={disabledClose}
          />
        </Grid>
      </Grid>
    </MuiDialogTitle>
  );
}
