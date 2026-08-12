import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import { ActionType } from "../state/types";
import { mockUtilizationRules } from "../test/mock/mockRules";
import reducer, {
  closeDialog,
  DetailMode,
  openCreateDialog,
  openEditDialog,
} from "./detail.slice";
import { useAppDispatch, useAppSelector } from "./index";

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

describe("detail.slice", () => {
  it("should return the initial state", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });
    expect(initialState.openDialog).toBe(false);
    expect(initialState.mode).toBe(DetailMode.Edit);
    expect(initialState.actions).toEqual([]);
    expect(initialState.detailData).toHaveProperty("counterpartyFmId", "");
  });

  it("should handle openCreateDialog", () => {
    const state = reducer(undefined, openCreateDialog());
    expect(state.openDialog).toBe(true);
    expect(state.mode).toBe(DetailMode.Create);
    expect(state.actions).toEqual([
      { action: ActionType.Create, disabled: false },
    ]);
    expect(state.detailData).toHaveProperty("counterpartyFmId", "");
    expect(state.detailData).toHaveProperty("entityFmId", "");
  });
  it("should handle openEditDialog", () => {
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(
      () => {
        const dispatch = useAppDispatch();
        dispatch(openEditDialog(mockUtilizationRules[0]));
        return useAppSelector((state) => state.detail);
      },
      {
        wrapper,
      }
    );
    expect(result.current.openDialog).toBe(true);
  });

  it("should handle closeDialog", () => {
    const prevState = {
      openDialog: true,
      detailData: mockUtilizationRules[0],
      mode: DetailMode.Edit,
      actions: [{ action: ActionType.Update, disabled: false }],
    };
    const state = reducer(prevState, closeDialog());
    expect(state.openDialog).toBe(false);
    expect(state.mode).toBe(DetailMode.Create);
    expect(state.actions).toEqual([]);
    expect(state.detailData).toHaveProperty("entityFmId", "");
  });
});
