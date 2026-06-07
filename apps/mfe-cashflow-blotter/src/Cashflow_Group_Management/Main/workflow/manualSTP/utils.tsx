import { BlotterDataType } from "../../store/interface";

export const isBlotterRowsContainsInvalidTradeStatus = (
  datas: BlotterDataType[]
) => {
  return datas.some((d) => !d.Is_Trade_Validated);
};

export const getManualSTPWarningContent = (datas: BlotterDataType[]) => {
  const hasInvalid = isBlotterRowsContainsInvalidTradeStatus(datas);
  return (
    <span>
      <p>Please only perform bulk manual STP when informed by support team.</p>
      <p>
        Total {datas.length} cashflow(s) selected. Please be aware you're trying
        to manual proceed the cashflows with below exceptions,
      </p>
      <p>1. The siblings cashflows are not recieved by Ratan yet.</p>
      <p>
        {hasInvalid
          ? "2. The parent trade of these cashflows are not validated yet."
          : ""}
      </p>
    </span>
  );
};
