import { Box } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_cashflow_notification_dialog_alert_wrap`;
export const classes = {};

const AlertWrap = styled(Box)(
  ({ theme }) =>
    () =>
      css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${theme.palette.mode === "dark"
          ? "#000000cc"
          : "#ffffffcc"};
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        backdrop-filter: blur(1px);
      `
);

export default AlertWrap;
