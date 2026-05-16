export const PENDING_VALIDATION_STATUS = 'PENDING_VALIDATION';
export const SEARCH_TRADES_INTENT = 'SearchTrades';
export const TRADE_QUERY_CONTEXT_TYPE = 'fdc3.trade.query';
export const INVALID_SEARCH_TRADES_CONTEXT_ERROR = 'Invalid SearchTrades context';
export const MAX_RETURNED_TRADES = 10;

export type TradeQueryFilters = {
  status?: string;
  book?: string;
  desk?: string;
};

export type TradeQueryContext = {
  type: typeof TRADE_QUERY_CONTEXT_TYPE;
  filters?: TradeQueryFilters;
};

export type TradeRow = {
  tradeId: string;
  instrument: string;
  book: string;
  desk: string;
  status: string;
  counterparty: string;
  notional: number;
};

export type TradeSearchResult = {
  status: 'ok';
  intent: typeof SEARCH_TRADES_INTENT;
  appliedFilters: TradeQueryFilters | {};
  totalCount: number;
  returnedCount: number;
  summary: string;
  trades: TradeRow[];
  tile: {
    appId: string;
    instanceId: string;
  };
};
