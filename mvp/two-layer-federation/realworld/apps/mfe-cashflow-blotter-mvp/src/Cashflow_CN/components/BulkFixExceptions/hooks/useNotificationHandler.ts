import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

export const useNotificationHandler = ({
  onNotificationComes,
}: {
  onNotificationComes: (cashflows: CNCashflow[]) => void;
}) => {
  const latestNotificationStack = useSelector(
    (state: RootState) => state.latestNotificationStack
  );
  const { cashflowsReadyToFix } = useSelector(
    (state: RootState) => state.bulkFixExceptions
  );
  const consumedNotificationStackId = useRef("");

  useEffect(() => {
    (async () => {
      if (
        consumedNotificationStackId.current !== latestNotificationStack.id &&
        latestNotificationStack.pool.length
      ) {
        onNotificationComes(
          latestNotificationStack.pool.map((i) => i.Cashflow)
        );
        consumedNotificationStackId.current = latestNotificationStack.id;
      }
    })();
  }, [cashflowsReadyToFix, latestNotificationStack]);
};
