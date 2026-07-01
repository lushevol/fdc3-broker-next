import {
  GridOptions,
  IServerSideGetRowsParams,
  PaginationChangedEvent,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { useLazyQueryBicNettingRuleAuditListQuery } from "src/Cashflow_BIC_Netting_Static_Table/services/api";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_BIC_Netting_Static_Table/store";
import {
  setAuditTablePageNo,
  setAuditTablePageSize,
} from "src/Cashflow_BIC_Netting_Static_Table/store/pagination.slice";

export const useAuditDataGrid = (id?: string) => {
  const dispatch = useAppDispatch();
  const auditTablePagination = useAppSelector(
    (state) => state.auditTablePagination
  );
  const [queryAuditList] = useLazyQueryBicNettingRuleAuditListQuery();

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
        queryAuditList({ ...auditTablePagination, page, entityId: id })
          .then(({ data }) => {
            success({
              rowData: data?.results ?? [],
              rowCount: data?.totalHits ?? 0,
            });
          })
          .catch(() => fail());
      },
    };
  }, [id, auditTablePagination]);

  return {
    gridOptions,
    auditTablePagination,
    serverSideDatasource,
    onPaginationChange,
  };
};
