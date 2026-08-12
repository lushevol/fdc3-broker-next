import {
  ActionType,
  RuleStatusType,
  StateContext,
  StateMapType,
} from "./types";

export const guards = {
  isMaker: ({ context }: { context: StateContext }) => {
    const { userRole } = context;
    return ["Maker", "Maker_Checker"].includes(userRole);
  },
  isChecker: ({ context }: { context: StateContext }) => {
    const { userId, userRole, makerId } = context;
    return (
      ["Checker", "Maker_Checker"].includes(userRole) && userId !== makerId
    );
  },
};

export const StateMap: StateMapType = {
  NONE: {
    on: {
      [ActionType.Create]: {
        target: RuleStatusType.AddPending,
        guard: guards["isMaker"],
      },
    },
  },
  [RuleStatusType.AddPending]: {
    on: {
      [ActionType.ApproveCreation]: {
        target: RuleStatusType.SavedConfirm,
        guard: guards["isChecker"],
      },
      [ActionType.RejectCreation]: {
        target: RuleStatusType.Discarded,
        guard: guards["isChecker"],
      },
    },
  },
  [RuleStatusType.UpdatePending]: {
    on: {
      [ActionType.ApproveUpdate]: {
        target: RuleStatusType.SavedConfirm,
        guard: guards["isChecker"],
      },
      [ActionType.RejectUpdate]: {
        target: RuleStatusType.SavedConfirm,
        guard: guards["isChecker"],
      },
    },
  },
  [RuleStatusType.SavedConfirm]: {
    on: {
      [ActionType.Update]: {
        target: RuleStatusType.UpdatePending,
        guard: guards["isMaker"],
      },
      [ActionType.Delete]: {
        target: RuleStatusType.DeletePending,
        guard: guards["isMaker"],
      },
    },
  },
  [RuleStatusType.DeletePending]: {
    on: {
      [ActionType.ApproveDelete]: {
        target: RuleStatusType.Delete_Confirmed,
        guard: guards["isChecker"],
      },
      [ActionType.RejectDelete]: {
        target: RuleStatusType.SavedConfirm,
        guard: guards["isChecker"],
      },
    },
  },
  [RuleStatusType.Discarded]: {
    type: "final",
    on: {},
  },
  [RuleStatusType.Delete_Confirmed]: {
    type: "final",
    on: {},
  },
};
