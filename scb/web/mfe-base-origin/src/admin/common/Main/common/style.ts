import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_Main`;
export const classes = {
  root: `${PREFIX}-root`,
  grid: `${PREFIX}-grid`,
};

const Root = styled(Box)(() => ({
  [`&.${classes.root}`]: {
    width: "100%",
  },
  [`& .${classes.grid}`]: {
    "& .MuiDataGrid-row": {
      border: 0,
      marginBottom: 0,
    },
    "& .MuiDataGrid-cell": {
      borderLeft: 0,
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
      border: "0px !important",
    },
    "& .MuiDataGrid-filterForm": {
      "& .MuiFormControl-root": {
        marginTop: 0,
      },
    },
  },
}));

export default Root;
