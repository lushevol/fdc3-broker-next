import React from "react";
import MuiButton, { type ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {
  DesignServicesOutlined as DesignServicesOutlinedIcon,
  FilterAltOutlined as FilterAltOutlinedIcon,
  KeyboardArrowDownOutlined as KeyboardArrowDownOutlinedIcon,
} from "@mui/icons-material";
import MuiPopover, { type PopoverProps } from "@mui/material/Popover";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import { newStyleTokens } from "./tokens/webkit.js";

export interface BuilderTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function BuilderTabPanel({ children, value, index, ...other }: Readonly<BuilderTabPanelProps>) {
  return (
    <div role="tabpanel" hidden={value !== index}
      id={`Builder-tabpanel-${index}`} data-testid={`Builder-tabpanel-${index}`}
      aria-labelledby={`Builder-tab-${index}`} {...other}>
      {children}
    </div>
  );
}

export function builderTabProps(index: number) {
  return { id: `Builder-tab-${index}`, "aria-controls": `Builder-tabpanel-${index}` };
}

export const builderEmptyStyle = () => ({});
// Preserve MUI's polymorphic props/refs without leaking nested styled types.
export const BuilderTabs = /*#__PURE__*/ styled(MuiTabs)(builderEmptyStyle) as typeof MuiTabs;
export const BuilderTab = /*#__PURE__*/ styled(MuiTab)(builderEmptyStyle) as typeof MuiTab;

export interface BuilderButtonProps extends ButtonProps {
  label: "Table" | "Filters";
  anchorEl: PopoverProps["anchorEl"];
  popOverWidth?: string;
  popOverHeight?: string;
}

const legacy = {
  text: "#78797B", border: "#818181", icon: "#4E70A8",
  width: "284px", height: "560px", top: "40px", bottom: "48px",
};

const ButtonRoot = /*#__PURE__*/ styled(MuiButton)(({ theme }) => {
  const webkit = theme.ratan?.designGeneration === "webkit";
  return {
    color: webkit ? newStyleTokens.color.textMuted : legacy.text,
    backgroundColor: "transparent",
    borderColor: webkit ? newStyleTokens.color.border : legacy.border,
    padding: 0,
    margin: 0,
    "& .MuiButton-startIcon": {
      padding: "7px 10px", borderRight: "1px solid", borderColor: "inherit",
      margin: 0, marginRight: "10px",
      color: webkit ? newStyleTokens.color.icon : legacy.icon,
    },
    "& .MuiButton-endIcon": { padding: "7px" },
    "&.MuiButton-sizeMedium": {
      "& .MuiButton-startIcon": { padding: "5px 8px", marginRight: "8px" },
      "& .MuiButton-endIcon": { padding: "5px" },
    },
    "&.MuiButton-sizeSmall": {
      "& .MuiButton-startIcon": { padding: "3px 6px", marginRight: "6px" },
      "& .MuiButton-endIcon": { padding: "3px" },
    },
  };
});

const PopoverRoot = /*#__PURE__*/ styled(MuiPopover)(({ theme }) => {
  const webkit = theme.ratan?.designGeneration === "webkit";
  const background = webkit ? newStyleTokens.color.background : theme.palette.background.default;
  const border = webkit ? newStyleTokens.color.border : legacy.border;
  const text = webkit ? newStyleTokens.color.text : theme.palette.getContrastText(theme.palette.background.default);
  return {
    overflow: "auto",
    "& .MuiPaper-root": {
      width: legacy.width, height: legacy.height,
      marginTop: webkit ? newStyleTokens.spacing.small : "8px", padding: 0,
      backgroundColor: background, border: "1px solid", borderColor: border,
      color: text, overflow: "hidden",
    },
    "& .MuiTabs-root": {
      boxSizing: "border-box",
      backgroundColor: background, position: "absolute", top: 0, left: 0,
      minHeight: "auto", width: "100%", padding: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      "& .MuiTabs-indicator": { display: "none" },
      "& .MuiTab-root": {
        padding: 0, height: "auto", minHeight: "auto", alignItems: "start", width: "50%",
      },
      "& .Mui-selected": { color: text },
      "& .MuiTouchRipple-root": { display: "none" },
    },
    "& div[role='tabpanel']": {
      boxSizing: "border-box",
      padding: theme.spacing(0, 2), position: "absolute", top: legacy.top, left: 0,
      height: "-webkit-fill-available", width: "100%", marginBottom: legacy.bottom,
      overflowY: "auto",
    },
    "& .MuiStack-root": {
      boxSizing: "border-box",
      backgroundColor: background, position: "absolute", bottom: 0, left: 0,
      justifyContent: "end", padding: theme.spacing(0, 2, 2, 2), width: "100%",
      "& .MuiButton-outlinedInherit": {
        borderColor: border, backgroundColor: background,
        "&:hover": { borderColor: webkit ? newStyleTokens.color.borderInteractive : theme.palette.primary.main },
      },
    },
  };
});

export function BuilderButton({
  variant: _variant, startIcon: _startIcon, color: _color,
  label, anchorEl, popOverWidth, popOverHeight, children, ...rest
}: BuilderButtonProps) {
  const uniqueId = React.useId();
  const open = Boolean(anchorEl);
  const id = open ? `${label}-${uniqueId}-popover` : undefined;
  return (
    <>
      <ButtonRoot aria-describedby={id} variant="outlined" color="primary"
        startIcon={label === "Table" ? <DesignServicesOutlinedIcon /> : <FilterAltOutlinedIcon />}
        endIcon={<KeyboardArrowDownOutlinedIcon />} {...rest} data-testid="BuilderButton">
        {label}
      </ButtonRoot>
      <PopoverRoot id={id} open={open} anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} elevation={2}
        sx={{ "& .MuiPaper-root": { width: popOverWidth, height: popOverHeight } }}>
        {children}
      </PopoverRoot>
    </>
  );
}
