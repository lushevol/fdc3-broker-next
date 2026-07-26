import React from 'react';

export interface TradeSummaryCardProps {
  instrument: string;
  notional: string;
}

/** Deliberately exposed component contract for other trusted platform tiles. */
export const TradeSummaryCard: React.FC<TradeSummaryCardProps> = ({ instrument, notional }) => (
  <section aria-label="Producer trade summary" data-testid="module-loader-producer-card">
    <h2>Producer tile: trade summary</h2>
    <dl>
      <dt>Instrument</dt>
      <dd>{instrument}</dd>
      <dt>Notional</dt>
      <dd>{notional}</dd>
    </dl>
  </section>
);
