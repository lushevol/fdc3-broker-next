import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_quicksearch`;
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
      .${classes.root} {
        display: flex;
        flex-wrap: wrap;
        /* padding: 5px 0 10px 10px; */
        max-width: 1600px;

        .item {
          margin-top: 5px;
          &.line {
            .field-label-children {
              width: auto;
            }
          }
        }

        .btn-wrap {
          margin-top: 10px;
          width: 100%;
          text-align: center;
        }

        .field-label-label {
          width: 225px !important;
          a {
            color: unset;
          }
        }
        .field-label-children {
          width: 225px !important;
        }
      }

      .query-btn {
        /* padding-left: 0;
          padding-right: 0; */
        /* width: 84px; */
        + .query-btn {
          margin-left: 10px;
        }
        height: 32px;
      }

      .query-select,
      .query-autocomplete {
        flex: 1;
        &.amount {
          flex: none;
          margin-right: 10px;
          width: 159px;
          .ant-select-selector {
            height: 23.38px;
          }
        }
      }

      .value-amount {
        width: 270px;
        color: ${highlight};
      }
      .value-currency {
        margin-left: 10px;
        width: 159px;
      }
      .value-amount-half {
        width: 120px;
        color: ${highlight};
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
