import { ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import { ActionType, RuleStatusType } from "../state/types";
import reducer, {
    closeDialog,
    DetailMode,
    openCreateDialog,
    openEditDialog,
} from "./detail.slice";
import createStore, { useAppDispatch, useAppSelector } from "./index";

const mockStaticRuleRow = {
    id: "test-id",
    ruleUniqueId: "unique-id",
    dataStatus: RuleStatusType.SavedConfirm,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02",
    makerId: "maker",
    checkerId: "checker",
    updateRecordId: null,
    entityFmId: "FMID1",
    entityFmCode: "FMCODE1",
    family: "FAM",
    group: "GRP",
    type: "TYPE",
    typology: "TYP",
    strategy: "STRAT",
    beneficiaryBic: "BIC",
    amount: "100",
    currency: "USD",
    limitation: "10",
    nostroAgent: "NOSTRO",
    threshold: "50",
};

describe("detail.slice", () => {
    it("should return the initial state", () => {
        const initialState = reducer(undefined, { type: "@@INIT" });
        expect(initialState.openDialog).toBe(false);
        expect(initialState.mode).toBe(DetailMode.Edit);
        expect(initialState.actions).toEqual([]);
        expect(initialState.detailData).toHaveProperty("entityFmId", "");
    });

    it("should handle openCreateDialog", () => {
        const state = reducer(undefined, openCreateDialog());
        expect(state.openDialog).toBe(true);
        expect(state.mode).toBe(DetailMode.Create);
        expect(state.actions).toEqual([{ action: ActionType.Create, disabled: false }]);
        expect(state.detailData).toHaveProperty("entityFmId", "");
        expect(state.detailData).toHaveProperty("amount", "");
    });
    it("should handle openEditDialog", () => {

        const store = createStore();
        const wrapper = ReduxProviderWrapper(store);
        const { result } = renderHook(() => {
            const dispatch = useAppDispatch();
            dispatch(openEditDialog(mockStaticRuleRow));
            return useAppSelector(state => state.detail);
        }, {
            wrapper
        });
        expect(result.current.openDialog).toBe(true);
    });

    it("should handle closeDialog", () => {
        const prevState = {
            openDialog: true,
            detailData: mockStaticRuleRow,
            mode: DetailMode.Edit,
            actions: [{ action: ActionType.Update, disabled: false }],
        };
        const state = reducer(prevState, closeDialog());
        expect(state.openDialog).toBe(false);
        expect(state.mode).toBe(DetailMode.Create);
        expect(state.actions).toEqual([]);
        expect(state.detailData).toHaveProperty("entityFmId", "");
        expect(state.detailData).toHaveProperty("amount", "");
    });
});