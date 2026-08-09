import React from "react";
import { styled } from "@mui/material/styles";
import Alert, { AlertProps } from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface SearchConditionProps extends AlertProps {
  label: string;
  value: string;
  onClose: (event: React.SyntheticEvent<Element, Event>) => void;
}

export const modeStyle = (mode: string) =>
  mode === "dark" ? "rgba(203, 203, 203, 1)" : "rgba(34,34,34, 1)";

const Root = styled(Alert)(({ theme }) => ({
  whiteSpace: "nowrap",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0.5, 1),
  width: "fit-content",
  marginBottom: theme.spacing(0.5),
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
    color: modeStyle(theme.palette.mode),
  },
  "& label": {
    marginRight: theme.spacing(0.5),
    fontWeight: 400,
    color: modeStyle(theme.palette.mode),
    fontSize: "10px",
  },
  "& div": {
    fontWeight: 600,
    fontSize: "11px",
    color: theme.palette.getContrastText(theme.palette.background.paper),
    whiteSpace: "break-spaces",
  },
}));

const SearchCondition: React.FC<SearchConditionProps> = ({
  label,
  value,
  onClose,
  ...rest
}: SearchConditionProps): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(true);

  const handleChange = (e: React.SyntheticEvent<Element, Event>) => {
    setOpen(false);
    onClose(e);
  };
  return open ? (
    <Root onClose={handleChange} {...rest}>
      <Stack direction="row">
        <Typography variant="body1" component="label">
          {label}
        </Typography>
        <Typography variant="body1" component="div">
          {value}
        </Typography>
      </Stack>
    </Root>
  ) : (
    <></>
  );
};

export default SearchCondition;
