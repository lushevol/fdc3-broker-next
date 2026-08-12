import { Grid } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_multi_exceptions_layout`;
export const classes = {
  item: `${PREFIX}-item`,
  gridRowWithAccordion: `${PREFIX}-accordion-in-grid`,
  itemLoadingWrapper: `${PREFIX}-grid-item-loading-wrapper`,
};

export const SPACE = "8px";

const Root = styled(Grid)(
  ({ theme }) =>
    css`
      padding-top: ${SPACE};
      .accordion-body {
        .ant-form {
          .custom-form-body {
            padding-left: 0;
            padding-right: 0;
          }
          .ant-form-item-control-input-content {
            .ant-select,
            .ant-picker {
              width: 100%;
            }
            // make text more clear to see
            .ant-input[disabled],
            .ant-select-disabled .ant-select-selector,
            .ant-picker .ant-picker-input > input[disabled] {
              color: ${theme.palette.mode === "dark"
                ? "#ffffffb3"
                : "#000000b3"};
              cursor: text;
            }
            .ant-checkbox-disabled .ant-checkbox-inner:after {
              border-color: ${theme.palette.mode === "dark"
                ? "#ffffffb3"
                : "#000000b3"};
            }
          }
        }
        .${classes.itemLoadingWrapper} {
          max-height: unset;
        }
      }
      .${classes.gridRowWithAccordion} {
        margin-bottom: ${SPACE};
        .MuiAccordion-root.Mui-expanded {
          height: 100%;
        }
      }
    `
);

export default Root;
