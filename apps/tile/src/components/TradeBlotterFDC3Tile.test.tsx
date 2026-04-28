/** @jest-environment jsdom */

import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { TileProps } from '../Root/routing/common/interface';
import { TradeBlotterFDC3Tile } from './TradeBlotterFDC3Tile';
import { MAX_RETURNED_TRADES, SEARCH_TRADES_INTENT } from './tradeBlotterTypes';

const mockRegisterTile = jest.fn();
const mockUnregisterTile = jest.fn();
const mockUseIntentListener = jest.fn();
const mockIntentListenerCalls: Array<{
  intent: string;
  handler: (context: unknown) => Promise<unknown>;
}> = [];

jest.mock('../Root/import', () => ({
  FDC3Agent: {
    AgentProvider: ({
      children,
    }: {
      appIdentifier: { appId: string; instanceId: string };
      children: React.ReactNode;
    }) => <>{children}</>,
    useFDC3: () => ({
      registerTile: mockRegisterTile,
      unregisterTile: mockUnregisterTile,
    }),
    useIntentListener: (intent: string, handler: (context: unknown) => Promise<unknown>) => {
      mockUseIntentListener(intent, handler);
      mockIntentListenerCalls.push({ intent, handler });
    },
  },
}));

const baseProps: TileProps = {
  id: 'ws-trade-1',
  container: 'workspace-1',
  module: 'template',
  tile: '/template_tile_trade_blotter',
  title: 'Trade Blotter',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

describe('TradeBlotterFDC3Tile', () => {
  beforeEach(() => {
    mockRegisterTile.mockReset();
    mockUnregisterTile.mockReset();
    mockUseIntentListener.mockReset();
    mockIntentListenerCalls.length = 0;
  });

  it('renders the tile shell, registers the tile, and unregisters on unmount', () => {
    const { unmount } = render(<TradeBlotterFDC3Tile {...baseProps} />);

    expect(screen.getByText('Trade Blotter')).toBeInTheDocument();
    expect(screen.getByText('Awaiting SearchTrades intent')).toBeInTheDocument();
    expect(mockRegisterTile).toHaveBeenCalledWith('ws-trade-1', 'template_tile_trade_blotter');

    unmount();

    expect(mockUnregisterTile).toHaveBeenCalledWith('ws-trade-1', 'template_tile_trade_blotter');
  });

  it('keeps the SearchTrades listener identity stable across state-driven rerenders', async () => {
    render(<TradeBlotterFDC3Tile {...baseProps} />);

    expect(mockUseIntentListener).toHaveBeenCalledTimes(1);
    expect(mockIntentListenerCalls[0]?.intent).toBe(SEARCH_TRADES_INTENT);

    const firstHandler = mockIntentListenerCalls[0]?.handler;
    expect(firstHandler).toBeDefined();

    await act(async () => {
      await firstHandler?.({
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      });
    });

    expect(mockUseIntentListener).toHaveBeenCalledTimes(2);
    expect(mockIntentListenerCalls[1]?.intent).toBe(SEARCH_TRADES_INTENT);
    expect(mockIntentListenerCalls[1]?.handler).toBe(firstHandler);
  });

  it('filters pending validation trades and returns a structured continuation payload', async () => {
    render(<TradeBlotterFDC3Tile {...baseProps} />);

    const handler = mockIntentListenerCalls[0]?.handler;

    expect(handler).toBeDefined();

    let result: unknown;
    await act(async () => {
      result = await handler?.({
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION', book: 'FX' },
      });
    });

    expect(screen.getByText('TR-002')).toBeInTheDocument();
    expect(screen.getByText('TR-006')).toBeInTheDocument();
    expect(screen.getByText('TR-010')).toBeInTheDocument();
    expect(screen.queryByText('TR-001')).not.toBeInTheDocument();
    expect(result).toEqual({
      status: 'ok',
      intent: 'SearchTrades',
      appliedFilters: { status: 'PENDING_VALIDATION', book: 'FX' },
      totalCount: 3,
      returnedCount: 3,
      summary: '3 trades found. Returning top 3 rows.',
      trades: [
        expect.objectContaining({ tradeId: 'TR-002', status: 'PENDING_VALIDATION' }),
        expect.objectContaining({ tradeId: 'TR-006', status: 'PENDING_VALIDATION' }),
        expect.objectContaining({ tradeId: 'TR-010', status: 'PENDING_VALIDATION' }),
      ],
      tile: {
        appId: 'template_tile_trade_blotter',
        instanceId: 'ws-trade-1',
      },
    });
  });

  it('applies optional book and desk filters to the SearchTrades result', async () => {
    render(<TradeBlotterFDC3Tile {...baseProps} />);

    const handler = mockIntentListenerCalls[0]?.handler;

    expect(handler).toBeDefined();

    let result: unknown;
    await act(async () => {
      result = await handler?.({
        type: 'fdc3.trade.query',
        filters: {
          status: 'PENDING_VALIDATION',
          book: 'Rates',
          desk: 'LDN',
        },
      });
    });

    expect(screen.getByText('TR-001')).toBeInTheDocument();
    expect(screen.queryByText('TR-002')).not.toBeInTheDocument();
    expect(result).toEqual(
      expect.objectContaining({
        totalCount: 1,
        returnedCount: 1,
        summary: '1 trades found. Returning top 1 rows.',
        appliedFilters: {
          status: 'PENDING_VALIDATION',
          book: 'Rates',
          desk: 'LDN',
        },
        trades: [expect.objectContaining({ tradeId: 'TR-001' })],
      }),
    );
  });

  it('caps the returned trades payload to the top 10 rows even when more rows match', async () => {
    render(<TradeBlotterFDC3Tile {...baseProps} />);

    const handler = mockIntentListenerCalls[0]?.handler;

    expect(handler).toBeDefined();

    let result: unknown;
    await act(async () => {
      result = await handler?.({
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      });
    });

    expect(result).toEqual(
      expect.objectContaining({
        totalCount: 12,
        returnedCount: MAX_RETURNED_TRADES,
        summary: '12 trades found. Returning top 10 rows.',
        trades: expect.arrayContaining([
          expect.objectContaining({ tradeId: 'TR-001' }),
          expect.objectContaining({ tradeId: 'TR-010' }),
        ]),
      }),
    );
    expect((result as { trades: Array<unknown> }).trades).toHaveLength(MAX_RETURNED_TRADES);
    expect(screen.getByText('TR-012')).toBeInTheDocument();
  });

  it('rejects malformed SearchTrades contexts with a predictable error', async () => {
    render(<TradeBlotterFDC3Tile {...baseProps} />);

    const handler = mockIntentListenerCalls[0]?.handler;

    await expect(
      handler?.({
        type: 'fdc3.trade.query',
        filters: 123,
      }),
    ).rejects.toThrow('Invalid SearchTrades context');
  });

  it('accepts a declared context without filters and returns all trades', async () => {
    render(<TradeBlotterFDC3Tile {...baseProps} />);

    const handler = mockIntentListenerCalls[0]?.handler;

    let result: unknown;
    await act(async () => {
      result = await handler?.({
        type: 'fdc3.trade.query',
      });
    });

    expect(result).toEqual(
      expect.objectContaining({
        totalCount: 13,
        returnedCount: MAX_RETURNED_TRADES,
        appliedFilters: {},
      }),
    );
  });

  it('swallows register and unregister failures from the agent lifecycle', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockRegisterTile.mockImplementation(() => {
      throw new Error('register failed');
    });
    mockUnregisterTile.mockImplementation(() => {
      throw new Error('unregister failed');
    });

    const { unmount } = render(<TradeBlotterFDC3Tile {...baseProps} />);

    expect(screen.getByText('Trade Blotter')).toBeInTheDocument();

    unmount();

    expect(mockConsoleError).toHaveBeenCalledTimes(2);
    mockConsoleError.mockRestore();
  });
});
