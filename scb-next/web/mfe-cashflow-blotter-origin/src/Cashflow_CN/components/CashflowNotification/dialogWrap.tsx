import { Button, Typography } from "@mui/material";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeNotificationDialogWrap } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { CASHFLOW_DETAILS_NOTIFICATION_REFRESH_BTN } from "src/Root/analysis/const";

import AlertWrap from "./style";

export const LEVEL2_NOTIFICATION_DOM_ANCHOR = "level2-notification-dom-anchor";

const CashflowNotificationDialogWrap: FC<
  PropsWithChildren<{ active?: boolean }>
> = ({ active, children }) => {
  const { showAlert, onClickRefresh } = useSelector(
    (state: RootState) => state.dialogRefreshAlert
  );
  const dispatch = useDispatch<any>();
  const [mountAlertAnchor, setMountAlertAnchor] = useState<Element>();
  useEffect(() => {
    if (active) {
      if (showAlert) {
        // mount wrap
        const dialogDomAnchor = document.querySelector(
          `.${LEVEL2_NOTIFICATION_DOM_ANCHOR}`
        );
        if (dialogDomAnchor) setMountAlertAnchor(dialogDomAnchor);
        else setMountAlertAnchor(undefined);
      } else {
        // unmount wrap
        setMountAlertAnchor(undefined);
      }
    } else {
      dispatch(closeNotificationDialogWrap());
    }
  }, [active, showAlert]);

  useEffect(() => {
    return () => dispatch(closeNotificationDialogWrap());
  }, []);

  return (
    <>
      {children}
      {mountAlertAnchor &&
        createPortal(
          <AlertWrap data-testid="cashflow-notification-dialog-wrap">
            <Typography variant="h6" gutterBottom>
              Current Cashflow has been updated
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              The cashflow you are viewing is out of date, please click refresh
              to get the latest data.
            </Typography>
            <Button
              variant="contained"
              onClick={() => onClickRefresh(["hidemodal", "refresh"])}
              data-testid={CASHFLOW_DETAILS_NOTIFICATION_REFRESH_BTN}
            >
              Refresh
            </Button>
          </AlertWrap>,
          mountAlertAnchor
        )}
    </>
  );
};

export default CashflowNotificationDialogWrap;
