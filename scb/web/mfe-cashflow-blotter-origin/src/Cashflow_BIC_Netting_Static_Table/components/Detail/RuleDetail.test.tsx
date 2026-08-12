import { configureStore, createReducer } from "@reduxjs/toolkit";
import { fireEvent } from "@testing-library/react";
import {
  BicNettingRuleRow,
} from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import { ReduxProviderWrapper, render } from "src/test/test-utils";

import { ActionType,RuleStatusType } from "../../state/types";
import { RuleDetail } from "./RuleDetail";

// mock mutation
const mockMutation = jest.fn();
jest.mock("src/Cashflow_BIC_Netting_Static_Table/hooks/useActionApi", () => ({
  useMutationActionApi: () => ({
    mutation: mockMutation,
  }),
}));

// mock dispatch
const mockDispatch = jest.fn();

describe("RuleDetail handleSubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should submit and dispatch closeDialog on success", async () => {
    const mockBICNettingRule: BicNettingRuleRow =
    {
      id: 100,
      dataStatus: RuleStatusType.AddPending,
      createdAt: "20251109",
      updatedAt: "20251109",
      makerId: "1243644",
      checkerId: "5555",
      updateRecordId: "100",
      entityFmId: "testFmId",
      family: "test",
      group: "test",
      type: "test",
      typology: "test",
      strategy: "test",
      beneficiaryBic: "test",
    };
    mockMutation.mockResolvedValueOnce({});
    const store = configureStore({
      reducer: {
        detail: createReducer(
          {
            openDialog: true,
            detailData: mockBICNettingRule,
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
    });

    const wrapper = ReduxProviderWrapper(store);
    const { getByTestId, getByText } = render(<RuleDetail />, { wrapper });
    const btn = getByTestId("/cashflow_blotter_cn/cashflow_bic_netting_static_table/static_detail/approve_creation");
    fireEvent.click(btn);

    const okBtn = getByText("Yes");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});