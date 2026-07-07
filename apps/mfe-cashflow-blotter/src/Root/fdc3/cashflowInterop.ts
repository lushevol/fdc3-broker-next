export const CASHFLOW_SEARCH_INTENT = 'SearchCashflows';
export const CASHFLOW_SEARCH_QUERY_CONTEXT = 'scb.fmptp.cashflow.query';

export type CashflowSearchTarget = 'cashflow_cn' | 'cashflow_group_management';

export interface CashflowSearchContext {
  type: typeof CASHFLOW_SEARCH_QUERY_CONTEXT;
  filters: Filter[];
  target: CashflowSearchTarget;
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

export const handleCashflowSearchIntent = (
  context: unknown,
  applyFilters: (filters: Filter[]) => void,
): { handled: boolean; filters: Filter[] } => {
  const filters = getCashflowFiltersFromContext(context);

  if (filters.length > 0) {
    applyFilters(filters);
  }

  return { handled: filters.length > 0, filters };
};
