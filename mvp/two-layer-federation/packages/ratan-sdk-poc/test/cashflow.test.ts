import { describe, expect, it } from 'vitest';
import { filterCashflows, summarizeCashflows, type CashflowRecord } from '../src';

const records: CashflowRecord[] = [
  { id: 'CF-1001', currency: 'USD', amount: 1250000, counterparty: 'Atlas Bank', status: 'Ready' },
  { id: 'CF-1002', currency: 'EUR', amount: -420000, counterparty: 'Northstar AM', status: 'Review' },
  { id: 'CF-1003', currency: 'USD', amount: 275000, counterparty: 'Summit Capital', status: 'Ready' },
];

describe('filterCashflows', () => {
  it('matches currency, id, counterparty, and status case-insensitively', () => {
    expect(filterCashflows(records, 'usd')).toHaveLength(2);
    expect(filterCashflows(records, '1002')).toEqual([records[1]]);
    expect(filterCashflows(records, 'summit')).toEqual([records[2]]);
    expect(filterCashflows(records, 'review')).toEqual([records[1]]);
  });

  it('returns all rows for a blank query', () => {
    expect(filterCashflows(records, '   ')).toEqual(records);
  });
});

describe('summarizeCashflows', () => {
  it('returns count and net amount', () => {
    expect(summarizeCashflows(records)).toEqual({ count: 3, netAmount: 1105000 });
  });

  it('handles no rows', () => {
    expect(summarizeCashflows([])).toEqual({ count: 0, netAmount: 0 });
  });
});
