export enum RuleStatusType {
  AddPending = "ADD_PENDING",
  SavedConfirm = "SAVE_CONFIRMED",
  UpdatePending = "UPDATE_PENDING",
  DeletePending = "DELETE_PENDING",
  Discarded = "DISCARDED",
  Delete_Confirmed = "DELETE_CONFIRMED",
}

export type ExtendedRuleState = RuleStatusType | "NONE";

export type RoleType = "Maker" | "Checker" | "Maker_Checker" | "Visitor";

export enum ActionType {
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
  ApproveCreation = "Approve Creation",
  ApproveUpdate = "Approve Update",
  ApproveDelete = "Approve Deletion",
  RejectCreation = "Reject Creation",
  RejectUpdate = "Reject Update",
  RejectDelete = "Reject Deletion",
}

export type StateContext = {
  userId: string;
  userRole: RoleType;
  makerId: string;
};

export type StateMapType = {
  [status in ExtendedRuleState]: {
    type?: string;
    on: {
      [action in ActionType]?: {
        target: `${RuleStatusType}`;
        guard: ({ context }: { context: StateContext }) => boolean;
      };
    };
  };
};
