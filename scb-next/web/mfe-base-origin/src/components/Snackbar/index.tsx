import React, { ReactElement } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import {
  SnackbarCloseReason,
  SnackbarProps as MuiSnackbarProps,
} from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Root, { PREFIX } from "./common/style";
import { SxProps, Theme } from "@mui/material/styles";
import DOMPurify from "dompurify";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

export interface SnackbarProps extends MuiSnackbarProps {
  message?: React.ReactNode;
  variant?: AlertProps["variant"];
  severity?: AlertProps["severity"];
  alertsx?: SxProps<Theme>;
  action?: React.ReactNode;
  onClose?: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
}

const SnackBar: React.FC<SnackbarProps> = ({
  message,
  action,
  variant,
  severity,
  alertsx,
  ...rest
}: SnackbarProps): ReactElement => {
  return (
    <Root onClose={rest.onClose} data-testid={`${PREFIX}`} {...rest}>
      <Alert
        onClose={rest.onClose}
        variant={variant}
        severity={severity}
        sx={{ borderRadius: "6px", ...alertsx }}
      >
        <SnackbarContent
          message={
            <span
              style={{ width: "100%" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(`${message}`),
              }}
            />
          }
          action={action}
          sx={{
            background: "inherit",
            color: "inherit",
            boxShadow: "none",
            "& .MuiSnackbarContent-message": {
              maxHeight: "50px",
              overflowY: "auto",
              width: "100%",
              userSelect: "text",
              fontSize: "12px",
              fontWeight: 500,
              "& *": {
                userSelect: "text",
                fontSize: "12px",
                fontWeight: 500,
                wordBreak: "break-all",
              },
            },
          }}
        />
      </Alert>
    </Root>
  );
};

export default React.memo(SnackBar);
