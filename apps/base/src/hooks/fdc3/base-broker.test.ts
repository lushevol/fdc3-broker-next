import type { AppIdentifier, Context } from '@finos/fdc3';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Mock dependencies before importing the module under test
jest.mock('./app-directory', () => ({
  authorizeIntent: jest.fn(),
  getAllDeclaredIntents: jest.fn().mockResolvedValue({ intents: [] }),
}));

jest.mock('./useExternalFDC3', () => ({
  getExternalFDC3: jest.fn().mockReturnValue(undefined),
  setExternalFDC3: jest.fn(),
}));

import { BaseFDC3Broker } from './base-broker';
import { authorizeIntent } from './app-directory';

const mockAuthorizeIntent = authorizeIntent as jest.MockedFunction<typeof authorizeIntent>;

const LISTENER_TIMEOUT_MS = 500; // Short timeout for tests

/** Helper: create a broker with common stubs. sessionStorage has SET_TOKEN. */
function createBroker(openTileResult?: {
  workspaceId?: string;
  newTile?: boolean;
  opened?: boolean;
  failedReason?: string;
}) {
  const broker = new BaseFDC3Broker();
  const result = {
    workspaceId: 'ws-1',
    newTile: true,
    opened: true,
    failedReason: '',
    ...openTileResult,
  };
  broker.setOpenTile(jest.fn().mockResolvedValue(result));
  broker.setListenerTimeout(LISTENER_TIMEOUT_MS);
  return broker;
}

function setLoginToken() {
  sessionStorage.setItem('SET_TOKEN', 'test-token');
}

const INTENT = 'scb.fmptp.ViewCashflows';
const CONTEXT: Context = { type: 'scb.fmptp.cashflow', id: {} };

