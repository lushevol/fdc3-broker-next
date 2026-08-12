import { configureStore, createReducer } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import { ReduxProviderWrapper } from "src/test/test-utils";

import { ActionType } from "../../state/types";
import { mockUtilizationRules } from "../../test/mock/mockRules";
import { RuleDetail } from "./RuleDetail";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Root/analysis/const", () => ({
  get_UTILIZATION_STATIC_BLOTTER_AUDIT_BTN: (action: string) =>
    `utilization_static_bloter_audit_btn_${action}`,
}));

jest.mock("src/Cashflow_CN/services/graphql", () => ({
  queryCounterPartyDetails_CN: jest.fn().mockResolvedValue({
    fmEntity: {
      fmAccount: {
        fmCode: "mockedFmCode",
      },
    },
  }),
}));

jest.mock(
  "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity",
  () => ({
    BookingEntityNameIdOptions: [
      { value: "10036642", label: "SCB SHANGH*SHA" },
      { value: "400899993", label: "SCB CN CHO*CHO" },
    ],
  })
);

jest.mock("../../services/api", () => ({
  api: {
    reducerPath: "api",
    reducer: () => ({}),
    middleware: () => (next: any) => (action: any) => next(action),
    endpoints: {
      addStaticRule: {
        initiate: jest.fn(() => ({
          unwrap: () =>
            Promise.resolve({ status: 200, errorMessage: "success" }),
        })),
      },
    },
  },

  useAddUtilizationRuleMutation: () => [
    jest.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useUpdateUtilizationRuleMutation: () => [
    jest.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useDeleteUtilizationRuleMutation: () => [
    jest.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useCheckerConfirmMutation: () => [
    jest.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
  useCheckerRejectMutation: () => [
    jest.fn(() => ({
      unwrap: () => Promise.resolve({ status: 200, errorMessage: "success" }),
    })),
  ],
}));

const store = configureStore({
  reducer: {
    detail: createReducer(
      {
        openDialog: true,
        detailData: mockUtilizationRules[0],
        mode: "Create",
        actions: [
          {
            action: ActionType.ApproveCreation,
            disabled: false,
          },
        ],
      },
      () => {}
    ),
  },
});

describe("RuleDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders form fields and buttons", () => {
    const wrapper = ReduxProviderWrapper(store);

    const { getByLabelText, getByTestId } = render(<RuleDetail />, {
      wrapper,
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    expect(getByLabelText("Counterparty FMID")).toBeInTheDocument();
    expect(getByLabelText("Counterparty FMCode")).toBeInTheDocument();
    expect(getByLabelText("Entity FMID")).toBeInTheDocument();
    expect(getByLabelText("Entity FMCode")).toBeInTheDocument();
    expect(getByLabelText("Auto Util")).toBeInTheDocument();
  });
  it("Shoule auto Counterparty FMCode when finish input Counterparty FMID", async () => {
    const wrapper = ReduxProviderWrapper(store);

    const { getByTestId } = render(<RuleDetail />, {
      wrapper,
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();

    //Counterparty FMID
    const input = getByTestId("counterpartyFmIdInput");

    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    await waitFor(() => {
      expect(screen.getByDisplayValue("mockedFmCode")).toBeInTheDocument();
    });
  });
  it("should handle fmAccount as null and show warning", async () => {
    jest
      .spyOn(
        require("src/Cashflow_CN/services/graphql"),
        "queryCounterPartyDetails_CN"
      )
      .mockResolvedValueOnce({
        fmEntity: {
          fmAccount: null,
        },
      });

    const wrapper = ReduxProviderWrapper(store);

    const { getByTestId } = render(<RuleDetail />, { wrapper });

    const input = getByTestId("counterpartyFmIdInput");
    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(input).toHaveValue("123456");
    });
  });
  it("find button and click it should submit and validation", async () => {
    const mockDispatch = jest.fn();
    jest
      .spyOn(
        require("src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils"),
        "trimObject"
      )
      .mockImplementation(() => {});

    const store = configureStore({
      reducer: {
        detail: createReducer(
          {
            openDialog: true,
            detailData: mockUtilizationRules[0],
            mode: "Create",
            actions: [
              {
                action: ActionType.ApproveCreation,
                disabled: false,
              },
            ],
          },
          () => {}
        ),
        api: createReducer(
          {
            endpoints: {
              addUtilizationRule: {
                initiate: jest.fn(() => ({
                  unwrap: () =>
                    Promise.resolve({ status: 200, errorMessage: "success" }),
                })),
              },
            },
          },
          () => {}
        ),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { getByTestId, getByText, getAllByText } = render(<RuleDetail />, {
      wrapper,
    });
    expect(getByTestId("rule-detail")).toBeInTheDocument();
    const btn = getByTestId(
      "utilization_static_bloter_audit_btn_approve_creation"
    );
    fireEvent.click(btn);

    const okBtn = getAllByText("Yes");
    expect(okBtn[1]).toBeInTheDocument();
    fireEvent.click(okBtn[1]);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
