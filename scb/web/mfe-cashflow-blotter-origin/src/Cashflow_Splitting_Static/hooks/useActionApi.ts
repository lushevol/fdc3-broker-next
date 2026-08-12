import { useCallback } from "react";

import {
  useAddStaticRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useDeleteSplittingRuleMutation,
  useUpdateSplittingRuleMutation,
} from "../services/api";
import {
  RuleMutationResponse,
  SplittingRuleMutation,
  StaticRuleRow,
} from "../services/api.type";
import { ActionType } from "../state/types";

export const useMutationActionApi = () => {
  const [addRule] = useAddStaticRuleMutation();
  const [updateRule] = useUpdateSplittingRuleMutation();
  const [deleteRule] = useDeleteSplittingRuleMutation();
  const [confirm] = useCheckerConfirmMutation();
  const [reject] = useCheckerRejectMutation();
  const mutation = useCallback((action: ActionType, payload: StaticRuleRow) => {
    switch (action) {
      case ActionType.Create: {
        const { id, createdAt, checkerId, updatedAt, makerId, ...rest } =
          payload;
        return addRule(rest as SplittingRuleMutation).unwrap();
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
          status: 200,
          errorCode: "200",
          errorMessage: "",
        } as RuleMutationResponse);
    }
  }, []);

  return {
    mutation,
  };
};
