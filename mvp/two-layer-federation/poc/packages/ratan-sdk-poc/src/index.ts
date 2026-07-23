export type CashflowStatus = 'Ready' | 'Review' | 'Blocked';

export interface CashflowRecord {
  id: string;
  currency: string;
  amount: number;
  counterparty: string;
  status: CashflowStatus;
}

export interface CashflowSummary {
  count: number;
  netAmount: number;
}

export function filterCashflows(
  records: CashflowRecord[],
  rawQuery: string,
): CashflowRecord[] {
  const query = rawQuery.trim().toLocaleLowerCase();
  if (!query) {
    return records;
  }
  return records.filter((record) =>
    [record.id, record.currency, record.counterparty, record.status].some((field) =>
      field.toLocaleLowerCase().includes(query),
    ),
  );
}

export function summarizeCashflows(records: CashflowRecord[]): CashflowSummary {
  return {
    count: records.length,
    netAmount: records.reduce((sum, record) => sum + record.amount, 0),
  };
}
