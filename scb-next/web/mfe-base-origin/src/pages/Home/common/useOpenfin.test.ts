import { act, render } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { MockedFunction } from "jest-mock";
import React from "react";
import * as openFinFdc3 from "openfin-fdc3";
import useOpenfin, { waitTillLogin } from "./useOpenfin";
import { getLocalStorage } from "../../../utils/common";
import { fdc3InitUtil } from "./util";

vi.mock("../../../utils/common", () => {
  return {
    getLocalStorage: vi.fn(() => ({
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    })),
    getEnv: vi.fn(() => "LOCAL"),
  };
});

const mockDispatchOpenTile = vi.fn();
const mockUnsubscribe = vi.fn();

vi.mock("openfin-fdc3", () => ({
  addIntentListener: vi.fn(async (_intent, handler: IntentHandler) => {
    capturedIntentHandler = handler;
    return { unsubscribe: mockUnsubscribe };
  }),
}));

vi.mock("../../../hooks/dispathcer", () => {
  return { default: vi.fn(() => ({
    dispatchOpenTile: mockDispatchOpenTile,
  })) };
});

vi.mock("./util", () => ({
  fdc3InitUtil: vi.fn(),
}));

type IntentContext = {
  type: string;
  id?: { tradeId?: string };
  filters?: { field: string; operator: string; values: unknown }[];
  parameters?: Record<string, unknown>;
  target?: string;
};

type IntentHandler = (context: IntentContext) => void;

type HookApi = ReturnType<typeof useOpenfin>;
type MutableStorage = Storage & { length: number };
const mockedGetLocalStorage =
  getLocalStorage as unknown as MockedFunction<typeof getLocalStorage>;
const mockedFdc3InitUtil =
  fdc3InitUtil as unknown as MockedFunction<typeof fdc3InitUtil>;
const mockOpenFinFdc3 = openFinFdc3 as unknown as {
  addIntentListener: MockedFunction<
    (intent: string, handler: IntentHandler) => Promise<{ unsubscribe: () => void }>
  >;
};

let latestHook: HookApi | undefined;
let capturedIntentHandler: IntentHandler | undefined;

const HookHarness = () => {
  latestHook = useOpenfin();
  return null;
};

const createStorage = (token: string | null): Storage => {
  const store = new Map<string, string>();

  if (token !== null) {
    store.set("SET_TOKEN", token);
  }

  const storage: MutableStorage = {
    length: store.size,
    clear: vi.fn(() => {
      store.clear();
      storage.length = store.size;
    }),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
      storage.length = store.size;
    }),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
      storage.length = store.size;
    }),
  };

  return storage as Storage;
};

const resetHookMocks = () => {
  latestHook = undefined;
  capturedIntentHandler = undefined;
  mockDispatchOpenTile.mockReset();
  mockUnsubscribe.mockReset();
  mockOpenFinFdc3.addIntentListener.mockClear();
  mockedFdc3InitUtil.mockImplementation(
    (
      _windowFin: unknown,
      _fdc3: unknown,
      _openFinFdc3: unknown,
      _env: string,
      init: () => void
    ) => {
      init();
    }
  );
  Object.defineProperty(window, "fin", {
    configurable: true,
    writable: true,
    value: {},
  });
};

