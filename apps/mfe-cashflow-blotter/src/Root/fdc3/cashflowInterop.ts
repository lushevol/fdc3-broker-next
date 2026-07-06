export const CASHFLOW_SEARCH_INTENT = 'SearchCashflows';
export const CASHFLOW_SEARCH_QUERY_CONTEXT = 'scb.fmptp.cashflow.query';

export type CashflowSearchTarget = 'cashflow_cn' | 'cashflow_group_management';

export interface CashflowSearchContext {
  type: typeof CASHFLOW_SEARCH_QUERY_CONTEXT;
  filters: Filter[];
  target: CashflowSearchTarget;
}

export interface CashflowSearchAgent {
  raiseIntent?: (
    intent: string,
    context: CashflowSearchContext,
    target: CashflowSearchTarget,
  ) => Promise<unknown>;
  addIntentListener?: (
    intent: string,
    handler: (context: unknown) => unknown,
  ) => Promise<{ unsubscribe: () => void | Promise<void> }>;
}

export const buildCashflowSearchContext = (
  filters: Filter[],
  target: CashflowSearchTarget,
): CashflowSearchContext => ({
  type: CASHFLOW_SEARCH_QUERY_CONTEXT,
  filters,
  target,
});

export const getCashflowFiltersFromContext = (context: unknown): Filter[] => {
  const queryContext = context as Partial<CashflowSearchContext>;

  if (
    queryContext?.type !== CASHFLOW_SEARCH_QUERY_CONTEXT ||
    !Array.isArray(queryContext.filters)
  ) {
    return [];
  }

  return queryContext.filters;
};

export const raiseCashflowSearchIntent = (
  agent: CashflowSearchAgent,
  filters: Filter[],
  target: CashflowSearchTarget,
): Promise<unknown> => {
  if (!agent.raiseIntent) {
    return Promise.reject(new Error('FDC3 raiseIntent is not available'));
  }

  return agent.raiseIntent(
    CASHFLOW_SEARCH_INTENT,
    buildCashflowSearchContext(filters, target),
    target,
  );
};

export const registerCashflowSearchIntent = (
  agent: CashflowSearchAgent,
  applyFilters: (filters: Filter[]) => void,
): Promise<{ unsubscribe: () => void | Promise<void> }> => {
  if (!agent.addIntentListener) {
    return Promise.reject(new Error('FDC3 addIntentListener is not available'));
  }

  return agent.addIntentListener(CASHFLOW_SEARCH_INTENT, (context: unknown) => {
    const filters = getCashflowFiltersFromContext(context);

    if (filters.length > 0) {
      applyFilters(filters);
    }

    return { handled: filters.length > 0, filters };
  });
};
