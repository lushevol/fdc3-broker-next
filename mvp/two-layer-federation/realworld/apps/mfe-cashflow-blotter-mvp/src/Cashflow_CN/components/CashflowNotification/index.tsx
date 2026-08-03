import React, { FC, memo, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  notificationUpdateOrAddingCashflows,
  setLatestNotificationStack,
} from "src/Cashflow_CN/Main/store/actions/cashflowAction";
import { generateRandomString } from "src/Cashflow_CN/Main/utils";

import CashflowNotificationSubscriber from "./CashflowNotificationSubscriber";
import { NotifiedCashflow } from "./CashflowNotificationSubscriber/interface";

const CashflowNotification: FC = memo(() => {
  const dispatch = useDispatch<any>();
  const id = useRef(generateRandomString());
  const handleIncomingUpdatedCashflows = useCallback(
    (cashflows: NotifiedCashflow[]) => {
      dispatch(notificationUpdateOrAddingCashflows(cashflows));
      dispatch(setLatestNotificationStack(cashflows));
    },
    []
  );
  return (
    <CashflowNotificationSubscriber
      onCashflowComming={handleIncomingUpdatedCashflows}
      id={id.current}
    />
  );
});

export default CashflowNotification;
