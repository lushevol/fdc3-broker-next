import { ColumnsType } from "antd/es/table";
import React, { FC, useCallback, useState } from "react";

import { VostroListDataType, VostroListProps } from "./interface";
import { classes, StyledTable } from "./style";

const columns: ColumnsType<VostroListDataType> = [
  {
    title: "SSI ID",
    dataIndex: "SSI_Id",
    key: "SSI_Id",
  },
  {
    title: "Settlement Code",
    dataIndex: "Settlement_Code",
    key: "Settlement_Code",
  },
  {
    title: "Entity",
    dataIndex: "BranchId_Murex3Id",
    key: "BranchId_Murex3Id",
  },
  {
    title: "Counterparty FMID",
    dataIndex: "Counterparty_SCI_FMID",
    key: "Counterparty_SCI_FMID",
  },
  {
    title: "Currency",
    dataIndex: "Payment_Currency",
    key: "Payment_Currency",
  },
  {
    title: "CFI Code",
    dataIndex: "CFI_Code",
    key: "CFI_Code",
  },
  {
    title: "Swift Type",
    dataIndex: "Swift_Message_Type",
    key: "Swift_Message_Type",
  },
  {
    title: "Beneficairy BIC",
    dataIndex: "Account.Beneficiary_BIC_code",
    key: "Account.Beneficiary_BIC_code",
    render: (value, data) => data.Account?.Beneficiary_BIC_code,
  },
  {
    title: "SSI Type",
    dataIndex: "SSI_Priority",
    key: "SSI_Priority",
  },
];

const List: FC<VostroListProps> = ({ data, onSelectRow }) => {
  const [selectedRow, setSelectedRow] = useState<VostroListDataType>();
  const handleTableClick = useCallback((record: VostroListDataType) => {
    onSelectRow(record);
    setSelectedRow(record);
  }, []);
  return (
    <StyledTable
      columns={columns}
      dataSource={data}
      size="small"
      key="ssiId"
      pagination={{
        size: "small",
        pageSize: 5,
        hideOnSinglePage: true,
      }}
      locale={{
        emptyText: "No Available Vostro SSI",
      }}
      onRow={(record) => ({ onClick: () => handleTableClick(record) })}
      rowClassName={(record) =>
        record.SSI_Id === selectedRow?.SSI_Id ? classes.rowSelected : ""
      }
    />
  );
};

export default List;
