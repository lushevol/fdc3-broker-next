import React from "react";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { newStyleTokens } from "./tokens/webkit.js";

export interface SearchConditionProps extends AlertProps {
  label: string;
  value: string;
  onClose: (event: React.SyntheticEvent<Element, Event>) => void;
}

export const searchConditionModeStyle = (mode: string) =>
  mode === "dark" ? "rgba(203, 203, 203, 1)" : "rgba(34,34,34, 1)";

const SearchConditionRoot = styled(MuiAlert)(({ theme }) => {
  const webkit = theme.ratan?.designGeneration === "webkit";
  const textColor = webkit
    ? newStyleTokens.color.text
    : searchConditionModeStyle(theme.palette.mode);

  return {
    whiteSpace: "nowrap",
    backgroundColor: webkit
      ? newStyleTokens.color.surface
      : theme.palette.background.paper,
    padding: webkit
      ? `${newStyleTokens.spacing.xsmall} ${newStyleTokens.spacing.small}`
      : theme.spacing(0.5, 1),
    width: "fit-content",
    marginBottom: webkit
      ? newStyleTokens.spacing.xsmall
      : theme.spacing(0.5),
    height: "fit-content",
    "& .MuiAlert-message": {
      padding: "3px 5px",
    },
    "& .MuiAlert-action": {
      padding: "3px 5px",
    },
    "& .MuiAlert-icon": {
      display: "none",
    },
    "& .MuiIconButton-root": {
      padding: 0,
      color: textColor,
    },
    "& label": {
      marginRight: webkit
        ? newStyleTokens.spacing.xsmall
        : theme.spacing(0.5),
      fontWeight: 400,
      color: textColor,
      fontSize: "10px",
    },
    "& div": {
      fontWeight: 600,
      fontSize: "11px",
      color: webkit
        ? newStyleTokens.color.textHeading
        : theme.palette.getContrastText(theme.palette.background.paper),
      whiteSpace: "break-spaces",
    },
  };
});

export const SearchCondition = /*#__PURE__*/ React.forwardRef<
  HTMLDivElement,
  SearchConditionProps
>(function SearchCondition({ label, value, onClose, ...rest }, ref) {
  const [open, setOpen] = React.useState(true);

  const handleChange = (event: React.SyntheticEvent<Element, Event>) => {
    setOpen(false);
    onClose(event);
  };

  if (!open) return null;

  return (
    <SearchConditionRoot ref={ref} onClose={handleChange} {...rest}>
      <Stack direction="row">
        <Typography variant="body1" component="label">
          {label}
        </Typography>
        <Typography variant="body1" component="div">
          {value}
        </Typography>
      </Stack>
    </SearchConditionRoot>
  );
});
