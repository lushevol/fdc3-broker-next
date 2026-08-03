import { BodyScrollEndEvent } from "ag-grid-community";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { queryNextPageCashflowList } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

export const useGridScroll = () => {
  const dispatch = useDispatch<any>();
  const gridEvent = useSelector((state: RootState) => state.cashflowGridEvent);
  const currentPageSize = useSelector(
    (state: RootState) => state.cashflowListQueryPageSize
  );

  const onBodyScrollEnd = useCallback(
    (event: BodyScrollEndEvent) => {
      const { api } = event;
      if (
        !api.getGridOption("loading") &&
        api.getLastDisplayedRowIndex() + 1 === api.getDisplayedRowCount()
      ) {
        dispatch(queryNextPageCashflowList({ pageSize: currentPageSize }));
      }
    },
    [currentPageSize]
  );

  useEffect(() => {
    if (gridEvent.api) {
      gridEvent.api.setGridOption("onBodyScrollEnd", onBodyScrollEnd);
    }
  }, [gridEvent, onBodyScrollEnd]);

  return {
    onBodyScrollEnd,
  };
};
