import { notification } from "antd";
import { FC, memo, useEffect } from "react";
import MfeThemeProvider from "src/Root/common/component/MfeThemeProvider";

import CashflowNotificationPool from "./CashflowNotificationPool";
import { notificationDebugger } from "./debugger";
import {
  CashflowNotificationComponentProps,
  NotifiedCashflow,
} from "./interface";
import { subscribeCashflowNotification } from "./stomp";
import { useReconnectNotification } from "./useReconnectNotification";
import { isCashflow } from "./utils";
export { matchFilters } from "./graphqlFilterMatcher";
export { isCashflowUpdated, isSameCashflow } from "./utils";
import { getUser } from "src/Root/import/ratanutils";

const CashflowNotification: FC<CashflowNotificationComponentProps> = memo(
  ({ onCashflowComming, id }) => {
    const [notificationApi, notificationContextHolder] =
      notification.useNotification();
    const { popReconnectNotification } =
      useReconnectNotification(notificationApi);
    const { id: userName } = getUser();
    useEffect(() => {
      const { add } = notificationDebugger();
      const TOPIC = `/user/${userName}/cashflow/notification`;
      const notificationPool = new CashflowNotificationPool<NotifiedCashflow>({
        recordKey: "Cashflow_Id",
      });
      window.notificationPool = notificationPool;
      const clearNotification = subscribeCashflowNotification(
        TOPIC,
        id,
        (message) => {
          if (isCashflow(message?.Cashflow))
            notificationPool.add(message as unknown as NotifiedCashflow);
          add(message);
        },
        () => {
          notificationPool.unsubscribeAll();
          notificationPool.subscribe((cashflows) => {
            if (cashflows.length) onCashflowComming(cashflows);
          });
        },
        (_frame, reconnectCallback) => {
          popReconnectNotification(reconnectCallback, id);
        }
      );
      return () => {
        clearNotification();
        notificationPool.destory();
      };
    }, []);
    return <MfeThemeProvider>{notificationContextHolder}</MfeThemeProvider>;
  }
);

export default CashflowNotification;
