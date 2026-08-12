import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_quicksearch`;
export const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  formItem: `${PREFIX}-form-item`,
  btnItem: `${PREFIX}-button-item`,
};

const Root = styled("div")(
  () => () =>
    css`
      border-radius: 5px;
      border: 1px solid var(--theme-color-modal-port-border);
      padding: 0 10px;
      .${classes.form} {
        .${classes.formItem} {
          margin: 15px 5px 15px 10px;
          // .ant-form-item-row {
          //   .ant-form-item-label {
          //     width: 90px;
          //   }
          // }
        }
        .${classes.btnItem} {
          margin: 15px 10px 15px 20px;
        }
      }
    `
);

export default Root;
