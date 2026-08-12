import userEvent from "@testing-library/user-event";
import _merge from "lodash/merge";
import { useDispatch } from "react-redux";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import preloadState from "../../store/state";
import { SwiftSuppressWrap } from "./SwiftSuppress";

  jest.mock("src/Cashflow_CN/components/CommonCommentAction", () => {
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

  jest.mock("src/Cashflow_CN/services/graphql", () => {
    return {
      queryCashflow: jest.fn(async () => ({
        cashflowUltraQuery: {
          results: [],
        },
      })),
    };
  });
  
  jest.mock("../../store/actions", () => ({
    aggridDeselectAll: jest.fn(),
    suppressWorkflowAction: jest.fn(),
    updateCashflow: jest.fn(),
  }));
  
  jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn(),
  }));

describe("Swift Suppress Dialog", () => {
  let dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
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