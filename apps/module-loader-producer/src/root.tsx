import React from 'react';
import { TradeSummaryCard } from './TradeSummaryCard';

const ModuleLoaderProducerTile: React.FC = () => (
  <main data-testid="module-loader-producer-tile">
    <h1>Module Loader Producer</h1>
    <p>This tile intentionally exposes TradeSummaryCard to trusted consumer tiles.</p>
    <TradeSummaryCard instrument="AAPL" notional="USD 5,000,000" />
  </main>
);

export { TradeSummaryCard } from './TradeSummaryCard';
export default ModuleLoaderProducerTile;
