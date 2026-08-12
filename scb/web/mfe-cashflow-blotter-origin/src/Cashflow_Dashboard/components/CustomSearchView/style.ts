import { css, styled } from "@mui/material/styles";
import { BreakPoint } from "src/Cashflow_CN/Main/style";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_CustomSearchView`;
export const classes = {
  selectheader: `${PREFIX}-section-header`,
  selector: `${PREFIX}-selector`,
};

const Root = styled("div")(
  ({ theme }) =>
    css`
      border-radius: 5px;
      border: 1px solid var(--theme-color-modal-port-border);
      padding: 0 15px;
      .${classes.selector} {
        padding: 13px 10px;
        ${theme.breakpoints.down(BreakPoint.Laptop)} {
          padding: 10px 5px;
        }
        .filter-selector {
          margin-top: 5px;
          .filter-btn {
            margin-left: 10px;
          }
        }
        .MuiBox-root {
          .MicroWebUI_ratan_container_advanced_search_entry_selector-selector {
            width: 150px;
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
      }
      .${classes.selectheader} {
        font-size: 14px;
        padding: 5px 10px;
        text-align: left;
        color: var(--theme-color-panel-font);
        background-color: var(--theme-color-panel-header);
        border-bottom: 1px solid var(--theme-color-modal-header-border);
        font-weight: 600;
        font-family: "Poppins";
        border-radius: 5px 5px 0 0;
      }
    `
);

export default Root;
