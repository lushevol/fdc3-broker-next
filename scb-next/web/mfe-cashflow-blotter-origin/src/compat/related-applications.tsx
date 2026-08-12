import { openRelatedApplication } from './base';

function identifier(details: unknown, fallback: string) {
  if (!details || typeof details !== 'object') return fallback;
  const record = details as Record<string, unknown>;
  return String(
    record.Trade_Id
    ?? (record.Cashflow as Record<string, unknown> | undefined)?.Cashflow_Id
    ?? fallback,
  );
}

export function TradeDetailsDialog({
  details,
  onClose,
}: {
  readonly details?: unknown;
  readonly onClose?: () => void;
  readonly defaultActiveKey?: string;
  readonly isInTradeBlotter?: boolean;
}) {
  const tradeId = identifier(details, 'selected');
  return (
    <div role="dialog" aria-label="Trade details handoff">
      <p>Trade details are provided by the Portal Host trade application.</p>
      <button
        type="button"
        onClick={() => openRelatedApplication(`/trades/${tradeId}`, 'Trade details')}
      >
        Open trade details
      </button>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
}

export function ComponentCashflow({
  details,
  onClose,
}: {
  readonly details?: unknown;
  readonly onClose?: () => void;
  readonly [key: string]: unknown;
}) {
  const cashflowId = identifier(details, 'selected');
  return (
    <span className="cashflow-related-application">
      <button
        type="button"
        onClick={() =>
          openRelatedApplication(`/cashflow/${cashflowId}`, 'Related cashflow')
        }
      >
        Open related cashflow
      </button>
      {onClose ? <button type="button" onClick={onClose}>Close</button> : null}
    </span>
  );
}
