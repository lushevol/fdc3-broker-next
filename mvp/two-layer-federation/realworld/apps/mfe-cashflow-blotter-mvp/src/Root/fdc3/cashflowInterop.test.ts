import {
  CASHFLOW_SEARCH_INTENT,
  CASHFLOW_SEARCH_QUERY_CONTEXT,
  buildCashflowSearchContext,
  getCashflowFiltersFromContext,
  handleCashflowSearchIntent,
} from './cashflowInterop';

describe('cashflow FDC3 interop helpers', () => {
  const filters = [
    { field: 'Cashflow.Cashflow_State', operator: 'IN', values: ['WAITING'] },
    { field: 'Cashflow.Payment_Date', operator: 'EQ', values: '2026-07-06' },
  ];

  test('builds a SearchCashflows query context from dashboard filters', () => {
    expect(buildCashflowSearchContext(filters, 'cashflow_cn')).toEqual({
      type: CASHFLOW_SEARCH_QUERY_CONTEXT,
      filters,
      target: 'cashflow_cn',
    });
    expect(CASHFLOW_SEARCH_INTENT).toBe('SearchCashflows');
  });

  test('extracts filters only from the cashflow query context', () => {
    expect(
      getCashflowFiltersFromContext({
        type: CASHFLOW_SEARCH_QUERY_CONTEXT,
        filters,
        target: 'cashflow_group_management',
      }),
    ).toEqual(filters);

    expect(
      getCashflowFiltersFromContext({
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL' },
      }),
    ).toEqual([]);
  });

  test('handles SearchCashflows contexts from useIntentListener', () => {
    const applyFilters = jest.fn();

    const result = handleCashflowSearchIntent(
      buildCashflowSearchContext(filters, 'cashflow_group_management'),
      applyFilters,
    );

    expect(applyFilters).toHaveBeenCalledWith(filters);
    expect(result).toEqual({ handled: true, filters });
  });

  test('ignores non-cashflow contexts in useIntentListener', () => {
    const applyFilters = jest.fn();

    const result = handleCashflowSearchIntent(
      { type: 'fdc3.instrument', id: { ticker: 'AAPL' } },
      applyFilters,
    );

    expect(applyFilters).not.toHaveBeenCalled();
    expect(result).toEqual({ handled: false, filters: [] });
  });
});
