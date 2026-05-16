import { useCallback, useEffect, useState } from 'react';
import { FDC3Agent } from '../Root/import';
import type { TileProps } from '../Root/routing/common/interface';
import { TRADE_ROWS } from './tradeBlotterMockData';
import type { TradeQueryContext, TradeRow, TradeSearchResult } from './tradeBlotterTypes';
import {
  INVALID_SEARCH_TRADES_CONTEXT_ERROR,
  MAX_RETURNED_TRADES,
  PENDING_VALIDATION_STATUS,
  SEARCH_TRADES_INTENT,
  TRADE_QUERY_CONTEXT_TYPE,
} from './tradeBlotterTypes';

const { AgentProvider, useFDC3, useIntentListener } = FDC3Agent;

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '16px',
    color: '#1f2937',
  },
  heading: {
    margin: '0 0 8px',
    fontSize: '20px',
    fontWeight: 700,
  },
  description: {
    margin: '0 0 12px',
    fontSize: '13px',
    color: '#4b5563',
  },
  statusBanner: {
    marginBottom: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#eff6ff',
    fontSize: '13px',
  },
  emptyState: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    fontSize: '13px',
    color: '#4b5563',
  },
  list: {
    display: 'grid',
    gap: '8px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: '8px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    fontSize: '13px',
  },
  tradeId: {
    fontWeight: 700,
  },
} as const;

function formatTradeSummary(totalCount: number, returnedCount: number): string {
  return `${totalCount} trades found. Returning top ${returnedCount} rows.`;
}

function matchesFilters(trade: TradeRow, context: TradeQueryContext): boolean {
  const { status, book, desk } = context.filters ?? {};

  if (!status && !book && !desk) {
    return true;
  }

  if (status && trade.status !== status) {
    return false;
  }

  if (book && trade.book !== book) {
    return false;
  }

  if (desk && trade.desk !== desk) {
    return false;
  }

  return true;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function parseTradeQueryContext(value: unknown): TradeQueryContext {
  if (!value || typeof value !== 'object') {
    throw new Error(INVALID_SEARCH_TRADES_CONTEXT_ERROR);
  }

  const candidate = value as Partial<TradeQueryContext> & {
    filters?: Partial<TradeQueryContext['filters']>;
  };

  if (candidate.type !== TRADE_QUERY_CONTEXT_TYPE) {
    throw new Error(INVALID_SEARCH_TRADES_CONTEXT_ERROR);
  }

  if (candidate.filters === undefined) {
    return {
      type: TRADE_QUERY_CONTEXT_TYPE,
    };
  }

  if (!candidate.filters || typeof candidate.filters !== 'object') {
    throw new Error(INVALID_SEARCH_TRADES_CONTEXT_ERROR);
  }

  if (candidate.filters.status !== undefined && typeof candidate.filters.status !== 'string') {
    throw new Error(INVALID_SEARCH_TRADES_CONTEXT_ERROR);
  }

  if (!isOptionalString(candidate.filters.book) || !isOptionalString(candidate.filters.desk)) {
    throw new Error(INVALID_SEARCH_TRADES_CONTEXT_ERROR);
  }

  return {
    type: TRADE_QUERY_CONTEXT_TYPE,
    filters: {
      ...(candidate.filters.status ? { status: candidate.filters.status } : {}),
      ...(candidate.filters.book ? { book: candidate.filters.book } : {}),
      ...(candidate.filters.desk ? { desk: candidate.filters.desk } : {}),
    },
  };
}

function useFdc3TileRegistration(appId: string, instanceId: string): void {
  const fdc3 = useFDC3();

  useEffect(() => {
    try {
      fdc3.registerTile(instanceId, appId);
    } catch (error) {
      console.error('Failed to register tile:', error);
    }

    return () => {
      try {
        fdc3.unregisterTile(instanceId, appId);
      } catch (error) {
        console.error('Failed to unregister tile:', error);
      }
    };
  }, [appId, fdc3, instanceId]);
}

type TradeBlotterContentProps = {
  appId: string;
  instanceId: string;
};

function TradeBlotterContent({ appId, instanceId }: TradeBlotterContentProps): React.ReactElement {
  const [rows, setRows] = useState<TradeRow[]>([]);
  const [summary, setSummary] = useState<string>('Awaiting SearchTrades intent');

  useFdc3TileRegistration(appId, instanceId);

  const handleSearchTrades = useCallback(
    async (rawContext: unknown): Promise<TradeSearchResult> => {
      const context = parseTradeQueryContext(rawContext);
      const filteredRows = TRADE_ROWS.filter((trade) => matchesFilters(trade, context));
      const returnedTrades = filteredRows.slice(0, MAX_RETURNED_TRADES);
      const nextSummary = formatTradeSummary(filteredRows.length, returnedTrades.length);

      setRows(filteredRows);
      setSummary(nextSummary);

      return {
        status: 'ok',
        intent: SEARCH_TRADES_INTENT,
        appliedFilters: context.filters ?? {},
        totalCount: filteredRows.length,
        returnedCount: returnedTrades.length,
        summary: nextSummary,
        trades: returnedTrades,
        tile: {
          appId,
          instanceId,
        },
      };
    },
    [appId, instanceId],
  );

  useIntentListener(SEARCH_TRADES_INTENT, handleSearchTrades);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Trade Blotter</h2>
      <p style={styles.description}>
        Sample pending-validation blotter wired to the {SEARCH_TRADES_INTENT} FDC3 intent.
      </p>
      <div style={styles.statusBanner}>
        <div>{summary}</div>
      </div>
      {rows.length === 0 ? (
        <div style={styles.emptyState}>
          Awaiting SearchTrades intent for {PENDING_VALIDATION_STATUS} trades.
        </div>
      ) : (
        <div style={styles.list}>
          {rows.map((row) => (
            <div key={row.tradeId} style={styles.row}>
              <span style={styles.tradeId}>{row.tradeId}</span>
              <span>{row.instrument}</span>
              <span>{row.book}</span>
              <span>{row.desk}</span>
              <span>{row.counterparty}</span>
              <span>{row.notional.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TradeBlotterFDC3Tile(props: TileProps): React.ReactElement {
  const appId = props.tile.replace(/\//g, '');
  const appIdentifier = {
    appId,
    instanceId: props.id,
  };

  return (
    <AgentProvider appIdentifier={appIdentifier}>
      <TradeBlotterContent appId={appId} instanceId={props.id} />
    </AgentProvider>
  );
}
