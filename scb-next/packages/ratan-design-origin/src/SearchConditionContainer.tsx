import React from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import MuiFab from "@mui/material/Fab";
import MuiStack, { type StackProps } from "@mui/material/Stack";
import { darken, styled } from "@mui/material/styles";
import { newStyleTokens } from "./tokens/webkit.js";

const COLLAPSED_HEIGHT = "49px";
const LEGACY_ACTION_OFFSET = "8px";
const LEGACY_ACTION_SIZE = "30px";
const LEGACY_END_PADDING = "56px";

export const searchConditionContainerModeStyle = (mode: string) =>
  mode === "dark" ? "rgba(0, 0, 0, 1)" : "rgba(243, 243, 243, 1)";

export const searchConditionContainerBorderStyle = (mode: string) =>
  mode === "dark"
    ? "1px solid rgba(44, 63, 94, 1)"
    : "1px solid rgba(208, 208, 208, 1)";

const SearchConditionContainerRoot = styled(MuiStack)(({ theme }) => {
  const webkit = theme.ratan?.designGeneration === "webkit";

  return {
    position: "relative",
    backgroundColor: webkit
      ? newStyleTokens.color.surface
      : searchConditionContainerModeStyle(theme.palette.mode),
    padding: webkit ? newStyleTokens.spacing.small : theme.spacing(1),
    paddingBottom: webkit
      ? newStyleTokens.spacing.xsmall
      : theme.spacing(0.5),
    borderRadius: webkit ? newStyleTokens.radius.medium : theme.shape.borderRadius,
    border: webkit
      ? `1px solid ${newStyleTokens.color.border}`
      : searchConditionContainerBorderStyle(theme.palette.mode),
    paddingRight: webkit
      ? `calc(${newStyleTokens.spacing.xlarge} + ${newStyleTokens.spacing.large})`
      : LEGACY_END_PADDING,
    overflow: "hidden",
    "& .MuiFab-root": {
      position: "absolute",
      top: webkit ? newStyleTokens.spacing.small : LEGACY_ACTION_OFFSET,
      right: webkit ? newStyleTokens.spacing.small : LEGACY_ACTION_OFFSET,
      height: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      width: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      minHeight: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      minWidth: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      backgroundColor: webkit
        ? newStyleTokens.color.surfaceRaised
        : theme.palette.background.paper,
      color: webkit
        ? newStyleTokens.color.text
        : theme.palette.getContrastText(theme.palette.background.paper),
      boxShadow: webkit
        ? `0 0 ${newStyleTokens.spacing.small} 0 ${newStyleTokens.shadow.color}`
        : `0px 0px 8px 0px ${theme.palette.getContrastText(
            theme.palette.background.paper
          )}`,
      "&:hover": {
        backgroundColor: webkit
          ? newStyleTokens.color.surfaceSelected
          : darken(theme.palette.background.paper, 0.5),
        color: webkit
          ? newStyleTokens.color.text
          : theme.palette.getContrastText(
              darken(theme.palette.background.paper, 0.5)
            ),
      },
    },
  };
});

export const SearchConditionContainer = /*#__PURE__*/ React.forwardRef<
  HTMLDivElement,
  StackProps
>(function SearchConditionContainer(
  {
    spacing: _spacing,
    direction: _direction,
    useFlexGap: _useFlexGap,
    children,
    ...rest
  },
  ref
) {
  const [expanded, setExpanded] = React.useState(false);
  const handleFab = () => setExpanded((current) => !current);

  return (
    <SearchConditionContainerRoot
      ref={ref}
      spacing={1}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap" }}
      {...rest}
      style={{ height: expanded ? "auto" : COLLAPSED_HEIGHT }}
    >
      {children}
      <MuiFab
        color="primary"
        aria-label="expand"
        size="small"
        onClick={handleFab}
        data-testid="SearchConditionContainer-fab"
      >
        {expanded ? (
          <KeyboardDoubleArrowUpIcon />
        ) : (
          <KeyboardDoubleArrowDownIcon />
        )}
      </MuiFab>
    </SearchConditionContainerRoot>
  );
});
