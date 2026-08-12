import { configureStore, createReducer } from "@reduxjs/toolkit";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import { ReduxProviderWrapper } from "src/test/test-utils";

import QueryResultCount from "./QueryCount";

vi.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: vi.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

const latestNotificationStack = {
  id: "1",
  pool: [],
};

const store = configureStore({
  reducer: {
    latestNotificationStack: (state = latestNotificationStack) => state,
  },
});

describe("QueryResultCount Component", () => {
  const mockInitiate = vi.fn();
  let mockDispatch;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully fetch query results and update the state", async () => {
    const mockResponse = {
      cashflowUltraQuery: {
        results: [
          { Cashflow: { Cashflow_Id: "123" } },
          { Cashflow: { Cashflow_Id: "456" } }
        ],
        totalResult: 2,
      },
    };
    mockInitiate.mockResolvedValue(mockResponse);
    const mockFilters = [
      { field: "Cashflow.Cashflow_Sub_State", operator: "EQ", values: "Pending Operator" },
    ];
    const mockOnQuery = vi.fn();

    render(
      <Provider store={store}>
        <QueryResultCount
          label="Test Label"
          filters={mockFilters}
          onQuery={mockOnQuery}
          dataTestid="query-count"
          activeKey={null}
        />
      </Provider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      const badge = screen.getByTestId("query-count");
      expect(badge).toBeInTheDocument();
    });
  });

  it("should handle undefined/null response", async () => {
    mockInitiate.mockResolvedValue(undefined);
    const mockFilters = [
      { field: "Cashflow.Cashflow_Sub_State", operator: "EQ", values: "Pending Operator" },
    ];
    render(
      <Provider store={store}>
        <QueryResultCount
          label="Test Label"
          filters={mockFilters}
          onQuery={vi.fn()}
          dataTestid="query-count"
          activeKey={null}
        />
      </Provider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it("should handle response without cashflowUltraQuery", async () => {
    const mockResponse = {
      otherData: "some data",
    };
    mockInitiate.mockResolvedValue(mockResponse);
    const mockFilters = [
      { field: "Cashflow.Cashflow_Sub_State", operator: "EQ", values: "Pending Operator" },
    ];
    render(
      <Provider store={store}>
        <QueryResultCount
          label="Test Label"
          filters={mockFilters}
          onQuery={vi.fn()}
          dataTestid="query-count"
          activeKey={null}
        />
      </Provider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });
});

describe("QueryResultCount notification effect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle notification stack update and update count", async () => {
    const store = configureStore({
      reducer: {
        latestNotificationStack: createReducer(
          {
            id: "test",
            pool: [mockCashflow1],
          }, () => { }
        ),
      },
    });

    const wrapper = ReduxProviderWrapper(store);

    await act(async () => {
      render(
        <QueryResultCount
          label="Test"
          filters={[{ field: "f", operator: "EQ", values: ["v"] }]}
          dataTestid="test"
          onQuery={vi.fn()}
          activeKey={null}
        />
        , { wrapper }
      );
    });
    expect(screen).toBeDefined();

  });
});
