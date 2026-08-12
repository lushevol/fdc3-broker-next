import { ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import { RuleStatusType } from "../state/types";
import store, { useAppDispatch, useAppSelector } from "./index";
import {
  goToNextPage,
  resetPageNo,
  setPagination,
  updateRowDataAfterMutation,
} from "./pagination.slice";

it("resetPageNo should works well", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(
    () => {
      const dispatch = useAppDispatch();
      dispatch(resetPageNo());
      return useAppSelector((state) => state.pagination);
    },
    {
      wrapper,
    }
  );
  expect(result.current.lastPageNo).toEqual(-1);
});

it("setPagination should works well", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(
    () => {
      const dispatch = useAppDispatch();
      dispatch(
        setPagination({
          totalHits: 100,
          totalPages: 2,
          results: [],
          pageNo: 0,
          pageSize: 50,
        })
      );
      return useAppSelector((state) => state.pagination);
    },
    {
      wrapper,
    }
  );
  expect(result.current.totalHits).toEqual(100);
});

it("updateRowDataAfterMutation should works well", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(
    () => {
      const dispatch = useAppDispatch();
      dispatch(
        updateRowDataAfterMutation({
          counterpartyFmCode: "",
          counterpartyFmId: "",
          entityFmCode: "",
          entityFmId: "",
          autoUtil: "",
          id: 0,
          dataStatus: RuleStatusType.AddPending,
          createdAt: "",
          updatedAt: "",
          makerId: "",
          checkerId: "",
          settlementMeans: "FXBRREC",
          settlementAccount: "FXBRREC",
        })
      );
      return useAppSelector((state) => state.pagination);
    },
    {
      wrapper,
    }
  );
  expect(result.current.rowData.length).toEqual(1);
});
