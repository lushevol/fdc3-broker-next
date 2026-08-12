import { useEffect } from "react";

import { useLazyQueryUtilizationRuleListQuery } from "../../services/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { setPagination } from "../../store/pagination.slice";

export const useDataSource = () => {
  const dispatch = useAppDispatch();
  const { nextPageNo, pageSize, rowData, totalHits } = useAppSelector(
    (state) => state.pagination
  );
  const { searchQuery } = useAppSelector((state) => state.search);

  const [fetchData, { data, isLoading }] =
    useLazyQueryUtilizationRuleListQuery();

  useEffect(() => {
    fetchData({
      ...searchQuery,
      page: nextPageNo,
      size: pageSize,
    });
  }, [fetchData, searchQuery, nextPageNo, pageSize]);

  useEffect(() => {
    if (data) {
      dispatch(setPagination(data));
    }
  }, [data, dispatch]);

  return {
    rowData,
    isLoading,
    totalHits,
  };
};
