import {
  GridOptions,
  IServerSideGetRowsParams,
  PaginationChangedEvent,
} from "ag-grid-community";
import cn from "classnames";
import { useCallback, useMemo } from "react";
import { useLazyQueryStaticRuleAuditListQuery } from "src/Cashflow_Splitting_Static/services/api";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_Splitting_Static/store";
import {
  setAuditTablePageNo,
  setAuditTablePageSize,
} from "src/Cashflow_Splitting_Static/store/pagination.slice";
import { DataGridClasses } from "src/Root/import/ratancomponents";

import { classes } from "./style";

export const useAuditDataGrid = (id?: string) => {
  const dispatch = useAppDispatch();
  const auditTablePagination = useAppSelector(
    (state) => state.auditTablePagination
  );
  const [queryAuditList] = useLazyQueryStaticRuleAuditListQuery();
  const ruleClass = cn(classes.rulesAuditDataGrid, DataGridClasses.mainBlotter);

  const gridOptions: GridOptions = useMemo(
    () => ({
      suppressRowClickSelection: true,
      getRowNodeId: ({ data }) => data.id,
      defaultColDef: {
        resizable: true,
        sortable: true,
        menuTabs: ["filterMenuTab"],
        filter: true,
      },
      getContextMenuItems: () => [],
    }),
    []
  );

  const onPaginationChange = useCallback(
    (e: PaginationChangedEvent) => {
      const pageSize = e.api.paginationGetPageSize();
      dispatch(setAuditTablePageSize(pageSize));
      const pageNo = e.api.paginationGetCurrentPage();
      dispatch(setAuditTablePageNo(pageNo));
    },
    [dispatch]
  );

  const serverSideDatasource = useMemo(() => {
    return {
      getRows(params: IServerSideGetRowsParams) {
        const { api, success, fail } = params;
        const page = api.paginationGetCurrentPage();
        const size = api.paginationGetPageSize();
        queryAuditList({ page, size, ruleUniqueId: id })
          .then(({ data }) => {
            success({
              rowData: data?.results ?? [],
              rowCount: data?.totalHits ?? 0,
            });
          })
          .catch(() => fail());
      },
    };
  }, [id]);

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [auditTablePagination.size];
  }, []);

  return {
    ruleClass,
    gridOptions,
    auditTablePagination,
    serverSideDatasource,
    onPaginationChange,
    paginationPageSizeSelector,
  };
};
