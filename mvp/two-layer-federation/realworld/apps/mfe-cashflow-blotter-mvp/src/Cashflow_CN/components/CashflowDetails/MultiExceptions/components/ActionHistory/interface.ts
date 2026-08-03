export interface ActionHistoryProps {
  data: HistoryDataType[];
}

export interface HistoryDataType extends CashflowAuditTrail {
  children?: HistoryDataType[];
}
