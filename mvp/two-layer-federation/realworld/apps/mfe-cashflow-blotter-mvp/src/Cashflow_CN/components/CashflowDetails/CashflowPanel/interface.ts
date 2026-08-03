export interface CashflowPanelProps {
  cashflow: CNCashflow;
  cashflowHistory?: CashflowAuditTrail[];
  onQueryCashflow: (cashflowIds: string[], isPass?: boolean) => void;
}
