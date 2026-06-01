import { lazy } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  lazyAppCard,
  lazyContextPreview,
  lazyResolverDialog,
  preloadResolver,
  ResolverSuspense,
} from '../src/lazy';
import type { ResolverTarget } from '../src/types';

describe('resolver lazy utilities', () => {
  const targets: ResolverTarget[] = [
    {
      appId: 'chart-app',
      metadata: {
        appId: 'chart-app',
        name: 'Chart Application',
        title: 'Chart App',
      },
    },
  ];

  it('should render a custom Suspense fallback while loading', () => {
    render(
      <ResolverSuspense fallback={<span>Preparing resolver</span>}>
        <div>Loaded child</div>
      </ResolverSuspense>,
    );

    expect(screen.getByText('Loaded child')).toBeInTheDocument();
  });

  it('should render the default loading fallback while a resolver chunk is pending', () => {
    const PendingComponent = lazy(
      () => new Promise<{ default: () => JSX.Element }>(() => undefined),
    );

    render(
      <ResolverSuspense>
        <PendingComponent />
      </ResolverSuspense>,
    );

    expect(screen.getByText('Loading resolver...')).toBeInTheDocument();
  });

  it('should lazy-load ResolverDialog', async () => {
    const LazyResolverDialog = lazyResolverDialog();

    render(
      <ResolverSuspense fallback={<span>Loading resolver</span>}>
        <LazyResolverDialog
          open={true}
          intent="ViewChart"
          context={{ type: 'fdc3.instrument', id: { ticker: 'AAPL' } }}
          targets={targets}
          onSelect={() => undefined}
          onCancel={() => undefined}
        />
      </ResolverSuspense>,
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should lazy-load AppCard', async () => {
    const LazyAppCard = lazyAppCard();

    render(
      <ResolverSuspense fallback={<span>Loading card</span>}>
        <LazyAppCard
          app={targets[0].metadata}
          selected={false}
          focused={false}
          onClick={() => undefined}
          onDoubleClick={() => undefined}
          tabIndex={0}
        />
      </ResolverSuspense>,
    );

    await waitFor(() => {
      expect(screen.getByText('Chart App')).toBeInTheDocument();
    });
  });

  it('should lazy-load ContextPreview', async () => {
    const LazyContextPreview = lazyContextPreview();

    render(
      <ResolverSuspense fallback={<span>Loading context</span>}>
        <LazyContextPreview context={{ type: 'fdc3.instrument', id: { ticker: 'AAPL' } }} />
      </ResolverSuspense>,
    );

    await waitFor(() => {
      expect(screen.getByText(/fdc3\.instrument/)).toBeInTheDocument();
    });
  });

  it('should preload resolver components without throwing', () => {
    expect(() => preloadResolver()).not.toThrow();
  });
});
