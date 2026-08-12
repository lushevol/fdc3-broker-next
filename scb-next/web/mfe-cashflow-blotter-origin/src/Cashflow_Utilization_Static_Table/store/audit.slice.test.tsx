import reducer, { closeAuditDialog,openAuditDialog } from "./audit.slice";

describe("audit.slice", () => {
  it("should return the initial state", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });
    expect(initialState.openDialog).toBe(false);
  });

  it("should handle openAuditDialog", () => {
    const state = reducer(undefined, openAuditDialog());
    expect(state.openDialog).toBe(true);
  });

  it("should handle closeAuditDialog", () => {
    const prevState = { openDialog: true };
    const state = reducer(prevState, closeAuditDialog());
    expect(state.openDialog).toBe(false);
  });
});