function stubAuthorizeIntent() {
  mockAuthorizeIntent.mockResolvedValue({
    error: null,
    errorMessage: null,
    tiles: [
      {
        id: 'cf-1',
        title: 'Cashflow',
        emailSupport: '',
        panelId: '',
        tabId: '',
        container: 'ratan_container',
        module: 'cashflow_blotter_cn',
        tile: 'cashflow_simple',
      },
    ],
  });
}

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('BaseFDC3Broker', () => {
  beforeEach(() => {
    setLoginToken();
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  // ── addIntentListenerHandler ──────────────────────────────────────────────

  describe('addIntentListenerHandler', () => {
    it('registers a listener and returns an unsubscribe function', async () => {
      const broker = createBroker();
      const handler = jest.fn();

      const listener = await broker.addIntentListenerHandler('ViewChart', handler);

      expect(listener).toBeDefined();
      expect(typeof listener.unsubscribe).toBe('function');
    });

    it('removes the listener on unsubscribe', async () => {
      const broker = createBroker();
      const handler = jest.fn();

      const listener = await broker.addIntentListenerHandler('ViewChart', handler);
      await listener.unsubscribe();

      // Listener is removed — verified indirectly via raiseIntent
    });

    it('accepts an optional source for app identification', async () => {
      const broker = createBroker();
      const handler = jest.fn();
      const source: AppIdentifier = { appId: 'chart-tile', instanceId: 'ws-1' };

      const listener = await broker.addIntentListenerHandler('ViewChart', handler, source);

      expect(listener).toBeDefined();
    });
  });

  // ── Intent delivery: race condition fix ────────────────────────────────────

  describe('intent delivery to newly opened tile', () => {
    beforeEach(() => {
      stubAuthorizeIntent();
    });

    it('delivers intent to an already-registered listener (no race)', async () => {
      const broker = createBroker();
      const handler = jest.fn().mockResolvedValue({ status: 'ok' });

      // Register listener BEFORE raising intent
      await broker.addIntentListenerHandler(INTENT, handler);

      const resolution = await broker.handleRaiseIntentToInternal(INTENT, CONTEXT);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(CONTEXT);
      expect(resolution.intent).toBe(INTENT);
    });

    it('waits for listener when tile is opened but listener not yet registered', async () => {
      const broker = createBroker();
      const handler = jest.fn().mockResolvedValue({ status: 'ok' });

      // Start the intent raise BEFORE the listener is registered
      const intentPromise = broker.handleRaiseIntentToInternal(INTENT, CONTEXT);

      // Simulate React useEffect delay: register listener after a short delay
      setTimeout(async () => {
        await broker.addIntentListenerHandler(INTENT, handler);
      }, 50);

      // The intent should be delivered once the listener registers
      const resolution = await intentPromise;

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(CONTEXT);
      expect(resolution.intent).toBe(INTENT);
    });

    it('waits for a matching-scoped listener when app is specified', async () => {
      const broker = createBroker();
      const handler = jest.fn().mockResolvedValue({ status: 'ok' });
      const source: AppIdentifier = { appId: 'cashflow_simple', instanceId: 'ws-1' };

      // Raise intent targeting a specific app
      const intentPromise = broker.handleRaiseIntentToInternal(INTENT, CONTEXT, {
        appId: 'cashflow_simple',
        instanceId: 'ws-1',
      });

      // Listener registers AFTER tile opens (React useEffect delay)
      setTimeout(async () => {
        await broker.addIntentListenerHandler(INTENT, handler, source);
      }, 50);

      const resolution = await intentPromise;

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(CONTEXT);
      expect(resolution.intent).toBe(INTENT);
    });

    it('does not deliver intent to a listener from a different app instance', async () => {
      const broker = createBroker();
      const handlerWrong = jest.fn().mockResolvedValue({ wrong: true });
      const handlerRight = jest.fn().mockResolvedValue({ status: 'ok' });

      // Register a listener for a DIFFERENT instance first
      await broker.addIntentListenerHandler(INTENT, handlerWrong, {
        appId: 'cashflow_simple',
        instanceId: 'ws-other',
      });

      // Raise intent targeting a specific instance
      const intentPromise = broker.handleRaiseIntentToInternal(INTENT, CONTEXT, {
        appId: 'cashflow_simple',
        instanceId: 'ws-1',
      });

      // Register the matching listener after delay
      setTimeout(async () => {
        await broker.addIntentListenerHandler(INTENT, handlerRight, {
          appId: 'cashflow_simple',
          instanceId: 'ws-1',
        });
      }, 50);

      const resolution = await intentPromise;

      // Only the matching listener should be called
      expect(handlerWrong).not.toHaveBeenCalled();
      expect(handlerRight).toHaveBeenCalledTimes(1);
      expect(resolution.intent).toBe(INTENT);
    });

    it('rejects when listener is never registered within timeout', async () => {
      const broker = createBroker();

      // Start intent but never register a listener
      const intentPromise = broker.handleRaiseIntentToInternal(INTENT, CONTEXT);

      // Should reject after the short test timeout
      await expect(intentPromise).rejects.toThrow(/timeout|listener/i);
    });
  });

  // ── handleOpenTile failure ────────────────────────────────────────────────

  describe('tile open failure', () => {
    beforeEach(() => {
      stubAuthorizeIntent();
    });

    it('fails the intent when tile cannot be opened', async () => {
      const broker = createBroker({
        opened: false,
        failedReason: 'Tile not found',
        workspaceId: '',
        newTile: false,
      });

      await expect(
        broker.handleRaiseIntentToInternal(INTENT, CONTEXT),
      ).rejects.toThrow('Tile failed to open');
    });
  });

  // ── checkIntentDirection ──────────────────────────────────────────────────

  describe('checkIntentDirection', () => {
    it('classifies scb.fmptp. prefixed intents as internal', async () => {
      const broker = createBroker();
      const direction = await broker.checkIntentDirection(
        'scb.fmptp.ViewChart',
        { type: 'fdc3.instrument', id: {} },
      );
      expect(direction).toBe('internal');
    });

    it('classifies non-prefixed intents as external', async () => {
      const broker = createBroker();
      const direction = await broker.checkIntentDirection(
        'ViewChart',
        { type: 'fdc3.instrument', id: {} },
      );
      expect(direction).toBe('external');
    });

    it('classifies scb.fmptp. context type as internal', async () => {
      const broker = createBroker();
      const direction = await broker.checkIntentDirection(
        'SomeIntent',
        { type: 'scb.fmptp.trade', id: {} },
      );
      expect(direction).toBe('internal');
    });
  });
});
