import cloneDeep from "lodash/cloneDeep";

import { WorkflowActionExtraOptions } from "../../common/interface";
import { updateCashflow, viewCashflowDetailsAction } from "../../store/actions";

export const isShowSwiftMessage = (data: any) => {
  return (
    data.Cashflow.Cashflow_State === "RELEASED" ||
    data.Cashflow.Cashflow_State === "SETTLED"
  );
};

export const openCashflowDetailDialog = (
  data: CNCashflow,
  defaultTabKey: string,
  options: WorkflowActionExtraOptions
) => {
  const { dispatch } = options;
  async function refreshCashflow() {
    const cashflowId = data?.Cashflow?.Cashflow_Id;
    if (cashflowId) {
      dispatch(
        viewCashflowDetailsAction({
          isOpenCashflowDetails: true,
          defaultTabKey,
          data: cloneDeep(data), // trigger graphql details refetch
          refreshCashflow,
        })
      );
      dispatch(updateCashflow([cashflowId]));
    }
  }
  dispatch(
    viewCashflowDetailsAction({
      isOpenCashflowDetails: true,
      defaultTabKey,
      data,
      refreshCashflow,
    })
  );
};
