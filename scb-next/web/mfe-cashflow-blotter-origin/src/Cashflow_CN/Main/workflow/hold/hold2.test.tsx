import { useDispatch } from "react-redux";
import { renderWithProviders, userEvent } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import {
    mockCashflow1,
  } from "../../../test/mockData/cashflow";
import preloadState from "../../store/state";
import { HoldActionName,HoldWrap } from "./index";

vi.mock("src/Cashflow_CN/components/CommonCommentAction", async () => {
    const mockComponent = ({ title, onSubmit, onClose, testId, onReject }) => {
        return <div data-testid={testId}>
            <span>{title}</span>
            <button data-testid="test-submit" onClick={() => onSubmit()}>submit</button>
            <button data-testid="test-close" onClick={() => onClose(true)}>close</button>
            <button data-testid="test-reject" onClick={() => onReject?.()}>reject</button>
        </div>
    }
    return {
        __esModule: true,
        default: mockComponent,
    }
});

vi.mock("src/Cashflow_CN/Main/store/actions", async () => ({
    aggridDeselectAll: vi.fn(),
    holdWorkflowAction: vi.fn(),
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

describe("HoldWrap", () => {
    let dispatch = vi.fn();
    
    beforeEach(() => {
      vi.clearAllMocks();
      (useDispatch as vi.Mock).mockReturnValue(dispatch);
    });
    it("HoldWrap", () => {
        const { queryByTestId } = renderWithProviders(
            <ThemeProvider>
                <HoldWrap />
            </ThemeProvider>,
            {
                preloadedState: {
                    ...preloadState,
                    holdWorkflow: {
                        isOpenHold: true,
                        action: HoldActionName.UNHOLD,
                        data: [
                            {
                                Cashflow: {
                                    Cashflow_State: "HOLD"
                                }
                            }
                        ]
                    },
                },
            }
        );
        expect(queryByTestId(HoldActionName.UNHOLD)).toBeInTheDocument();

        const submitBtn = queryByTestId("test-submit");
        expect(submitBtn).toBeInTheDocument();
        userEvent.click(submitBtn!);
        
        const closeBtn = queryByTestId("test-close");
        expect(closeBtn).toBeInTheDocument();
        userEvent.click(closeBtn!);
    });
    it("HoldWrap - 2", () => {
        const { queryByTestId } = renderWithProviders(
            <ThemeProvider>
                <HoldWrap />
            </ThemeProvider>,
            {
                preloadedState: {
                    ...preloadState,
                    holdWorkflow: {
                        action:HoldActionName.HOLD,
                        isOpenHold: true,
                    },
                },
            }
        );
        expect(queryByTestId(HoldActionName.HOLD)).toBeInTheDocument();

        const submitBtn = queryByTestId("test-submit");
        expect(submitBtn).toBeInTheDocument();
        userEvent.click(submitBtn!);
    });
    it("HoldWrap - 3", () => {
        const { queryByTestId } = renderWithProviders(
            <ThemeProvider>
                <HoldWrap />
            </ThemeProvider>,
            {
                preloadedState: {
                    ...preloadState,
                    holdWorkflow: {
                        isOpenHold: true,
                        action:HoldActionName.HOLD,
                        data: [
                            {
                                Cashflow: {
                                    Cashflow_State: "WAITING"
                                }
                            }
                        ]
                    },
                },
            }
        );
        expect(queryByTestId(HoldActionName.HOLD)).toBeInTheDocument();

        const submitBtn = queryByTestId("test-submit");
        expect(submitBtn).toBeInTheDocument();
        userEvent.click(submitBtn!);
    });
    it("HoldWrap - 4", () => {
        const { queryByTestId } = renderWithProviders(
            <ThemeProvider>
                <HoldWrap />
            </ThemeProvider>,
            {
                preloadedState: {
                    ...preloadState,
                    holdWorkflow: {
                        action: HoldActionName.SEND_TO_WAITING,
                        isOpenHold: true,
                    },
                },
            }
        );
        expect(queryByTestId("Send_to_WAITING")).toBeInTheDocument();

        const submitBtn = queryByTestId("test-submit");
        expect(submitBtn).toBeInTheDocument();
        userEvent.click(submitBtn!);
    });
});

describe("Hold Dialog", () => {
  let dispatch = vi.fn();
    
  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as vi.Mock).mockReturnValue(dispatch);
  });
  it("should be in the document", async () => {
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <HoldWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          holdWorkflow: {
            action: "Hold",
            isOpenHold: true,
            data: [mockCashflow1],
          },
        },
      }
    );
    expect(screen).toBeDefined();
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);
  });
  it("Unhold should be in the document", async () => {
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <HoldWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          holdWorkflow: {
            isOpenHold: true,
            action: "UnHold",
            data: [
              {
                Cashflow: {
                  Cashflow_Id: "123456",
                  Cashflow_State: "HOLD",
                  Cashflow_Sub_State_Updater: '123456'
                },
              }
            ],
          },
        },
      }
    );
    expect(screen).toBeDefined();
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);
  });
  it("Send to Waiting should be in the document", async () => {
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <HoldWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          holdWorkflow: {
            isOpenHold: true,
            action: "Send to WAITING",
            data: [
              {
                Cashflow: {
                  Cashflow_Id: "123456",
                  Cashflow_State: "HOLD",
                  Cashflow_Sub_State_Updater: '123456'
                },
              }
            ],
          },
        },
      }
    );
    expect(screen).toBeDefined();
    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);
  });
  it("Unhold should be in the document", async () => {
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <HoldWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          holdWorkflow: {
            action: HoldActionName.HOLD,
            isOpenHold: true,
            data: [
              {
                Cashflow: {
                  Cashflow_Id: "123456",
                  Cashflow_State: "HOLD",
                  Cashflow_Sub_State_Updater: '123456'
                },
              }
            ],
          },
        },
      }
    );
    expect(screen).toBeDefined();

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);

    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);
  });
});