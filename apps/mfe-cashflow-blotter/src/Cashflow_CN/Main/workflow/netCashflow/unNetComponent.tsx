import { message } from "antd";
import React, { FC, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  aggridDeselectAll,
  unNetCashflowAction,
  updateCashflow,
  updateVerifyUnNetCashflow,
} from "../../store/actions";

const ComponentCashflow = React.lazy(() =>
  // @ts-ignore
  System.import("@fm/ratan_cashflow").then((a) => {
    return a.ComponentCashflow;
  })
);

export const UnNetComponent: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenComponentCashflow, isVerify, data } = useSelector(
    (state: any) => state.unNetWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();

  const onQueryCashflow = (cashflowIds: string[], isPass?: boolean) => {
    if (isPass) {
      dispatch(updateVerifyUnNetCashflow(cashflowIds));
    } else {
      dispatch(updateCashflow(cashflowIds));
    }
    dispatch(aggridDeselectAll());
  };

  const onCloseComponentCashflow = () => {
    dispatch(
      unNetCashflowAction({
        isOpenComponentCashflow: false,
        isVerify: false,
        data: null,
      })
    );
  };

  return (
    <>
      {isOpenComponentCashflow && (
        <Suspense fallback={<></>}>
          <ComponentCashflow
            details={data}
            onQueryCashflow={onQueryCashflow}
            isUnNet={!isVerify}
            isUnNetVerify={isVerify}
            onClose={onCloseComponentCashflow}
            isCashflowSettlementCN={true}
            messageApi={messageApi}
          />
        </Suspense>
      )}
      {messageContextHolder}
    </>
  );
};
