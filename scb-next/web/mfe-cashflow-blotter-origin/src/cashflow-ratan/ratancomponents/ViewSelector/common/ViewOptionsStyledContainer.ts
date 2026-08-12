import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_view_options`;
export const classes = {
  title: `${PREFIX}-title`,
  column: `${PREFIX}-column`,
};

const ViewOptionsStyledContainer = styled("div")(
  css`
    .${classes.title} {
      background-color: var(--theme-color-modal-header);
      border-bottom: 1px solid var(--theme-color-modal-header-border);
      margin-bottom: 5px;
      .group-title,
      .group-data-title,
      .result-data-title {
        display: inline-block;
        padding: 10px 14px;
        box-sizing: border-box;
        font-size: 12px;

        .fa-question-circle {
          margin-left: 5px;
          cursor: pointer;
        }
      }
      .group-title {
        width: 250px;
        margin-right: 22px;
      }
      .group-data-title {
        width: 430px;
        margin-right: 25px;
      }
      .result-data-title {
        width: 320px;
        padding-left: 15px;
      }
    }

    .${classes.column} {
      display: flex;
      li {
        padding: 5px 0;
        border-bottom: 1px solid var(--theme-color-modal-filed-border);
        display: inline-block;
        width: 100%;
      }
      .group,
      .group-data,
      .result-data {
        position: relative;
        height: 418px;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 5px;
        font-size: 12px;
        li {
          line-height: 23px;
        }
      }
      .group {
        color: var(--theme-color-modal-light-font);
        width: 250px;
        margin-right: 20px;
        ul {
          padding: 0;
          margin: 0;
        }
        li {
          cursor: pointer;
        }
      }
      .group-data {
        color: var(--theme-color-modal-light-font);
        width: 430px;
      }
      .result-data {
        width: 320px;
        border: 1px solid var(--theme-color-modal-common-border);
        li {
          padding: 0.5px 5px;
        }
        .delete-btn {
          display: inline-block;
          margin-right: 5px;
        }
      }
      .arrow {
        height: 400px;
        width: 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          position: relative;
          left: -8px;
          width: 15px;
          height: 13px;
          border-right: 1px solid var(--theme-color-modal-common-border);
          border-bottom: 1px solid var(--theme-color-modal-common-border);
          transform: rotate(-30deg) skew(30deg);
        }
      }
    }
    .hide {
      display: none !important;
    }
    .group-active {
      color: var(--theme-color-font-color);
    }
    .no-fields {
      position: absolute;
      left: 30%;
      top: 52%;
      opacity: 0.5;
    }
    b {
      color: var(--theme-color-dialog-key-data);
    }
  `
);

export default ViewOptionsStyledContainer;
