import React from 'react';
import type { ComponentType } from 'react';
import { FDC3Agent } from '../Root/import';
import type { TileProps } from '../Root/routing/common/interface';

type TradeSummaryProps = { instrument: string; notional: string };

const producerReference = {
  loader: 'systemjs' as const,
  moduleId: '@fm/module-loader-producer',
  exportName: 'TradeSummaryCard',
};

export const ModuleLoaderConsumerTile: React.FC<TileProps> = () => {
  const fdc3 = FDC3Agent.useFDC3();
  const [ProducerSummary, setProducerSummary] = React.useState<ComponentType<TradeSummaryProps> | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);

  const loadProducerSummary = async () => {
    setError(null);
    try {
      const module = (await fdc3.modules.load(producerReference)) as {
        Component: ComponentType<TradeSummaryProps>;
      };
      setProducerSummary(() => module.Component);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load producer summary.');
    }
  };

  return (
    <main data-testid="module-loader-consumer-tile">
      <h1>Module Loader Consumer</h1>
      <p>Loads a named component from the separate SystemJS producer tile.</p>
      <button type="button" onClick={() => void loadProducerSummary()}>
        Load producer summary
      </button>
      {error ? <p role="alert">{error}</p> : null}
      {ProducerSummary ? <ProducerSummary instrument="AAPL" notional="USD 5,000,000" /> : null}
    </main>
  );
};

export default ModuleLoaderConsumerTile;
