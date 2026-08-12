export interface FilterItem {
  field: string;
  operator: string;
  values: string | number | string[];
}

export interface NotifiedCashflow {
  Cashflow_Id: string;
  Cashflow_Business_Version: number;
  Cashflow_Version: number;
  Cashflow_Minor_Version: number;
  Cashflow_State: string;
  Cashflow: CNCashflow;
  Event_Action: EVENT_ACTION;
}

type EVENT_ACTION = "CASHFLOW_UPDATE" | "CASHFLOW_CREATE";

export const isNotifiedCashflow = (
  instance: any
): instance is NotifiedCashflow => {
  if (!instance || typeof instance !== "object") return false;
  const { Event_Action } = instance;
  return !!Event_Action;
};

export const areAllNotifiedCashflows = (
  instances: any
): instances is NotifiedCashflow[] => {
  return instances instanceof Array && isNotifiedCashflow(instances[0]);
};

export interface CashflowNotificationComponentProps {
  onCashflowComming: (cashflows: NotifiedCashflow[]) => void;
  id: string;
}
