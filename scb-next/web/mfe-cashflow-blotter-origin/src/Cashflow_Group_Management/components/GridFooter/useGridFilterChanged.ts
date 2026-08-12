import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GroupBlotterRootState } from "src/Cashflow_Group_Management/Main/store/interface";

export const useGridFilterChanged = () => {
  const [ts, setTs] = useState(0);
  const { api } = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.blotterGridEvent
  );
  const blotterDatas = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.blotterDatas
  );
  const { totalHits } = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.blotterPagination
  );

  useEffect(() => {
    const onFilterChanges = () => {
      setTs(new Date().getTime());
    };

    api?.addEventListener("filterChanged", onFilterChanges);
    return () => {
      api?.removeEventListener("filterChanged", onFilterChanges);
    };
  }, [api]);

  const displayRowsCount = useMemo(() => {
    return api?.getDisplayedRowCount() ?? 0;
  }, [api, ts, totalHits, blotterDatas]);

  return {
    displayRowsCount,
  };
};
