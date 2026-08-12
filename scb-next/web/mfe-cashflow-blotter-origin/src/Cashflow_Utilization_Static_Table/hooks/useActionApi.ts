import { useCallback } from "react";

import {
  useAddUtilizationRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useDeleteUtilizationRuleMutation,
  useUpdateUtilizationRuleMutation,
} from "../services/api";
import {
  RuleMutationResponse,
  UtilizationRuleMutation,
  UtilizationRuleRow,
} from "../services/api.type";
import { ActionType } from "../state/types";

export const useMutationActionApi = () => {
  const [addRule] = useAddUtilizationRuleMutation();
  const [updateRule] = useUpdateUtilizationRuleMutation();
  const [deleteRule] = useDeleteUtilizationRuleMutation();
  const [confirm] = useCheckerConfirmMutation();
  const [reject] = useCheckerRejectMutation();
  const mutation = useCallback(
    (action: ActionType, payload: UtilizationRuleRow) => {
      switch (action) {
        case ActionType.Create: {
          const { id, createdAt, checkerId, updatedAt, makerId, ...rest } =
            payload;
          return addRule(rest as UtilizationRuleMutation).unwrap();
        }

        case ActionType.Update:
          return updateRule(payload).unwrap();

        case ActionType.Delete:
          return deleteRule(payload.id).unwrap();

        case ActionType.ApproveCreation:
        case ActionType.ApproveDelete:
        case ActionType.ApproveUpdate:
          return confirm(payload.id).unwrap();

        case ActionType.RejectCreation:
        case ActionType.RejectDelete:
        case ActionType.RejectUpdate:
          return reject(payload.id).unwrap();
        default:
          return Promise.resolve({
            result: "fail",
            recordId: "",
            code: "",
            message: "",
          } as RuleMutationResponse);
      }
    },
    []
  );

  return {
    mutation,
  };
};
