import { BlotterDataType } from "../../store/interface";

export const isBlotterRowsContainsInvalidTradeStatus = (
  datas: BlotterDataType[]
): boolean => datas.some((d) => !d.Is_Trade_Validated);

export const isNewCashflowWithPendingStatus = (
  datas: BlotterDataType[]
): boolean =>
  datas.every((r) => r.Status === "PENDING") &&
  datas.some((r) => r.Business_Event === "New");

export const getManualSTPWarningContent = (
  datas: BlotterDataType[]
): JSX.Element => {
  const hasInvalidTradeStatus = isBlotterRowsContainsInvalidTradeStatus(datas);
  const hasPendingNewCashflow = isNewCashflowWithPendingStatus(datas);

  const contentArray = [
    "The siblings cashflows are not recieved by Ratan yet.",
    hasInvalidTradeStatus &&
      "The parent trade of these cashflows are not validated yet.",
    hasPendingNewCashflow &&
      "Withdrawal cashflows need to be delivered prior to or along with new cashflows.",
  ].filter(Boolean) as string[];

  return (
    <span>
      <p>Please only perform bulk manual STP when informed by support team.</p>
      <p>
        Total {datas.length} cashflow(s) selected. Please be aware you're trying
        to manual proceed the cashflows with below exceptions,
      </p>
      {contentArray.map((msg, i) => (
        <p key={msg}>
          {i + 1}. {msg}
        </p>
      ))}
    </span>
  );
};
