import { useCallback, useState } from 'react';
import { FDC3Agent } from '../Root/import';
import type { TileProps } from '../Root/routing/common/interface';

export const DISCOVER_WORKFLOW_TRADES_INTENT = 'DiscoverWorkflowTrades';
export const PRICE_WORKFLOW_TRADE_INTENT = 'PriceWorkflowTrade';
export const ASSESS_WORKFLOW_RISK_INTENT = 'AssessWorkflowRisk';

const CAPABILITY_TOKENS = {
  ink: '#14202b',
  muted: '#52606d',
  surface: '#f5f7f8',
  panel: '#ffffff',
  signal: '#0b7285',
  line: '#d9e2e7',
  success: '#087f5b',
} as const;

const DEFAULT_EXECUTION_DELAY_MS = 700;

type JsonRecord = Record<string, unknown>;

type WorkflowCapabilityTileProps = TileProps & {
  executionDelayMs?: number;
};

type SampleTrade = {
  tradeId: string;
  instrument: { ticker: string };
  side: 'BUY' | 'SELL';
  quantity: number;
  currency: string;
};

const SAMPLE_TRADE: SampleTrade = {
  tradeId: 'TR-ORCH-1042',
  instrument: { ticker: 'AAPL' },
  side: 'BUY',
  quantity: 2500,
  currency: 'USD',
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function delay(durationMs: number): Promise<void> {
  if (durationMs <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => window.setTimeout(resolve, durationMs));
}

function requireContext(value: unknown, type: string): JsonRecord {
  if (!isRecord(value) || value.type !== type) {
    throw new Error(`Invalid ${type} workflow context`);
  }
  return value;
}

function requireTrade(context: JsonRecord): SampleTrade {
  if (!isRecord(context.trade) || typeof context.trade.tradeId !== 'string') {
    throw new Error('Workflow trade is required');
  }
  return context.trade as unknown as SampleTrade;
}

type CapabilityShellProps = {
  title: string;
  intent: string;
  description: string;
  status: string;
  result?: React.ReactNode;
};

function CapabilityShell({
  title,
  intent,
  description,
  status,
  result,
}: CapabilityShellProps): React.ReactElement {
  return (
    <main
      style={{
        minHeight: '100%',
        boxSizing: 'border-box',
        padding: 20,
        color: CAPABILITY_TOKENS.ink,
        background: CAPABILITY_TOKENS.surface,
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              color: CAPABILITY_TOKENS.signal,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            FDC3 processor
          </div>
          <h2 style={{ margin: '6px 0 4px', fontSize: 22 }}>{title}</h2>
          <p style={{ margin: 0, color: CAPABILITY_TOKENS.muted, fontSize: 13 }}>
            {description}
          </p>
        </div>
        <span
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            color: CAPABILITY_TOKENS.success,
            border: `1px solid ${CAPABILITY_TOKENS.line}`,
            background: CAPABILITY_TOKENS.panel,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Ready
        </span>
      </div>

      <section
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${CAPABILITY_TOKENS.line}`,
          background: CAPABILITY_TOKENS.panel,
        }}
      >
        <div style={{ color: CAPABILITY_TOKENS.muted, fontSize: 11, fontWeight: 700 }}>
          LISTENS FOR
        </div>
        <code style={{ display: 'block', marginTop: 6, color: CAPABILITY_TOKENS.signal }}>
          {intent}
        </code>
      </section>

      <section
        aria-live="polite"
        style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${CAPABILITY_TOKENS.line}`,
          background: CAPABILITY_TOKENS.panel,
        }}
      >
        <strong>{status}</strong>
        {result ? <div style={{ marginTop: 10 }}>{result}</div> : null}
      </section>
    </main>
  );
}

export function TradeDiscoveryCapabilityTile({
  executionDelayMs = DEFAULT_EXECUTION_DELAY_MS,
}: WorkflowCapabilityTileProps): React.ReactElement {
  const [trade, setTrade] = useState<SampleTrade>();
  const handler = useCallback(
    async (rawContext: unknown) => {
      const context = requireContext(rawContext, 'fdc3.trade.query');
      const filters = isRecord(context.filters) ? context.filters : {};
      if (filters.status !== 'PENDING_VALIDATION') {
        throw new Error('The sample processor requires PENDING_VALIDATION status');
      }
      await delay(executionDelayMs);
      setTrade(SAMPLE_TRADE);
      return { trade: SAMPLE_TRADE, totalCount: 1 };
    },
    [executionDelayMs],
  );

  FDC3Agent.useIntentListener(DISCOVER_WORKFLOW_TRADES_INTENT, handler);

  return (
    <CapabilityShell
      title="Trade discovery"
      intent={DISCOVER_WORKFLOW_TRADES_INTENT}
      description="Finds the first pending-validation trade for downstream processors."
      status={trade ? 'Latest workflow result' : 'Ready for workflow requests'}
      result={
        trade ? (
          <div>
            <strong>{trade.tradeId}</strong> · {trade.side} {trade.quantity.toLocaleString()}{' '}
            {trade.instrument.ticker}
          </div>
        ) : undefined
      }
    />
  );
}

export function PricingCapabilityTile({
  executionDelayMs = DEFAULT_EXECUTION_DELAY_MS,
}: WorkflowCapabilityTileProps): React.ReactElement {
  const [pricedTradeId, setPricedTradeId] = useState<string>();
  const handler = useCallback(
    async (rawContext: unknown) => {
      const context = requireContext(rawContext, 'fdc3.trade');
      const trade = requireTrade(context);
      await delay(executionDelayMs);
      const result = {
        tradeId: trade.tradeId,
        price: {
          mid: 214.32,
          spreadBps: 1.8,
          currency: trade.currency,
          asOf: '2026-07-25T09:30:00.000Z',
        },
      };
      setPricedTradeId(trade.tradeId);
      return result;
    },
    [executionDelayMs],
  );

  FDC3Agent.useIntentListener(PRICE_WORKFLOW_TRADE_INTENT, handler);

  return (
    <CapabilityShell
      title="Market pricing"
      intent={PRICE_WORKFLOW_TRADE_INTENT}
      description="Enriches the selected trade with a deterministic market snapshot."
      status={pricedTradeId ? 'Latest workflow result' : 'Ready for workflow requests'}
      result={
        pricedTradeId ? (
          <div>
            <strong>$214.32</strong> · 1.8 bps spread · {pricedTradeId}
          </div>
        ) : undefined
      }
    />
  );
}

export function RiskCapabilityTile({
  executionDelayMs = DEFAULT_EXECUTION_DELAY_MS,
}: WorkflowCapabilityTileProps): React.ReactElement {
  const [classification, setClassification] = useState<string>();
  const handler = useCallback(
    async (rawContext: unknown) => {
      const context = requireContext(rawContext, 'ratan.workflow.risk');
      const trade = requireTrade(context);
      if (!isRecord(context.price) || typeof context.price.mid !== 'number') {
        throw new Error('Workflow price is required');
      }
      await delay(executionDelayMs);
      const result = {
        tradeId: trade.tradeId,
        exposure: trade.quantity * context.price.mid,
        limitUtilization: 0.68,
        classification: 'MODERATE',
        recommendation: 'REVIEW',
      };
      setClassification(result.classification);
      return result;
    },
    [executionDelayMs],
  );

  FDC3Agent.useIntentListener(ASSESS_WORKFLOW_RISK_INTENT, handler);

  return (
    <CapabilityShell
      title="Risk assessment"
      intent={ASSESS_WORKFLOW_RISK_INTENT}
      description="Calculates exposure and classifies the trade against a sample limit."
      status={classification ? 'Latest workflow result' : 'Ready for workflow requests'}
      result={
        classification ? (
          <div>
            <strong>{classification}</strong> · 68% limit utilization
          </div>
        ) : undefined
      }
    />
  );
}
