import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { queryCashflow } from "src/Cashflow_CN/services/graphql";

import { openSettlementMethodUpdateDialogAction } from "../../../store/actions";
import {
  CashflowEligibleResult,
  SettlementMethodUpdateResponse,
} from "../type";
import {
  assignResultToCashflowDisplay,
  cashflowEligibleFilter,
  queryGraqlFilter,
} from "../utils/filter";
import {
  setInitResultStatusToCashflowDisplay,
  setProcessingToCashflowDisplay,
} from "../utils/utils";

const emptyCashflowEligibleResult: CashflowEligibleResult = {
  eligibleForUpdate: { cashflows: [] },
  insufficientForUpdate: { cashflows: [] },
};

/**
 * Fetches all cashflows by trade for the given cashflow list.
 */
export const getCashflowsByTrade = async (
  data: CNCashflow[]
): Promise<CNCashflow[]> => {
  if (!data.length) return [];
  try {
    const filters = queryGraqlFilter(data);
    const columnDefs = [{ field: "Cashflow.Cashflow_Id" }];
    const detailCashflows = await queryCashflow({
      filters,
      columnDefs,
      requireMandatoryFields: true,
      disabledDefault: true,
    });
    const result = detailCashflows.cashflowUltraQuery.results;
    return result;
  } catch (error) {
    throw new Error("Error occurred while query cashflows");
  }
};

/**
 * Classifies cashflows into eligible and insufficient groups.
 */
export const classifyCashflows = (
  data: CNCashflow[]
): CashflowEligibleResult => {
  if (!data.length) return emptyCashflowEligibleResult;
  return cashflowEligibleFilter(data);
};

export const useDialogData = () => {
  const dispatch = useDispatch();
  const [isClassifyLoading, setIsClassifyLoading] = useState(false);
  const { cashflowData } = useSelector(
    (state: RootState) => state.settlementMethodUpdateWorkflow
  );
  const [classifiedCashflows, setClassifiedCashflows] =
    useState<CashflowEligibleResult>(emptyCashflowEligibleResult);

  useEffect(() => {
    let isCancelled = false;
    const loadCashflows = async () => {
      setIsClassifyLoading(true);
      try {
        const allCashflows = await getCashflowsByTrade(cashflowData);

        if (isCancelled) return;
        if (allCashflows.length) {
          dispatch(
            openSettlementMethodUpdateDialogAction({
              isOpenDialog: true,
              cashflowData,
              cashflowDataByTrade: allCashflows,
            })
          );
        }
        setClassifiedCashflows(classifyCashflows(allCashflows));
      } catch (error) {
        console.error("Settlement Method Update loadCashflows failed:", error);
        setClassifiedCashflows(emptyCashflowEligibleResult);
      } finally {
        if (!isCancelled) setIsClassifyLoading(false);
      }
    };

    loadCashflows();
    return () => {
      isCancelled = true;
    };
  }, [cashflowData]);

  /**
   * Handles the lifecycle of the async update task:
   *   1. Immediately mark selected cashflows as "processing"
   *   2. Await the result promise
   *   3. On success: assign per-cashflow result (success / failure) to display state
   *   4. On error: revert non-notification-updated cashflows back to initial status
   */
  const onActionResultHandler = useCallback(
    async (
      selectedCashflowIds: string[],
      resultPromise: Promise<SettlementMethodUpdateResponse[]>
    ): Promise<SettlementMethodUpdateResponse[]> => {
      setClassifiedCashflows((prevClassified) => ({
        ...prevClassified,
        eligibleForUpdate: {
          ...prevClassified.eligibleForUpdate,
          cashflows: prevClassified.eligibleForUpdate.cashflows.map(
            (cashflow) =>
              selectedCashflowIds.includes(cashflow.cashflowId + "")
                ? setProcessingToCashflowDisplay(cashflow)
                : cashflow
          ),
        },
      }));
      try {
        const result = await resultPromise;
        setClassifiedCashflows((prevClassified) => ({
          ...prevClassified,
          eligibleForUpdate: {
            ...prevClassified.eligibleForUpdate,
            cashflows: assignResultToCashflowDisplay(
              prevClassified.eligibleForUpdate.cashflows,
              result
            ),
          },
        }));

        return result;
      } catch (error) {
        setClassifiedCashflows((prevClassified) => ({
          ...prevClassified,
          eligibleForUpdate: {
            ...prevClassified.eligibleForUpdate,
            cashflows: prevClassified.eligibleForUpdate.cashflows.map(
              (cashflow) =>
                selectedCashflowIds.includes(cashflow.cashflowId + "")
                  ? setInitResultStatusToCashflowDisplay(cashflow)
                  : cashflow
            ),
          },
        }));
      }
      return [];
    },
    []
  );

  return {
    isClassifyLoading,
    classifiedCashflows,
    onActionResultHandler,
  };
};
