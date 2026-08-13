import React from "react";
import { darken, styled } from "@mui/material/styles";
import Stack, { StackProps } from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

export const modeStyle = (mode: string) =>
  mode === "dark" ? "rgba(0, 0, 0, 1)" : "rgba(243, 243, 243, 1)";

export const modeBorderStyle = (mode: string) =>
  mode === "dark"
    ? "1px solid rgba(44, 63, 94, 1)"
    : "1px solid rgba(208, 208, 208, 1)";

const Root = styled(Stack)(({ theme }) => ({
  position: "relative",
  backgroundColor: modeStyle(theme.palette.mode),
  padding: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: modeBorderStyle(theme.palette.mode),
  paddingRight: "56px",
  overflow: "hidden",
  "& .MuiFab-root": {
    position: "absolute",
    top: "8px",
    right: "8px",
    height: "30px",
    width: "30px",
    minHeight: "30px",
    minWidth: "30px",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    boxShadow: `0px 0px 8px 0px ${theme.palette.getContrastText(
      theme.palette.background.paper
    )}`,
    "&:hover": {
      backgroundColor: darken(theme.palette.background.paper, 0.5),
      color: theme.palette.getContrastText(
        darken(theme.palette.background.paper, 0.5)
      ),
    },
  },
}));

const SearchConditionContainer: React.FC<StackProps> = ({
  spacing: _spacing,
  direction: _direction,
  useFlexGap: _useFlexGap,
  children,
  ...rest
}: StackProps): React.ReactElement => {
  const [expanded, setExpanded] = React.useState(false);
  const handleFab = () => setExpanded((p) => !p);
  return (
    <Root
      spacing={1}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap" }}
      {...rest}
      style={{ height: expanded ? "auto" : "49px" }}
    >
      {children}
      <Fab
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
      </Fab>
    </Root>
  );
};

export default SearchConditionContainer;
