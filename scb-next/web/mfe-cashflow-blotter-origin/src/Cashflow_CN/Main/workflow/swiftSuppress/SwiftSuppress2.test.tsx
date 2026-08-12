import userEvent from "@testing-library/user-event";
import _merge from "lodash/merge";
import { useDispatch } from "react-redux";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import preloadState from "../../store/state";
import { SwiftSuppressWrap } from "./SwiftSuppress";

  vi.mock("src/Cashflow_CN/components/CommonCommentAction", async () => {
    const mockComponent = ({
      children,
      title,
      onSubmit,
      onReject,
      onClose,
    }) => {
      return <div>
        <span>{title}</span>
        <button data-testid="test-submit" onClick={() => onSubmit("test")}>submit</button>
        <button data-testid="test-reject" onClick={() => onReject?.()}>submit</button>
        <button data-testid="test-close" onClick={() => onClose(true)}>close</button>
        <div>{children}</div>
      </div>
    }
    return {
      __esModule: true,
      default: mockComponent,
    }
  });

  vi.mock("src/Cashflow_CN/services/graphql", async () => {
    return {
      queryCashflow: vi.fn(async () => ({
        cashflowUltraQuery: {
          results: [],
        },
      })),
    };
  });
  
  vi.mock("../../store/actions", async () => ({
    aggridDeselectAll: vi.fn(),
    suppressWorkflowAction: vi.fn(),
    updateCashflow: vi.fn(),
  }));
  
  vi.mock("react-redux", async () => ({
    ...(await vi.importActual("react-redux")),
    useDispatch: vi.fn(),
  }));

describe("Swift Suppress Dialog", () => {
  let dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as vi.Mock).mockReturnValue(dispatch);
  });
  it("SwiftSuppressionMaker", async () => {
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <SwiftSuppressWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          suppressWorkflow: {
            isOpenDialog: true,
            action: "SwiftSuppressionMaker",
            data: [_merge(mockCashflow1, swiftSuppressCashflowData)],
          },
        },
      }
    );
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
  
  it("UndoSwiftSuppressionMaker", async () => {
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <SwiftSuppressWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          suppressWorkflow: {
            isOpenDialog: true,
            action: "UndoSwiftSuppressionMaker",
            data: [_merge(mockCashflow1, swiftSuppressCashflowData)],
          },
        },
      }
    );
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
  
  it("CashflowUnSuppressionMaker", async () => {
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <SwiftSuppressWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          suppressWorkflow: {
            isOpenDialog: true,
            action: "CashflowUnSuppressionMaker",
            data: [_merge(mockCashflow1, swiftSuppressCashflowData)],
          },
        },
      }
    );
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
  
  it("CashflowSuppressionMaker", async () => {
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <SwiftSuppressWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          suppressWorkflow: {
            isOpenDialog: true,
            action: "CashflowSuppressionMaker",
            data: [_merge(mockCashflow1, swiftSuppressCashflowData)],
          },
        },
      }
    );
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
  
  it("SwiftSuppressionChecker", async () => {
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <SwiftSuppressWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          suppressWorkflow: {
            isOpenDialog: true,
            action: "SwiftSuppressionChecker",
            data: [_merge(mockCashflow1, swiftSuppressCashflowData)],
          },
        },
      }
    );
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
});