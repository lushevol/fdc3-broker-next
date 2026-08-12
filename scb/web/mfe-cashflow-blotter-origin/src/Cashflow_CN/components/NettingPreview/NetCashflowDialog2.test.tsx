import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";
import { renderWithProviders, userEvent } from "src/test/test-utils";

import ThemeProvider from "../../../Root/common/component/MfeThemeProvider";
import NettingPreviewDialog from "./NetCashflowDialog";
import { mockRequestParams } from "./NetCashflowDialog.test";

jest.mock("Import/ratancomponents", () => {
    const mockComponent = ({
        title,
        onClose,
        actions,
        children,
        ...rest
    }) => {
        return <>
            <button data-testid={title ? (title.toLowerCase().replaceAll(/\s/g, "-") + "-test-close") : "test-close"} onClick={() => onClose()}>close</button>
            <div>{actions}</div>
            <div {...rest}>{children}</div>
        </>
    }
    return {
        __esModule: true,
        MuiDialog: mockComponent,
        DataGridClasses: {},
        DataGrid: mockComponent,
    }
})

jest.spyOn(require("./NetCashflowDialogUtils"), "getNettingPreviewApi").mockImplementation(() => {
    return jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            data: {
                resultList: [
                    {
                        originalCashflowList: [{}],
                        previewCashflowList: [{}],
                    }
                ]
            }
        })
    });
});

afterAll(() => {
    jest.clearAllMocks();
});

describe("NettingPreviewDialog", () => {
    it("query", () => {  
      const tobeNettedRequest = {
        requestParams: mockRequestParams,
      };
      const handleCashflowNetted = () => Promise.resolve([]);
      const handleCashflowUpdate = () => Promise.resolve([]);
      const { queryByTestId } = renderWithProviders(
        <ThemeProvider>
          <NettingPreviewDialog
            onCashflowNetted={handleCashflowNetted}
            onCashflowUpdate={handleCashflowUpdate}
            tobeNettedRequest={tobeNettedRequest}
            onClose={() => {}}
          />
        </ThemeProvider>,
        {
          preloadedState: {
            ...defaultPreloadedState,
            netWorkflow: {
              nettingStatus: "",
              isCcilMethod: false,
              netType: NetType.BeneficiaryBICNetting,
            },
          },
        }
      );

      const close = queryByTestId("update-affirmation-test-close");
      expect(close).toBeInTheDocument();
      userEvent.click(close!);

      const rootClose = queryByTestId("cashflow-netting-preview-test-close");
      expect(rootClose).toBeInTheDocument();
      userEvent.click(rootClose!);
    });
    it("query2", () => {
        jest.spyOn(require("./NetCashflowDialogUtils"), "getNettingPreviewApi").mockImplementation(() => {
            return jest.fn().mockImplementation(() => {
                return Promise.resolve({
                    status: 500,
                    data: {}
                })
            });
        });
        const tobeNettedRequest = {
          requestParams: mockRequestParams,
        };
        const handleCashflowNetted = () => Promise.resolve([]);
        const handleCashflowUpdate = () => Promise.resolve([]);
        const { queryByTestId } = renderWithProviders(
          <ThemeProvider>
            <NettingPreviewDialog
              onCashflowNetted={handleCashflowNetted}
              onCashflowUpdate={handleCashflowUpdate}
              tobeNettedRequest={tobeNettedRequest}
              onClose={() => {}}
            />
          </ThemeProvider>,
          {
            preloadedState: {
              ...defaultPreloadedState,
              netWorkflow: {
                nettingStatus: "",
                isCcilMethod: false,
                netType: NetType.BeneficiaryBICNetting,
              },
            },
          }
        );
  
        const close = queryByTestId("update-affirmation-test-close");
        expect(close).toBeInTheDocument();
    });
    
    it("query3", () => {
        jest.spyOn(require("./NetCashflowDialogUtils"), "getNettingPreviewApi").mockImplementation(() => {
            return jest.fn().mockImplementation(() => {
                return Promise.resolve({
                    status: 200,
                    data: {
                        resultList: [
                            {}
                        ]
                    }
                })
            });
        });
        const tobeNettedRequest = {
          requestParams: mockRequestParams,
        };
        const handleCashflowNetted = () => Promise.resolve([]);
        const handleCashflowUpdate = () => Promise.resolve([]);
        const { queryByTestId } = renderWithProviders(
          <ThemeProvider>
            <NettingPreviewDialog
              onCashflowNetted={handleCashflowNetted}
              onCashflowUpdate={handleCashflowUpdate}
              tobeNettedRequest={tobeNettedRequest}
              onClose={() => {}}
            />
          </ThemeProvider>,
          {
            preloadedState: {
              ...defaultPreloadedState,
              netWorkflow: {
                nettingStatus: "",
                isCcilMethod: false,
                netType: NetType.BeneficiaryBICNetting,
              },
            },
          }
        );
  
        const close = queryByTestId("update-affirmation-test-close");
        expect(close).toBeInTheDocument();
    });
    
    it("query4", () => {
        jest.spyOn(require("./NetCashflowDialogUtils"), "getNettingPreviewApi").mockImplementation(() => {
            return jest.fn().mockImplementation(() => {
                return Promise.resolve({
                    status: 200,
                    data: {
                        resultList: [
                            {
                                originalCashflowList: [{}],
                                previewCashflowList: [],
                            }
                        ]
                    }
                })
            });
        });
        const tobeNettedRequest = {
          requestParams: mockRequestParams,
        };
        const handleCashflowNetted = () => Promise.resolve([]);
        const handleCashflowUpdate = () => Promise.resolve([]);
        const { queryByTestId } = renderWithProviders(
          <ThemeProvider>
            <NettingPreviewDialog
              onCashflowNetted={handleCashflowNetted}
              onCashflowUpdate={handleCashflowUpdate}
              tobeNettedRequest={tobeNettedRequest}
              onClose={() => {}}
            />
          </ThemeProvider>,
          {
            preloadedState: {
              ...defaultPreloadedState,
              netWorkflow: {
                nettingStatus: "",
                isCcilMethod: false,
                netType: NetType.BeneficiaryBICNetting,
              },
            },
          }
        );
  
        const close = queryByTestId("update-affirmation-test-close");
        expect(close).toBeInTheDocument();
    });
    
    it("query failed", () => {
        jest.spyOn(require("./NetCashflowDialogUtils"), "getNettingPreviewApi").mockImplementation(() => {
            return jest.fn().mockImplementation(() => {
              return Promise.reject(new Error("mock getting netting preview api failed"))
            });
        });
        const tobeNettedRequest = {
          requestParams: mockRequestParams,
        };
        const handleCashflowNetted = () => Promise.resolve([]);
        const handleCashflowUpdate = () => Promise.resolve([]);
        const { queryByTestId } = renderWithProviders(
          <ThemeProvider>
            <NettingPreviewDialog
              onCashflowNetted={handleCashflowNetted}
              onCashflowUpdate={handleCashflowUpdate}
              tobeNettedRequest={tobeNettedRequest}
              onClose={() => {}}
            />
          </ThemeProvider>,
          {
            preloadedState: {
              ...defaultPreloadedState,
              netWorkflow: {
                nettingStatus: "",
                isCcilMethod: false,
                netType: NetType.BeneficiaryBICNetting,
              },
            },
          }
        );
  
        const close = queryByTestId("update-affirmation-test-close");
        expect(close).toBeInTheDocument();
    });
});