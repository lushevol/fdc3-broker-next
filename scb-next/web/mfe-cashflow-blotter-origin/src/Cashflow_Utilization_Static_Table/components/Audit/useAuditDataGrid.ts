import { GridOptions } from "ag-grid-community";
import { useEffect, useMemo, useState } from "react";

import { useLazyQueryUtilizationRuleAuditListQuery } from "../../services/api";
import { RuleAuditRow } from "../../services/api.type";
import { useAppSelector } from "../../store";

export const useAuditDataGrid = (id?: string) => {
  const auditTablePagination = useAppSelector(
    (state) => state.auditTablePagination
  );
  const [rowData, setRowData] = useState<RuleAuditRow[]>([]);

  const [queryAuditList] = useLazyQueryUtilizationRuleAuditListQuery();

  const gridOptions: GridOptions = useMemo(
    () => ({
      rowSelection: {
        mode: "singleRow",
        enableClickSelection: false,
        checkboxes: false,
      },
      getRowNodeId: (row: RuleAuditRow) => row.id,
      defaultColDef: {
        resizable: true,
        sortable: true,
        menuTabs: ["filterMenuTab"],
        filter: true,
      },
      getContextMenuItems: () => [],
      pagination: true,
      paginationPageSize: 100,
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const { page, size } = auditTablePagination;
      const getData = await queryAuditList({
        page,
        size,
        entityId: id,
      }).unwrap();
      const results = getData?.results ?? [];
      setRowData(results);
    };
    fetchData();
  }, [id, queryAuditList]);

  return {
    gridOptions,
    rowData,
  };
};
