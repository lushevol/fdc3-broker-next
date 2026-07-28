import { message } from "antd";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  aggridDeselectAll,
  updateCashflow,
} from "src/Cashflow_CN/Main/store/actions";

import { splitingCashflowAction } from "../../store/actions";
import { RootState } from "../../store/interface";
import { SplitActionType } from "./common/interface";
import { SplittingComponentDialog } from "./SplittingDialog/SplittingComponentDialog";

export const SplittingWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenSplittingDialog, sourceCashflow } = useSelector(
    (state: RootState) => state.splittingWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();

  const onClose = (isRefresh: boolean) => {
    dispatch(
      splitingCashflowAction({
        splitStatus: "INIT",
        isOpenSplittingDialog: false,
        isOpenLookUpSSIDialog: false,
        targetRowIndex: null,
        sourceCashflow: null,
        targetCashflows: null,
        initialTargetCashflows: null,
        amountSetting: null,
        splitAction: SplitActionType.COMPLETE_SPLIT,
      })
    );

    // @ts-ignore
    if (isRefresh) {
      dispatch(updateCashflow([sourceCashflow?.Cashflow?.Cashflow_Id ?? ""]));
      dispatch(aggridDeselectAll());
    }
  };

  return (
    <>
      {isOpenSplittingDialog && (
        <SplittingComponentDialog onClose={onClose} messageApi={messageApi} />
      )}
      {messageContextHolder}
    </>
  );
};
