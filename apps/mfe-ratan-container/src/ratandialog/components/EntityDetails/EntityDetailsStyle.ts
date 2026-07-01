import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_entity_details`;
export const classes = {
  viewSelector: `${PREFIX}-view-selector`,
  selector: `${PREFIX}-selector`,
  viewBtn: `${PREFIX}-view-btn`,
};

const Root = styled("div")(
  ({ theme, className }) =>
    () =>
      css`
        ${className} {
          max-width: 100%;
          min-height: 20px;
          min-width: 400px;
          .entity-details-popover-name {
            display: flex;
            padding-top: 5px;
            color: var(--base-color-grey-light);
            font-size: 11px;
            position: relative;
            line-height: 2;
            &::after {
              content: "";
              flex: 1;
              margin-left: 5px;
              margin-top: 9px;
              display: inline-block;
              height: 1px;
              background: rgba(128, 142, 153, 0.3);
            }
          }
          .entity-details-popover-item {
            line-height: 1.6;
            font-size: 11px;
            color: var(--theme-color-popover-value);
          }
          .entity-details-popover-label {
            padding-right: 10px;
            color: var(--theme-color-popover-label);
          }
        }
      `
);

export default Root;
