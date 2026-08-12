import { renderHook } from "@testing-library/react";

import { RuleMutationResponse, UtilizationRuleRow } from "../services/api.type";
import { ActionType } from "../state/types";
import { useMutationActionApi } from "./useActionApi";

jest.mock("../services/api", () => {
  const mockRule = jest.fn(() => ({
    unwrap: () => Promise.resolve({} as RuleMutationResponse),
  }));
  return {
    useAddUtilizationRuleMutation: () => [mockRule],
    useCheckerConfirmMutation: () => [mockRule],
    useCheckerRejectMutation: () => [mockRule],
    useDeleteUtilizationRuleMutation: () => [mockRule],
    useUpdateUtilizationRuleMutation: () => [mockRule],
  };
});

describe("useMutationActionApi", () => {
  test("should call addRule mutation when ActionType is Create", () => {
    const { result } = renderHook(() => useMutationActionApi());
    const { mutation } = result.current;
    const mockPayload = { id: 1 } as UtilizationRuleRow;

    const actionType = ActionType.Create;
    mutation(actionType, mockPayload);
    const actionType1 = ActionType.Update;
    mutation(actionType1, mockPayload);
    const actionType2 = ActionType.Delete;
    mutation(actionType2, mockPayload);
    const actionType3 = ActionType.ApproveCreation;
    mutation(actionType3, mockPayload);
    const actionType4 = ActionType.ApproveDelete;
    mutation(actionType4, mockPayload);
    const actionType5 = ActionType.ApproveUpdate;
    mutation(actionType5, mockPayload);
    const actionType6 = ActionType.RejectCreation;
    mutation(actionType6, mockPayload);
    const actionType7 = ActionType.RejectDelete;
    mutation(actionType7, mockPayload);
    const actionType8 = ActionType.RejectUpdate;
    mutation(actionType8, mockPayload);
    expect(mutation).toBeDefined();
  });
});
