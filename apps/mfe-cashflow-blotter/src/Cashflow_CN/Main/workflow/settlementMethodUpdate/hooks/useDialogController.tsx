import { AnyAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { closeSettlementMethodUpdateDialogAction } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

import { BULK_UPDATE_LIMIT, handleDialogTitle } from "../utils/utils";

type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

const initDialogTitle = "Settlement Method Update";
export const useDialogController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { isOpenDialog, cashflowData, cashflowDataByTrade } = useSelector(
    (state: RootState) => state.settlementMethodUpdateWorkflow
  );
  const [title, setTitle] = useState<ReactNode>(initDialogTitle);
  const [isLimit, setIsLimit] = useState<boolean>(false);
  const closeDialog = useCallback(() => {
    return dispatch(closeSettlementMethodUpdateDialogAction());
  }, []);

  useEffect(() => {
    const isExceedingLimit = cashflowDataByTrade.length > BULK_UPDATE_LIMIT;
    const hasDifferentLengths =
      cashflowData.length !== cashflowDataByTrade.length;
    const dialogTitle = hasDifferentLengths
      ? handleDialogTitle(cashflowDataByTrade)
      : initDialogTitle;

    if (isExceedingLimit) {
      messageApi.error(
        `Limitation for bulk update is ${BULK_UPDATE_LIMIT} cashflow/trade records, please select no more than ${BULK_UPDATE_LIMIT} records`
      );
    }
    setIsLimit(isExceedingLimit);
    setTitle(dialogTitle);
  }, [cashflowData, cashflowDataByTrade]);

  return {
    isOpenDialog,
    closeDialog,
    title,
    isLimit,
    messageApi,
    messageContextHolder,
  };
};
