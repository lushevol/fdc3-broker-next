import React from "react";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import MuiPopover, { PopoverVirtualElement } from "@mui/material/Popover";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`Builder-tabpanel-${index}`}
      data-testid={`Builder-tabpanel-${index}`}
      aria-labelledby={`Builder-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

export function a11yTabPanelProps(index: number) {
  return {
    id: `Builder-tab-${index}`,
    "aria-controls": `Builder-tabpanel-${index}`,
  };
}
export const emptyFunction = () => ({});
export const Tabs = styled(MuiTabs)(emptyFunction);
export const Tab = styled(MuiTab)(emptyFunction);

export interface BuilderButtonProps extends ButtonProps {
  label: "Table" | "Filters";
  anchorEl:
    | Element
    | (() => Element)
    | PopoverVirtualElement
    | (() => PopoverVirtualElement)
    | HTMLButtonElement
    | null;
  popOverWidth?: string;
  popOverHeight?: string;
}

const Button = styled(MuiButton)(() => ({
  color: "#78797B",
  backgroundColor: "transparent",
  borderColor: "#818181",
  padding: 0,
  margin: 0,
  "& .MuiButton-startIcon": {
    padding: "7px 10px",
    borderRight: "1px solid",
    borderColor: "inherit",
    margin: 0,
    marginRight: "10px",
    color: "#4E70A8",
  },
  "& .MuiButton-endIcon": {
    padding: "7px",
  },
  "&.MuiButton-sizeMedium": {
    "& .MuiButton-startIcon": {
      padding: "5px 8px",
      marginRight: "8px",
    },
    "& .MuiButton-endIcon": {
      padding: "5px",
    },
  },
  "&.MuiButton-sizeSmall": {
    "& .MuiButton-startIcon": {
      padding: "3px 6px",
      marginRight: "6px",
    },
    "& .MuiButton-endIcon": {
      padding: "3px",
    },
  },
}));

const Popover = styled(MuiPopover)(({ theme }) => ({
  overflow: "auto",
  "& .MuiPaper-root": {
    width: "284px",
    height: "560px",
    marginTop: "8px",
    padding: 0,
    backgroundColor: theme.palette.background.default,
    border: "1px solid",
    borderColor: "#818181",
    color: theme.palette.getContrastText(theme.palette.background.default),
    overflow: "hidden",
  },
  "& .MuiTabs-root": {
    backgroundColor: theme.palette.background.default,
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: "auto",
    width: "100%",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .MuiTab-root": {
      padding: 0,
      height: "auto",
      minHeight: "auto",
      alignItems: "start",
      width: "50%",
    },
    "& .Mui-selected": {
      color: theme.palette.getContrastText(theme.palette.background.default),
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },
  },
  "& div[role='tabpanel']": {
    padding: theme.spacing(0, 2),
    position: "absolute",
    top: "40px",
    left: 0,
    height: "-webkit-fill-available",
    width: "100%",
    marginBottom: "48px",
    overflowY: "auto",
  },
  "& .MuiStack-root": {
    backgroundColor: theme.palette.background.default,
    position: "absolute",
    bottom: 0,
    left: 0,
    justifyContent: "end",
    padding: theme.spacing(0, 2, 2, 2),
    width: "100%",
    "& .MuiButton-outlinedInherit": {
      borderColor: "#818181",
      backgroundColor: theme.palette.background.default,
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));
const BuilderButton = ({
  variant: _variant,
  startIcon: _startIcon,
  color: _color,
  label,
  anchorEl: _anchorEl,
  popOverWidth,
  popOverHeight,
  children,
  ...rest
}: BuilderButtonProps) => {
  const uniqueid = React.useMemo(() => crypto.randomUUID(), []);
  const open = Boolean(_anchorEl);
  const id = open ? `${label}-${uniqueid}-popover` : undefined;
  return (
    <>
      <Button
        aria-describedby={id}
        variant="outlined"
        color="primary"
        startIcon={
          label === "Table" ? (
            <DesignServicesOutlinedIcon />
          ) : (
            <FilterAltOutlinedIcon />
          )
        }
        endIcon={<KeyboardArrowDownOutlinedIcon />}
        {...rest}
        data-testid="BuilderButton"
      >
        {label}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={_anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        elevation={2}
        sx={{
          "& .MuiPaper-root": {
            width: popOverWidth,
            height: popOverHeight,
          },
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default BuilderButton;
