import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CashflowDetailsDialog from "src/Cashflow_CN/components/CashflowDetails";
import { CASHFLOW_DETAILS_TAB } from "src/Cashflow_CN/components/CashflowDetails/detailsBody";
import CashflowNotificationDialogWrap from "src/Cashflow_CN/components/CashflowNotification/dialogWrap";

import {
  updateCashflow,
  updateVerifyUnNetCashflow,
  viewCashflowDetailsAction,
} from "../../store/actions";
import { RootState } from "../../store/interface";
import { openTradeDetailsDialog } from "../viewTradeDetails/viewTradeDetailsRightMenu";
import { CashflowDetailsContext } from "./CashflowDetailsContext";

export const CashflowDetailsWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenCashflowDetails, defaultTabKey, data, refreshCashflow } =
    useSelector((state: RootState) => state.viewCashflowDetailsWorkflow);
  const opensearch = useSelector((state: RootState) => state.opensearch);
  const contextValue = useMemo(() => ({ opensearch }), []);

  const onCloseCashflowDetailDialog = useCallback(() => {
    dispatch(
      viewCashflowDetailsAction({
        isOpenCashflowDetails: false,
        defaultTabKey: CASHFLOW_DETAILS_TAB,
        data: null,
        refreshCashflow: async () => {},
      })
    );
  }, []);

  const onQueryCashflow = useCallback(
    (cashflowIds: string[], isPass?: boolean) => {
      if (isPass) {
        dispatch(updateVerifyUnNetCashflow(cashflowIds));
      } else {
        dispatch(updateCashflow(cashflowIds));
      }
    },
    []
  );

  const handleOpenTradeDetails = async () => {
    openTradeDetailsDialog(data, { dispatch });
  };

  return isOpenCashflowDetails ? (
    <CashflowNotificationDialogWrap active={isOpenCashflowDetails}>
      <CashflowDetailsContext.Provider value={contextValue}>
        <CashflowDetailsDialog
          isOpen={isOpenCashflowDetails}
          details={data}
          onClose={onCloseCashflowDetailDialog}
          defaultActiveKey={defaultTabKey}
          refreshCashflow={refreshCashflow}
          onOpenTradeDetails={handleOpenTradeDetails}
          onQueryCashflow={onQueryCashflow}
        />
      </CashflowDetailsContext.Provider>
    </CashflowNotificationDialogWrap>
  ) : (
    <></>
  );
};
