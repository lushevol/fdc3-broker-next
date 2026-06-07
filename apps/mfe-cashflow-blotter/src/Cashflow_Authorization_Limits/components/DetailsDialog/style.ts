import { css, styled } from "@mui/material/styles";
import { MuiDialog } from "src/Root/import/ratancomponents";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_limitation-details-dialog`;
export const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  formItemContent: `${PREFIX}-form-item-content`,
};

const Root = styled(MuiDialog)(
  ({ theme }) =>
    () =>
      css`
        .${classes.root} {
          .${classes.form} {
            .${classes.formItemContent} {
              width: 100%;
            }
          }
        }
      `
);

export default Root;
