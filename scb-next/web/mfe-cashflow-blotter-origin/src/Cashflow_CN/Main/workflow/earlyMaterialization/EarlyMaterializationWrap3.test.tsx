import {
  screen,
  waitFor,
} from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import React, { ForwardedRef } from "react";
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
  vi.clearAllMocks();
});

vi.mock("src/Root/common/utils/featureFlagController", async () => ({
  featureScopedEnabled: (ec) => true,
}));

vi.mock("src/Cashflow_CN/components/CommonCommentAction", async () => {
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

vi.mock("src/Cashflow_CN/components/CashflowDetails/MultiExceptions/components/Affirmation", async () => {
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
vi.mock('../../../services', async () => ({
  cashflowUserStatusUpdate: vi.fn(),
}));

vi.mock("../../store/actions", async () => ({
  aggridDeselectAll: vi.fn(),
  earlyMaterializationWorkflowAction: vi.fn(),
  updateCashflow: vi.fn(),
}));

vi.mock("react-redux", async () => ({
  ...(await vi.importActual("react-redux")),
  useDispatch: vi.fn(),
}));

vi.mock("src/Cashflow_CN/services/graphql", async () => {
  return {
    queryCashflow: vi.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

describe("EarlyMaterializationWrap", () => {
  let dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as vi.Mock).mockReturnValue(dispatch);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
  it("ManualAffirmed", async() => {
    (cashflowUserStatusUpdate as vi.Mock).mockResolvedValue({
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
    (cashflowUserStatusUpdate as vi.Mock).mockResolvedValue({
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
    (cashflowUserStatusUpdate as vi.Mock).mockResolvedValue({
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
    (cashflowUserStatusUpdate as vi.Mock).mockRejectedValue(
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
