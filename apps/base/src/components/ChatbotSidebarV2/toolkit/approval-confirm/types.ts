export type ApprovalConfirmArgs = {
  to: string;
  subject: string;
  body: string;
};

export type ApprovalConfirmResult = {
  confirmed: boolean;
};
