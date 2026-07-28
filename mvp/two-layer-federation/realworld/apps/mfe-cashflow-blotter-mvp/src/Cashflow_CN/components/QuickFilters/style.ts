import { css, styled } from "@mui/material/styles";
import { BreakPoint } from "src/Cashflow_CN/Main/style";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_quickfilters`;
export const classes = {
  root: `${PREFIX}-root`,
  dropdowns: `${PREFIX}-dropdowns`,
  dropdownItem: `${PREFIX}-dropdowns-item`,
  highlight: `${PREFIX}-highlight`,
};

const Root = styled("div")(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    .${classes.dropdowns} {
      display: flex;
      flex-wrap: wrap;
      row-gap: 10px;
      column-gap: 10px;
      .${classes.highlight} {
        .MuiInputLabel-root {
          color: ${theme.palette.warning.main};
        }
        .MuiOutlinedInput-notchedOutline {
          border-color: ${theme.palette.warning.main};
          border-width: 2px;
        }
      }
      .${classes.dropdownItem} {
        ${theme.breakpoints.down(BreakPoint.Laptop)} {
          min-width: 165px;
          max-width: 300px;
        }
        ${theme.breakpoints.up(BreakPoint.Laptop)} {
          min-width: 190px;
          max-width: 250px;
        }
        .MuiSelect-select {
          padding: 6px 14px;
        }
      }
    }
  `
);

export default Root;
