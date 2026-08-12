import { configureStore, createReducer } from "@reduxjs/toolkit";
import { fireEvent, render } from "@testing-library/react";
import { RuleStatusType } from "src/Cashflow_BIC_Netting_Static_Table/state/types";
import { ReduxProviderWrapper } from "src/test/test-utils";

import {
  StaticRuleRow,
} from "../../services/api.type";
import { ActionType } from "../../state/types";
import createStore from "../../store";
import { RuleDetail } from "./RuleDetail";

vi.mock("src/Root/analysis/const", () => ({
  get_AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN: (action: string) =>
    `auto_split_static_bloter_audit_btn_${action}`,
}));

vi.mock("../../services/api", () => ({
  api: {
    reducerPath: "api",
    reducer: () => ({}),
    middleware: () => (next: any) => (action: any) => next(action), // 空 middleware
    endpoints: {
      addStaticRule: {
        initiate: vi.fn(() => ({
          unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
        })),
      },
    },
  },

  useAddStaticRuleMutation: () => [
    vi.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useCheckerConfirmMutation: () => [
    vi.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useCheckerRejectMutation: () => [
    vi.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useDeleteSplittingRuleMutation: () => [
    vi.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useUpdateSplittingRuleMutation: () => [
    vi.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
}));

vi.mock("src/Cashflow_CN/Main/config/ratanConfig/local/cashflowQuickSearchConfig", () => ({
  default: {
    CurrencyList: ["currency1", "currency2"]
  },
  CurrencyList: [
    "currency1",
    "currency2"
  ]
}));

describe("RuleDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders form fields and buttons", () => {
    const store = createStore();
    const wrapper = ReduxProviderWrapper(store);

    const { getByLabelText, getByTestId, getByText } = render(<RuleDetail />, {
      wrapper
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    expect(getByLabelText("ID")).toBeInTheDocument();
    expect(getByLabelText("Created At")).toBeInTheDocument();
    expect(getByLabelText("Booking Entity FMID")).toBeInTheDocument();
    expect(getByLabelText("Booking Entity FM CODE")).toBeInTheDocument();
    expect(getByLabelText("Nostro Agent")).toBeInTheDocument();
    expect(getByLabelText("Currency")).toBeInTheDocument();
    expect(getByLabelText("Threshold")).toBeInTheDocument();
    expect(getByLabelText("Amount")).toBeInTheDocument();
    expect(getByLabelText("Limitation")).toBeInTheDocument();
  });
  it("should disable booking entity when action is not create and edite", () => {
    const mockStaticRule: StaticRuleRow =
    {
      id: 100,
      ruleUniqueId: 123,
      dataStatus: RuleStatusType.AddPending,
      createdAt: "20251109",
      updatedAt: "20251109",
      makerId: "1243644",
      checkerId: "5555",
      updateRecordId: "100",
      entityFmCode: "testFmCode",
      entityFmId: "testFmId",
      nostroAgent: "nostroAgent",
      family: "test",
      group: "test",
      type: "test",
      typology: "test",
      strategy: "test",
      beneficiaryBic: "test",
      amount: "amount",
      currency: "currency",
      limitation: "limitation",
      threshold: "threshold",
    };
    const store = configureStore({
      reducer: {
        detail: createReducer(
          {
            openDialog: true,
            detailData: mockStaticRule,
            mode: "Create",
            actions: [
              {
                action: ActionType.ApproveCreation,
                disabled: false,
              }
            ]

          }, () => { }
        ),
      },
    }); const wrapper = ReduxProviderWrapper(store);

    const { getByTestId, getByText } = render(<RuleDetail />, {
      wrapper
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    const fmIdText = getByTestId("entityFmIdInput");
    expect(fmIdText).toBeDisabled();
  });
  it("should disable booking entity when action disable true", () => {
    const mockStaticRule: StaticRuleRow =
    {
      id: 100,
      ruleUniqueId: 123,
      dataStatus: RuleStatusType.AddPending,
      createdAt: "20251109",
      updatedAt: "20251109",
      makerId: "1243644",
      checkerId: "5555",
      updateRecordId: "100",
      entityFmCode: "testFmCode",
      entityFmId: "testFmId",
      nostroAgent: "nostroAgent",
      family: "test",
      group: "test",
      type: "test",
      typology: "test",
      strategy: "test",
      beneficiaryBic: "test",
      amount: "amount",
      currency: "currency",
      limitation: "limitation",
      threshold: "threshold",
    };
    const store = configureStore({
      reducer: {
        detail: createReducer(
          {
            openDialog: true,
            detailData: mockStaticRule,
            mode: "Create",
            actions: [
              {
                action: ActionType.Create,
                disabled: true,
              }
            ]

          }, () => { }
        ),
      },
    }); const wrapper = ReduxProviderWrapper(store);

    const { getByTestId } = render(<RuleDetail />, {
      wrapper
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    const fmIdText = getByTestId("entityFmIdInput");
    expect(fmIdText).toBeDisabled();
  });
  it("Shoule validation failed for nostroagent", async () => {
    const mockStaticRule: StaticRuleRow =
    {
      id: 100,
      ruleUniqueId: 123,
      dataStatus: RuleStatusType.AddPending,
      createdAt: "20251109",
      updatedAt: "20251109",
      makerId: "1243644",
      checkerId: "5555",
      updateRecordId: "100",
      entityFmCode: "testFmCode",
      entityFmId: "testFmId",
      //@ts-ignore
      nostroAgent: undefined,
      family: "test",
      group: "test",
      type: "test",
      typology: "test",
      strategy: "test",
      beneficiaryBic: "test",
      amount: "amount",
      currency: "currency",
      limitation: "limitation",
      threshold: "threshold",
    };
    const store = configureStore({
      reducer: {
        detail: createReducer(
          {
            openDialog: true,
            detailData: mockStaticRule,
            mode: "Create",
            actions: [
              {
                action: "Create",
                disabled: false,
              }
            ]

          }, () => { }
        ),
      },
    }); const wrapper = ReduxProviderWrapper(store);

    const { getByTestId, findByText } = render(<RuleDetail />, {
      wrapper
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    const input = getByTestId("nostroAgentInput");

    fireEvent.change(input, { target: { value: null } });
    fireEvent.blur(input);

    fireEvent.change(input, { target: { value: "ABCDEFG" } });
    fireEvent.blur(input);
    expect(await findByText("Nostro Agent must be 8 or 11 characters")).toBeInTheDocument();

  });
  it("find button and click it should submit and validation", async () => {
    const mockDispatch = vi.fn();

    jest
      .spyOn(require("src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils"), "trimObject").mockImplementation(() => { });

    // const promise1 = Promise.resolve({ status: 200, errorCode: "200", errorMessage: "success" });
    // jest
    //   .spyOn(require("src/Cashflow_Splitting_Static/hooks/useActionApi"), "useMutationActionApi").mockReturnValueOnce({
    //     mutation: () => { return promise1 },
    //   })

    const mockStaticRule: StaticRuleRow =
    {
      id: 100,
      ruleUniqueId: 123,
      dataStatus: RuleStatusType.AddPending,
      createdAt: "20251109",
      updatedAt: "20251109",
      makerId: "1243644",
      checkerId: "5555",
      updateRecordId: "100",
      entityFmCode: "testFmCode",
      entityFmId: "",
      nostroAgent: "",
      family: "test",
      group: "test",
      type: "test",
      typology: "test",
      strategy: "test",
      beneficiaryBic: "test",
      amount: 50,
      currency: "currency",
      limitation: 100,
      threshold: 200,
    };
    const store = configureStore({
      reducer: {
        detail: createReducer(
          {
            openDialog: true,
            detailData: mockStaticRule,
            mode: "Create",
            actions: [
              {
                action: ActionType.ApproveCreation,
                disabled: false,
              }
            ]

          }, () => { }
        ),
        api: createReducer({
          endpoints: {
            addStaticRule: {
              initiate: vi.fn(() => ({
                unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
              })),
            },
          },
        }, () => { }
        )
      },
    }); const wrapper = ReduxProviderWrapper(store);

    const { getByTestId, getByText } = render(<RuleDetail />, {
      wrapper
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    const btn = getByTestId("auto_split_static_bloter_audit_btn_approve_creation");
    fireEvent.click(btn);

    const okBtn = getByText("Yes");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
