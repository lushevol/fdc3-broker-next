import { Table, TableColumnsType } from "antd";
import { SimpleAmount } from "src/Root/import/ratancomponents";

import { BulkResultStatus, BulkUserType, CashflowDisplay } from "../type";
import { BulkActionResultCell, ExceptionsCell } from "./TableCell";

const getColumns = (isEligibleTable: boolean, userType: BulkUserType) =>
  [
    {
      title: "Cashflow Id",
      dataIndex: "cashflowId",
      with: 80,
    },
    {
      title: "Trade Id",
      dataIndex: "tradeId",
      with: 80,
    },
    {
      title: "Counterparty",
      dataIndex: "counterpartyCode",
    },
    {
      title: "Booking Entity",
      dataIndex: "entityCode",
    },
    {
      title: "Currency",
      dataIndex: "currency",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      with: 50,
      render(value) {
        return (
          <SimpleAmount value={value} formatOptions={{ trimMantissa: true }} />
        );
      },
    },
    {
      title: "Value Date",
      dataIndex: "valueData",
      with: 50,
    },
    {
      title: "P/R",
      dataIndex: "payRec",
      with: 50,
    },
    ...(isEligibleTable && userType === BulkUserType.Checker
      ? [
          {
            title: "Affirmation Email",
            dataIndex: "affirmationEmail",
            with: 100,
          },
        ]
      : []),
    {
      title: "Exceptions",
      dataIndex: "exceptions",
      fixed: "right",
      width: 300,
      render: ExceptionsCell,
    },
    ...(isEligibleTable
      ? [
          {
            title: "Result",
            dataIndex: "bulkActionResult",
            render: BulkActionResultCell,
            fixed: "right",
            with: 100,
          },
        ]
      : [
          {
            title: "Reason",
            dataIndex: "InsufficientReason",
            fixed: "right",
            with: 100,
          },
        ]),
  ] as TableColumnsType<CashflowDisplay>;

const CashflowDisplayTable = ({
  data,
  selectedRowKeys,
  isEligibleTable,
  isLoading,
  userType,
  onSelectedRowKeysChange,
  onSelectAllSelectableRows,
}: {
  data: CashflowDisplay[];
  selectedRowKeys: string[];
  isLoading?: boolean;
  isEligibleTable?: boolean;
  userType: BulkUserType;
  onSelectedRowKeysChange?: (ids: string[]) => void;
  onSelectAllSelectableRows?: () => void;
}) => {
  return (
    <Table
      rowSelection={
        isEligibleTable
          ? {
              type: "checkbox",
              selectedRowKeys,
              onChange(scopeSelectedRowKeys, _, info) {
                if (info.type === "all") {
                  if (selectedRowKeys?.length > scopeSelectedRowKeys.length) {
                    onSelectedRowKeysChange?.([]);
                  } else {
                    onSelectAllSelectableRows?.();
                  }
                } else {
                  onSelectedRowKeysChange?.(scopeSelectedRowKeys as string[]);
                }
              },
              getCheckboxProps: (record) => ({
                disabled: [
                  BulkResultStatus.SubmitSuccess,
                  BulkResultStatus.NotificationUpdated,
                  BulkResultStatus.Submiting,
                ].includes(record.bulkActionResult.status),
              }),
            }
          : undefined
      }
      columns={getColumns(!!isEligibleTable, userType)}
      dataSource={data}
      loading={
        isLoading && {
          tip: "loading cashflow details",
        }
      }
      size="small"
      rowKey="cashflowId"
      pagination={{
        size: "small",
        pageSize: 10,
        showTotal: (total) => `Total ${total} Cashflows`,
      }}
      scroll={{
        y: 800,
      }}
      data-testid="cashflow-display-table"
    />
  );
};

export default CashflowDisplayTable;
