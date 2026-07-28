import type { ColDef, GridOptions } from "ag-grid-community";
import { message } from "antd";
import get from "lodash/get";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid, SimpleAmount } from "src/Root/import/ratancomponents";

import {
  getEBBSAcountingDetail,
  postAccountingRepublish,
} from "../../../services";
import StyledRoot, { classes } from "./common/style";
import type { AccountTableData } from "./type";

const gridOptions: GridOptions = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    menuTabs: ["filterMenuTab"],
    filter: true,
    suppressHeaderContextMenu: false,
  },
};

export const AccountingDetail = ({ cashflowId }: { cashflowId: string }) => {
  const [messageApi, MessageContextHolder] = message.useMessage();
  const [tableData, setTableData] = useState<AccountTableData[]>([]);

  useEffect(() => {
    initialAccountingTable(cashflowId);
  }, [cashflowId]);

  const initialAccountingTable = useCallback((cashflowId: string) => {
    cashflowId &&
      getEBBSAcountingDetail(cashflowId).then((res) => {
        if (Array.isArray(res)) {
          const t: AccountTableData[] = [];
          res.forEach((r) => {
            const updatedAt = get(r, "updatedAt");
            const taskStatus = get(r, "taskStatus");
            const reason = get(r, "reason");
            const externalSystemKey = get(r, "externalSystemKey");
            const transactionAmount = get(r, "amount");
            const currency = get(r, "currency");
            const action = get(r, "action");
            const createdAt = get(r, "createdAt");
            if (taskStatus === "MISSING_INFO") {
              t.push({
                accountNumber: "",
                transactionNature: "",
                transactionAmount,
                currency,
                action,
                externalSystemKey,
                createdAt,
                updatedAt,
                taskStatus,
                reason,
              });
            } else {
              const entry = get(
                r,
                "requestInfo.data.attributes.request['transaction entry']",
                []
              );
              entry.forEach((e) => {
                t.unshift({
                  accountNumber: e["account-number"],
                  transactionNature: e["transaction-nature"],
                  transactionAmount,
                  currency,
                  action,
                  externalSystemKey,
                  createdAt,
                  updatedAt,
                  taskStatus,
                  reason,
                });
              });
            }
          });
          setTableData(t);
        }
      });
  }, []);

  const republish = useCallback(
    async (externalSystemKeys: string[]) => {
      try {
        const resp = await postAccountingRepublish(externalSystemKeys);
        if (resp.success) {
          messageApi.success("Republish success !");
        } else {
          messageApi.error("Republish failed !");
        }
      } catch (error) {
      } finally {
        initialAccountingTable(cashflowId);
      }
    },
    [cashflowId]
  );

  const columnDefs: ColDef[] = useMemo(() => {
    return [
      {
        field: "accountNumber",
      },
      {
        field: "transactionNature",
        width: 180,
      },
      {
        field: "transactionAmount",
        cellRenderer: (params) => (
          <SimpleAmount
            value={params.value}
            formatOptions={{ trimMantissa: true }}
          />
        ),
        width: 180,
      },
      {
        field: "currency",
        width: 120,
      },
      {
        field: "action",
      },
      {
        field: "externalSystemKey",
      },
      {
        field: "createdAt",
      },
      {
        field: "updatedAt",
      },
      {
        field: "taskStatus",
        width: 140,
      },
      {
        field: "reason",
        flex: 1,
      },
    ];
  }, [republish]);

  return (
    <StyledRoot>
      <DataGrid
        className={classes.root}
        rowData={tableData}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
      />
      {MessageContextHolder}
    </StyledRoot>
  );
};
