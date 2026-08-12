import { Button } from "antd";
import React, { FC, Suspense } from "react";
import { useDispatch } from "react-redux";

import { splitingCashflowAction } from "../../../store/actions";
import { SplitActionType } from "../common/interface";

export const canViewChildCashflow = (cashflowDetails: any) => {
  return cashflowDetails.Cashflow?.Splitting_Id;
};

interface ViewSplitChildComponentCashflowProps {
  details: CNCashflow;
}

export const ViewSplitChildComponentCashflow: FC<
  ViewSplitChildComponentCashflowProps
> = ({ details }) => {
  const dispatch = useDispatch();

  const onClick = async () => {
    dispatch(
      splitingCashflowAction({
        splitStatus: "INIT",
        isOpenSplittingDialog: true,
        sourceCashflow: details,
        targetCashflows: null,
        initialTargetCashflows: null,
        amountSetting: null,
        splitAction: SplitActionType.COMPONENT_SPLIT,
        isOpenLookUpSSIDialog: false,
        targetRowIndex: null,
      })
    );
  };

  return (
    <Suspense fallback={<></>}>
      <div className="component-cashflow-display-btn">
        <Button onClick={onClick} data-testid="component-cashflow-display-btn">
          Display Child Cashflow
        </Button>
      </div>
    </Suspense>
  );
};
