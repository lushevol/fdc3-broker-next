/** @jest-environment jsdom */

import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { TileProps } from '../Root/routing/common/interface';
import {
  DISCOVER_WORKFLOW_TRADES_INTENT,
  PRICE_WORKFLOW_TRADE_INTENT,
  ASSESS_WORKFLOW_RISK_INTENT,
  TradeDiscoveryCapabilityTile,
  PricingCapabilityTile,
  RiskCapabilityTile,
} from './workflowCapabilities';

const intentListeners: Array<{
  intent: string;
  handler: (context: unknown) => Promise<unknown>;
}> = [];

jest.mock('../Root/import', () => ({
  FDC3Agent: {
    useIntentListener: (intent: string, handler: (context: unknown) => Promise<unknown>) => {
      intentListeners.push({ intent, handler });
    },
  },
}));

const baseProps: TileProps = {
  id: 'workflow-capability-1',
  container: 'workspace-1',
  module: 'template',
  tile: '/template_tile_workflow_discovery',
  title: 'Workflow capability',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

describe('sample workflow capability tiles', () => {
  beforeEach(() => {
    intentListeners.length = 0;
  });

  it('discovers a deterministic pending-validation trade', async () => {
    render(<TradeDiscoveryCapabilityTile {...baseProps} executionDelayMs={0} />);

    expect(screen.getByText('Trade discovery')).toBeTruthy();
    expect(screen.getByText('Ready for workflow requests')).toBeTruthy();
    expect(intentListeners[0]?.intent).toBe(DISCOVER_WORKFLOW_TRADES_INTENT);

    let result: unknown;
    await act(async () => {
      result = await intentListeners[0]?.handler({
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      });
    });

    expect(result).toEqual({
      trade: {
        tradeId: 'TR-ORCH-1042',
        instrument: { ticker: 'AAPL' },
        side: 'BUY',
        quantity: 2500,
        currency: 'USD',
      },
      totalCount: 1,
    });
    expect(screen.getByText('TR-ORCH-1042')).toBeTruthy();
  });

  it('prices the discovered trade', async () => {
    render(
      <PricingCapabilityTile
        {...baseProps}
        tile="/template_tile_workflow_pricing"
        executionDelayMs={0}
      />,
    );

    expect(intentListeners[0]?.intent).toBe(PRICE_WORKFLOW_TRADE_INTENT);

    let result: unknown;
    await act(async () => {
      result = await intentListeners[0]?.handler({
        type: 'fdc3.trade',
        trade: {
          tradeId: 'TR-ORCH-1042',
          instrument: { ticker: 'AAPL' },
          currency: 'USD',
        },
      });
    });

    expect(result).toEqual({
      tradeId: 'TR-ORCH-1042',
      price: {
        mid: 214.32,
        spreadBps: 1.8,
        currency: 'USD',
        asOf: '2026-07-25T09:30:00.000Z',
      },
    });
    expect(screen.getByText('$214.32')).toBeTruthy();
  });

  it('assesses exposure and returns a risk classification', async () => {
    render(
      <RiskCapabilityTile
        {...baseProps}
        tile="/template_tile_workflow_risk"
        executionDelayMs={0}
      />,
    );

    expect(intentListeners[0]?.intent).toBe(ASSESS_WORKFLOW_RISK_INTENT);

    let result: unknown;
    await act(async () => {
      result = await intentListeners[0]?.handler({
        type: 'ratan.workflow.risk',
        trade: {
          tradeId: 'TR-ORCH-1042',
          quantity: 2500,
        },
        price: {
          mid: 214.32,
        },
      });
    });

    expect(result).toEqual({
      tradeId: 'TR-ORCH-1042',
      exposure: 535800,
      limitUtilization: 0.68,
      classification: 'MODERATE',
      recommendation: 'REVIEW',
    });
    expect(screen.getByText('MODERATE')).toBeTruthy();
  });

  it('validates capability contexts before processing', async () => {
    const { unmount } = render(
      <TradeDiscoveryCapabilityTile {...baseProps} executionDelayMs={0} />,
    );
    const discoveryHandler = intentListeners[0]?.handler;

    await expect(discoveryHandler?.(null)).rejects.toThrow(
      'Invalid fdc3.trade.query workflow context',
    );
    await expect(discoveryHandler?.({ type: 'fdc3.instrument' })).rejects.toThrow(
      'Invalid fdc3.trade.query workflow context',
    );
    await expect(
      discoveryHandler?.({ type: 'fdc3.trade.query', filters: { status: 'SETTLED' } }),
    ).rejects.toThrow('requires PENDING_VALIDATION');

    unmount();
    intentListeners.length = 0;
    const pricing = render(
      <PricingCapabilityTile
        {...baseProps}
        tile="/template_tile_workflow_pricing"
        executionDelayMs={0}
      />,
    );
    await expect(
      intentListeners[0]?.handler({ type: 'fdc3.trade', trade: null }),
    ).rejects.toThrow('Workflow trade is required');

    pricing.unmount();
    intentListeners.length = 0;
    render(
      <RiskCapabilityTile
        {...baseProps}
        tile="/template_tile_workflow_risk"
        executionDelayMs={0}
      />,
    );
    await expect(
      intentListeners[0]?.handler({
        type: 'ratan.workflow.risk',
        trade: { tradeId: 'TR-ORCH-1042', quantity: 2500 },
      }),
    ).rejects.toThrow('Workflow price is required');
  });

  it('supports a bounded asynchronous processor delay', async () => {
    render(<TradeDiscoveryCapabilityTile {...baseProps} executionDelayMs={1} />);

    await act(async () => {
      await intentListeners[0]?.handler({
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      });
    });

    expect(screen.getByText('TR-ORCH-1042')).toBeTruthy();
  });
});
