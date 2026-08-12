import {
  screen,
  waitFor,
} from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import { ForwardedRef } from "react";
import { useDispatch } from "react-redux";
import { renderWithProviders, userEvent } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { cashflowUserStatusUpdate } from '../../../services';
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import preloadState from "../../store/state";
import {
  EarlyMaterializationWrap,
} from "./EarlyMaterializationWrap";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Root/common/utils/featureFlagController", () => ({
  featureScopedEnabled: (ec) => true,
}));

jest.mock("src/Cashflow_CN/components/CommonCommentAction", () => {
  const mockComponent = ({
    children,
    title,
    onSubmit,
    onClose,
  }) => {
    return <div>
      <span>{title}</span>
      <button data-testid="test-submit" onClick={() => onSubmit("test")}>submit</button>
      <button data-testid="test-close" onClick={() => onClose(true)}>close</button>
      <div>{children}</div>
    </div>
  }
  return {
    __esModule: true,
    default: mockComponent,
  }
});

jest.mock("src/Cashflow_CN/components/CashflowDetails/MultiExceptions/components/Affirmation", () => {
  const React = require("react");
  const mockComponent = React.forwardRef((_, ref: ForwardedRef<any>) => {
    if (ref && typeof ref === "object" && "current" in ref) {
      ref.current = {
        getForm: () => ({
          validateFields: () => Promise.resolve(),
          getFieldsValue: () => Promise.resolve({}),
        }),
      };
    }
    return <div></div>;
  });
  return {
    __esModule: true,
    default: mockComponent,
  };
});
jest.mock('../../../services', () => ({
  cashflowUserStatusUpdate: jest.fn(),
}));

jest.mock("../../store/actions", () => ({
  aggridDeselectAll: jest.fn(),
  earlyMaterializationWorkflowAction: jest.fn(),
  updateCashflow: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

jest.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: jest.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

describe("EarlyMaterializationWrap", () => {
  let dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  it("ManualAffirmed", async() => {
    (cashflowUserStatusUpdate as jest.Mock).mockResolvedValue({
      success: true,
      errorMessage: null,
      responses: [],
    });
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const res = renderWithProviders(
      <ThemeProvider>
        <EarlyMaterializationWrap />,
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          earlyMaterializationWorkflow: {
            isOpenDialog: true,
            action: "Materialize",
            data: [_merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData)],
          },
        },
      }
    );
    const { queryByTestId } = res;
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    await waitFor(() =>
      expect(screen.queryByText('Action Success !')).toBeInTheDocument()
    );
    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
  
  it("ManualAffirmed2", async() => {
    (cashflowUserStatusUpdate as jest.Mock).mockResolvedValue({
      success: false,
      errorMessage: null,
      responses: [
        {
          cashflowId: '123',
          businessVersion: '1',
          cashflowVersion: '1',
          errorMessage: 'Some error occurred',
          minorVersion: '1',
          scbmlMessage: '',
          success: false,
        },
      ],
    });
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const res = renderWithProviders(
      <ThemeProvider>
        <EarlyMaterializationWrap />,
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          earlyMaterializationWorkflow: {
            isOpenDialog: true,
            action: "Materialize",
            data: [_merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData)],
          },
        },
      }
    );
    const { queryByTestId } = res;
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    await waitFor(() =>
      expect(screen.queryByText('123 failed: Some error occurred')).toBeInTheDocument()
    );

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
  
  it("resp code other", () => {
    (cashflowUserStatusUpdate as jest.Mock).mockResolvedValue({
      success: false,
      errorMessage: null,
      responses: [
        {
          cashflowId: '123',
          businessVersion: '1',
          cashflowVersion: '1',
          errorMessage: 'Some error occurred',
          minorVersion: '1',
          scbmlMessage: '',
          success: true,
        },
      ],
    });
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const res = renderWithProviders(
      <ThemeProvider>
        <EarlyMaterializationWrap />,
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          earlyMaterializationWorkflow: {
            isOpenDialog: true,
            action: "Materialize",
            data: [_merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData)],
          },
        },
      }
    );
    const { queryByTestId } = res;
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });

  it("query failed", () => {
    (cashflowUserStatusUpdate as jest.Mock).mockRejectedValue(
      new Error("mock query failed")
    );
    
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const res = renderWithProviders(
      <ThemeProvider>
        <EarlyMaterializationWrap />,
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          earlyMaterializationWorkflow: {
            isOpenDialog: true,
            action: "Materialize",
            data: [_merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData)],
          },
        },
      }
    );
    const { queryByTestId } = res;
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
});