describe("waitTillLogin", () => {
  beforeEach(() => {
    resetHookMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("resolves immediately without starting polling when token already exists", async () => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    const setIntervalSpy = vi.spyOn(global, "setInterval");

    await expect(waitTillLogin()).resolves.toBe(true);

    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it("resolves false after timeout when token never appears", async () => {
    vi.useFakeTimers();
    mockedGetLocalStorage.mockReturnValue(createStorage(null));

    const loginPromise = waitTillLogin();

    vi.advanceTimersByTime(301000);

    await expect(loginPromise).resolves.toBe(false);
  });

  it("resolves true when token appears during polling", async () => {
    vi.useFakeTimers();
    const getItem = jest
      .fn<Storage["getItem"]>()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce("token");
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");
    const storage = createStorage(null);
    storage.getItem = getItem;
    mockedGetLocalStorage.mockReturnValue(storage);

    const loginPromise = waitTillLogin();

    vi.advanceTimersByTime(2000);

    await expect(loginPromise).resolves.toBe(true);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});

describe("useOpenfin", () => {
  beforeEach(() => {
    resetHookMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("registers the launch intent listener and exposes state helpers", async () => {
    const { unmount } = render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    expect(fdc3InitUtil).toHaveBeenCalled();
    expect(mockOpenFinFdc3.addIntentListener).toHaveBeenCalledWith(
      "scb.ViewLaunch",
      expect.any(Function)
    );
    expect(latestHook?.channelMessage).toBeUndefined();

    act(() => {
      latestHook?.setChannelMessage("message");
    });
    expect(latestHook?.channelMessage).toBe("message");

    act(() => {
      latestHook?.clearMessage();
    });
    expect(latestHook?.channelMessage).toBeUndefined();

    act(() => {
      latestHook?.clearListener();
    });
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it("dispatches the cashflow tile when a cashflow intent includes a trade id", async () => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    await act(async () => {
      capturedIntentHandler?.({
        type: "scb.fmptp.cashflows",
        id: { tradeId: "T1" },
      });
      await Promise.resolve();
    });

    expect(mockDispatchOpenTile).toHaveBeenCalledWith(
      {
        filters: [
          {
            field: "Trade_Id",
            operator: "EQ",
            values: "T1",
          },
        ],
      },
      "cashflow_cn"
    );
  });

  it("dispatches the cashflow tile when a cashflow intent includes filters", async () => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    await act(async () => {
      capturedIntentHandler?.({
        type: "scb.fmptp.cashflows",
        filters: [
          {
            field: "Trade_Status",
            operator: "EQ",
            values: "LIVE",
          },
        ],
      });
      await Promise.resolve();
    });

    expect(mockDispatchOpenTile).toHaveBeenCalledWith(
      {
        filters: [
          {
            field: "Trade_Status",
            operator: "EQ",
            values: "LIVE",
          },
        ],
      },
      "cashflow_cn"
    );
    expect(mockDispatchOpenTile).toHaveBeenCalledTimes(1);
  });

  it("dispatches the trade tile when a trade intent includes a trade id", async () => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    await act(async () => {
      capturedIntentHandler?.({
        type: "scb.fmptp.trade.query",
        id: { tradeId: "T2" },
      });
      await Promise.resolve();
    });

    expect(mockDispatchOpenTile).toHaveBeenCalledWith(
      {
        intent: "ViewTradeDetails",
        context: {
          tradeId: "T2",
        },
      },
      "trade"
    );
  });

  it("dispatches the trade tile when a trade intent includes filters", async () => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    await act(async () => {
      capturedIntentHandler?.({
        type: "scb.fmptp.trade.query",
        filters: [
          {
            field: "Book",
            operator: "EQ",
            values: "SG",
          },
        ],
      });
      await Promise.resolve();
    });

    expect(mockDispatchOpenTile).toHaveBeenCalledWith(
      {
        intent: "SearchTrades",
        context: {
          filters: [
            {
              field: "Book",
              operator: "EQ",
              values: "SG",
            },
          ],
        },
      },
      "trade"
    );
    expect(mockDispatchOpenTile).toHaveBeenCalledTimes(1);
  });

  it("dispatches generic parameters for the general context type", async () => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    await act(async () => {
      capturedIntentHandler?.({
        type: "scb.fmptp.general.parameters",
        parameters: { foo: "bar" },
        target: "target-tile",
      });
      await Promise.resolve();
    });

    expect(mockDispatchOpenTile).toHaveBeenCalledWith(
      { foo: "bar" },
      "target-tile"
    );
  });

  it.each([
    {
      name: "cashflow intent without trade id",
      context: { type: "scb.fmptp.cashflows" },
    },
    {
      name: "trade intent without trade id",
      context: { type: "scb.fmptp.trade.query" },
    },
    {
      name: "trade intent with empty filters",
      context: { type: "scb.fmptp.trade.query", filters: [] },
    },
    {
      name: "unsupported context type",
      context: { type: "scb.fmptp.unsupported" },
    },
  ])("does not dispatch for $name", async ({ context }) => {
    mockedGetLocalStorage.mockReturnValue(createStorage("token"));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    await act(async () => {
      capturedIntentHandler?.(context);
      await Promise.resolve();
    });

    expect(mockDispatchOpenTile).not.toHaveBeenCalled();
  });

  it("ignores intents when login never completes", async () => {
    vi.useFakeTimers();
    mockedGetLocalStorage.mockReturnValue(createStorage(null));
    render(React.createElement(HookHarness));

    await act(async () => Promise.resolve());

    act(() => {
      capturedIntentHandler?.({
        type: "scb.fmptp.general.parameters",
        parameters: { foo: "bar" },
        target: "target-tile",
      });
    });

    vi.advanceTimersByTime(301000);
    await act(async () => Promise.resolve());

    expect(mockDispatchOpenTile).not.toHaveBeenCalled();
  });
});
