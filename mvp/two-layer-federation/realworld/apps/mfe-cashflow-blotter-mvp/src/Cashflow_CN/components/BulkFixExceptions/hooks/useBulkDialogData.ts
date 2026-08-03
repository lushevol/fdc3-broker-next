import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { queryCashFlowDetailsForBulkFixExceptions } from "src/Cashflow_CN/services/graphql";
import { ExceptionBundleActionResult } from "src/Cashflow_CN/services/type";

import {
  BulkResultStatus,
  BulkUserType,
  CashflowEligibleResult,
} from "../type";
import {
  assignNotificationToCashflowDisplay,
  assignResultToCashflowDisplay,
  cashflowEligibleFilter,
  findActiveBackValueDateException,
  findAffirmationException,
  setInitResultStatusToCashflowDisplay,
  setProcessingToCashflowDisplay,
} from "../utils/filter";

const emptyCashflowEligibleResult: CashflowEligibleResult = {
  eligibleForBulk: {
    cashflows: [],
  },
  insufficientForBulk: {
    cashflows: [],
  },
};

type classifyCashflowsResult = {
  cashflowIdsWithAfirmationException: string[];
  cashflowIdsWithBackValueDateException: string[];
  classifiedCashflows: CashflowEligibleResult;
};
export const classifyCashflows = async (
  cashflowsReadyToFix: CNCashflow[],
  userType: BulkUserType,
  opensearch: boolean
): Promise<classifyCashflowsResult> => {
  try {
    if (cashflowsReadyToFix.length) {
      const detailCashflows = await queryCashFlowDetailsForBulkFixExceptions(
        cashflowsReadyToFix
          .map((c) => c.Cashflow?.Cashflow_Id)
          .filter(Boolean) as string[],
        userType === BulkUserType.Checker,
        opensearch
      );
      const res = cashflowEligibleFilter(
        detailCashflows.graphCashFlowDetails,
        userType
      );
      return {
        cashflowIdsWithAfirmationException: res.eligibleForBulk.cashflows
          .filter((c) => !!findAffirmationException(c.exceptions))
          .map((c) => c.cashflowId + ""),
        cashflowIdsWithBackValueDateException: res.eligibleForBulk.cashflows
          .filter((c) => !!findActiveBackValueDateException(c.exceptions))
          .map((c) => c.cashflowId + ""),
        classifiedCashflows: res,
      };
    }
  } catch (error) {}
  return {
    cashflowIdsWithAfirmationException: [],
    cashflowIdsWithBackValueDateException: [],
    classifiedCashflows: emptyCashflowEligibleResult,
  };
};

export const useBulkDialogData = () => {
  const [isClassifyLoading, setIsClassifyLoading] = useState(false);
  const { cashflowsReadyToFix, userType } = useSelector(
    (state: RootState) => state.bulkFixExceptions
  );
  const opensearch = useSelector((state: RootState) => state.opensearch);
  const [classifiedCashflows, setClassifiedCashflows] =
    useState<CashflowEligibleResult>(emptyCashflowEligibleResult);
  const [
    cashflowIdsWithAfirmationException,
    setCashflowIdsWithAfirmationException,
  ] = useState<string[]>([]);
  const [
    cashflowIdsWithBackValueDateException,
    setCashflowIdsWithBackValueDateException,
  ] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setIsClassifyLoading(true);
      const {
        cashflowIdsWithAfirmationException: h,
        cashflowIdsWithBackValueDateException: b,
        classifiedCashflows: c,
      } = await classifyCashflows(cashflowsReadyToFix, userType, opensearch);
      setCashflowIdsWithAfirmationException(h);
      setCashflowIdsWithBackValueDateException(b);
      setClassifiedCashflows(c);
      setIsClassifyLoading(false);
    })();
  }, [cashflowsReadyToFix, userType]);

  const onActionResultHandler = useCallback(
    async (
      selectedCashflowIds: string[],
      resultPromise: Promise<ExceptionBundleActionResult[]>
    ) => {
      try {
        setClassifiedCashflows((cc) => ({
          ...cc,
          eligibleForBulk: {
            ...cc.eligibleForBulk,
            cashflows: cc.eligibleForBulk.cashflows.map((c) =>
              selectedCashflowIds.includes(c.cashflowId + "")
                ? setProcessingToCashflowDisplay(c)
                : c
            ),
          },
        }));
        const result = await resultPromise;
        setClassifiedCashflows((cc) => {
          return {
            ...cc,
            eligibleForBulk: {
              ...cc.eligibleForBulk,
              cashflows: assignResultToCashflowDisplay(
                cc.eligibleForBulk.cashflows,
                result
              ),
            },
          };
        });
        return result;
      } catch (error) {
        setClassifiedCashflows((cc) => ({
          ...cc,
          eligibleForBulk: {
            ...cc.eligibleForBulk,
            cashflows: cc.eligibleForBulk.cashflows.map((c) =>
              selectedCashflowIds.includes(c.cashflowId + "") &&
              c.bulkActionResult.status !== BulkResultStatus.NotificationUpdated
                ? setInitResultStatusToCashflowDisplay(c)
                : c
            ),
          },
        }));
      }
      return [];
    },
    []
  );

  const onNotificationCashflowUpdateHandler = useCallback(
    (notificationCashflows: CNCashflow[]) => {
      setClassifiedCashflows((cc) => {
        const updatedEligibleCashflows = notificationCashflows.filter((c) =>
          cc.eligibleForBulk.cashflows.find(
            (i) => i.cashflowId === c.Cashflow?.Cashflow_Id
          )
        );
        if (updatedEligibleCashflows.length) {
          return {
            ...cc,
            eligibleForBulk: {
              ...cc.eligibleForBulk,
              cashflows: assignNotificationToCashflowDisplay(
                cc.eligibleForBulk.cashflows,
                updatedEligibleCashflows,
                userType
              ),
            },
          };
        }
        return cc;
      });
    },
    [userType]
  );

  return {
    isClassifyLoading,
    cashflowsReadyToFix,
    classifiedCashflows,
    cashflowIdsWithAfirmationException,
    cashflowIdsWithBackValueDateException,
    onActionResultHandler,
    onNotificationCashflowUpdateHandler,
  };
};
