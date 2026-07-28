import { css, styled } from "@mui/material/styles";
import { BreakPoint } from "src/Cashflow_CN/Main/style";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_CustomSearchView`;
export const classes = {
  selector: `${PREFIX}-selector`,
};

const Root = styled("div")(
  ({ theme }) =>
    css`
      .${classes.selector} {
        padding: 10px 25px;
        ${theme.breakpoints.down(BreakPoint.Laptop)} {
          padding: 10px 5px;
        }

        .MicroWebUI_ratan_container_advanced_search_entry_selector-selector,
        .MicroWebUI_ratan_container_view_selector-selector {
          width: 5rem !important;
        }

        .filter-selector {
          margin-top: 5px;
          .filter-btn {
            margin-left: 10px;
          }
        }

        .ant-space {
          .ant-space-item {
            &:first-child {
              flex: 1;
            }
            &:nth-child(3) {
              .MuiButton-root {
                ${theme.breakpoints.down(BreakPoint.Laptop)} {
                  width: 68px;
                  min-width: 65px;
                }
              }
            }
          }
        }

        .view-options {
          a {
            color: unset;
          }
        }
      }
    `
);

export default Root;
