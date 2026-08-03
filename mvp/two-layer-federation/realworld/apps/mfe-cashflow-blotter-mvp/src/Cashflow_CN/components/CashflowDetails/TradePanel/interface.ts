export interface TradePanelProps
  extends Pick<GraphqlCashflowDetails, "cashflow"> {
  trade: (Trade_Review & { Versions: Trade_Review[] }) | null;
  onOpenTradeDetails?: () => Promise<void>;
  disableTradeOpenBtn?: boolean;
}
