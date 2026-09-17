import type { Theme } from "@mui/material/styles";

export const InputStyled =
  (c: { left: string }) =>
  ({ theme }: { theme: Theme }) => ({
    margin: 0,
    width: "auto",
    [`&.${c.left}`]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& .MuiFormLabel-root": {
        marginRight: theme.spacing(1),
        marginBottom: 0,
      },
    },
    "& .MuiFormControl-root": {
      margin: 0,
    },
    "& .MuiOutlinedInput-root": {
      margin: 0,
    },
    "& .MuiFormLabel-root": {
      position: "static",
      fontSize: "inherit",
      transformOrigin: "center left",
      textOverflow: "inherit",
      overflow: "inherit",
      transform: "none",
      textTransform: "capitalize",
      marginRight: 0,
      marginBottom: theme.spacing(1),
      backgroundColor: "transparent!important",
    },
    "& legend": {
      display: "none",
    },
  });
