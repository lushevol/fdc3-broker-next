import {
  CASHFLOW_SEARCH_INTENT,
  CASHFLOW_SEARCH_QUERY_CONTEXT,
  buildCashflowSearchContext,
  getCashflowFiltersFromContext,
  raiseCashflowSearchIntent,
  registerCashflowSearchIntent,
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

  test('raises SearchCashflows to the selected cashflow target', async () => {
    const raiseIntent = jest.fn().mockResolvedValue({ intent: CASHFLOW_SEARCH_INTENT });

    await raiseCashflowSearchIntent({ raiseIntent }, filters, 'cashflow_group_management');

    expect(raiseIntent).toHaveBeenCalledWith(
      CASHFLOW_SEARCH_INTENT,
      buildCashflowSearchContext(filters, 'cashflow_group_management'),
      'cashflow_group_management',
    );
  });

  test('registers a SearchCashflows listener that applies filters from the context', async () => {
    const unsubscribe = jest.fn();
    let handler: (context: unknown) => unknown;
    const addIntentListener = jest.fn().mockImplementation((_intent, nextHandler) => {
      handler = nextHandler;
      return Promise.resolve({ unsubscribe });
    });
    const applyFilters = jest.fn();

    const listener = await registerCashflowSearchIntent({ addIntentListener }, applyFilters);
    const result = handler!(buildCashflowSearchContext(filters, 'cashflow_group_management'));

    expect(addIntentListener).toHaveBeenCalledWith(CASHFLOW_SEARCH_INTENT, expect.any(Function));
    expect(applyFilters).toHaveBeenCalledWith(filters);
    expect(result).toEqual({ handled: true, filters });

    await listener.unsubscribe();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
