import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_splitting_quicksearch`;
export const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  body: `${PREFIX}-body`,
};

const highlight = "var(--theme-color-field-label)";

const Root = styled("div")(
  () => () =>
    css`
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
      padding-left: 30px;
      .${classes.root} {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        align-items: center;
        .item {
          margin-top: 5px;
          &.line {
            .field-label-children {
              width: auto;
            }
          }
          height: 32px;
        }
        .btn-wrap {
          flex: 1;
          margin-top: 5px;
          margin-left: 60px;
          text-align: left;
        }
        .query-btn {
          + .query-btn {
            margin-left: 10px;
          }
        }

        .field-label-label {
          width: 130px !important;
          a {
            color: unset;
          }
        }
        .field-label-children {
          width: 200px !important;
        }
      }

      .query-select,
      .query-autocomplete {
        flex: 1;
      }

      .value-currency {
        margin-left: 10px;
        width: 159px;
      }

      .line-icon {
        position: relative;
        width: 30px;
        display: inline-block;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 10px;
          width: 10px;
          height: 1px;
          background-color: var(--theme-color-modal-label);
        }
      }

      .ant-input,
      .ant-select {
        color: ${highlight};
        overflow: hidden;
        text-overflow: ellipsis;
        .ant-select-selection-item {
          color: ${highlight};
        }
      }
      .ant-picker-input {
        input {
          color: ${highlight};
        }
      }
      .ant-input-number {
        .ant-input-number-input {
          color: ${highlight};
        }
      }
    `
);

export default Root;
