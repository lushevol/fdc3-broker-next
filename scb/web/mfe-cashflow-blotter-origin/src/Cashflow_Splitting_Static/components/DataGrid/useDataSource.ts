import { useEffect } from "react";
import { useQueryStaticRuleListQuery } from "src/Cashflow_Splitting_Static/services/api";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_Splitting_Static/store";
import { setPagination } from "src/Cashflow_Splitting_Static/store/pagination.slice";

export const useDataSource = () => {
  const dispatch = useAppDispatch();
  const { nextPageNo, pageSize, rowData, totalHits } = useAppSelector(
    (state) => state.pagination
  );
  const { aggridEvent } = useAppSelector((state) => state.aggrid);
  const { searchQuery } = useAppSelector((state) => state.search);

  //using auto query hooks
  const { data, isLoading } = useQueryStaticRuleListQuery({
    ...searchQuery,
    page: nextPageNo,
    size: pageSize,
  });

  useEffect(() => {
    if (data && aggridEvent) {
      dispatch(setPagination(data));
    }
  }, [aggridEvent, data]);

  return {
    rowData,
    isLoading,
    totalHits,
  };
};
