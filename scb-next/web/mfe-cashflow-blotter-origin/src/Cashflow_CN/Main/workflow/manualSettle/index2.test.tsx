import {
    fireEvent,
    renderWithProviders,
    screen,
    userEvent,
  } from "@Test/test-utils";
  import { GetContextMenuItemsParams } from "ag-grid-community";
  import { message, Modal } from "antd";
  import _cloneDeep from "lodash/cloneDeep";
  import _merge from "lodash/merge";
  import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";

  import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
  import { mockCashflow1 } from "../../../test/mockData/cashflow";
  import { WorkflowActionExtraOptions } from "../../common/interface";
  import preloadState from "../../store/state";
  import { manualSettleRightMenu, ManualSettleWrap } from "./index";
  
  vi.mock("src/Root/common/utils/featureFlagController");
  
  beforeEach(() => {
    // @ts-ignore
    featureScopedEnabled.mockImplementation(() => true);
  });
  
  afterAll(() => {
    vi.clearAllMocks();
  });
  
  vi.mock("src/Cashflow_CN/components/CommonCommentAction", () => {
    const mockComponent = ({ children, title, onSubmit, onReject, onClose }) => {
      return (
        <div>
          <span>{title}</span>
          <button
            data-testid="test-submit"
            onClick={() => onSubmit("testSubmit", true)}
          >
            submit
          </button>
          <button data-testid="test-reject" onClick={() => onReject?.()}>
            reject
          </button>
          <button data-testid="test-close" onClick={() => onClose(true)}>
            close
          </button>
          <div>{children}</div>
        </div>
      );
    };
    return {
      __esModule: true,
      default: mockComponent,
    };
  });
  
  vi.mock("../../../services", () => {
    return {
      getSettleSwiftStatus: vi.fn(async () => [
        "AMH Error",
        "Check in FMSGW",
        "Check in FMSRE",
        "FMSGW Deleted",
        "FMSGW Error",
        "FMSRE Deleted",
        "FMSRE Error",
        "Manual Delete",
        "SCPAY Error",
      ]),
      postSettleChecker: vi.fn(),
      postSettleMaker: vi.fn(),
    };
  });
  
  describe("Manual Settle Right Menu", () => {
    it("Disabled Manual Settlement Menu", async () => {
      // @ts-ignore
      featureScopedEnabled.mockImplementation(() => false);
      const dispatch = vi.fn();
      const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
        dispatch,
        messageApi: message,
        modalApi: Modal,
      };
      const manualSettleMakerCashflowData = {
        Cashflow: {
          Cashflow_State: "RELEASED",
          Cashflow_Swift_Status: "SCPAY Error",
        },
      };
      const mockAggridContextMenuItemParams = {
        node: {
          data: _merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData),
        },
        api: {
          getSelectedRows: () => [
            _merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData),
          ],
        },
      };
      const rm = manualSettleRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );
      expect(rm).toBeNull();
    });
  });
  describe("Manual Settle Dialog", () => {
    it("should be in the document", async () => {
      const { queryByTestId } = renderWithProviders(
        <ThemeProvider>
          <ManualSettleWrap />
        </ThemeProvider>,
        {
          preloadedState: {
            ...preloadState,
            manualSettleWorkflow: {
              role: "Maker",
              isOpenDialog: true,
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
    it("should be in the document", async () => {
      const { queryByTestId } = renderWithProviders(
        <ThemeProvider>
          <ManualSettleWrap />
        </ThemeProvider>,
        {
          preloadedState: {
            ...preloadState,
            manualSettleWorkflow: {
              role: "Checker",
              isOpenDialog: true,
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
  });
  