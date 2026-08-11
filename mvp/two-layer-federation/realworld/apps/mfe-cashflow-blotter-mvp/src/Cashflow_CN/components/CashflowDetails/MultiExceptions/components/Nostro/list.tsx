import { ColumnsType } from "antd/es/table";
import React, { FC, useCallback, useState } from "react";

import { NostroListDataType, NostroListProps } from "./interface";
import { classes, StyledTable } from "./style";

const columns: ColumnsType<NostroListDataType> = [
  {
    title: "Entity",
    dataIndex: "SCB_Entity_SCI_FMID",
    key: "SCB_Entity_SCI_FMID",
  },
  {
    title: "Currency",
    dataIndex: "Payment_Currency",
    key: "Payment_Currency",
  },
  {
    title: "Settlement Account",
    dataIndex: "Account.SCB_Nostro_Account_Number",
    key: "Account.SCB_Nostro_Account_Number",
    render: (value, data) => data.Account?.SCB_Nostro_Account_Number,
  },
  {
    title: "Settlement Means",
    dataIndex: "Account.SCB_Nostro_Account_Type",
    key: "Account.SCB_Nostro_Account_Type",
    render: (value, data) => data.Account?.SCB_Nostro_Account_Type,
  },
  {
    title: "Nostro Account",
    dataIndex: "Account.Booking_Entity_Correspondent_Account_Number",
    key: "Account.Booking_Entity_Correspondent_Account_Number",
    render: (value, data) =>
      data.Account?.Booking_Entity_Correspondent_Account_Number,
  },
  {
    title: "Ebbs Account",
    dataIndex: "Account.EBBS_Account_Number",
    key: "Account.EBBS_Account_Number",
    render: (value, data) => data.Account?.EBBS_Account_Number,
  },
  {
    title: "Nostro Type",
    dataIndex: "Nostro_Type",
    key: "Nostro_Type",
    render: (value, data) => data.Nostro_Type,
  },
];

const List: FC<NostroListProps> = ({ data, onSelectRow }) => {
  const [selectedRow, setSelectedRow] = useState<NostroListDataType>();
  const handleTableClick = useCallback((record: NostroListDataType) => {
    onSelectRow(record);
    setSelectedRow(record);
  }, []);
  return (
    <StyledTable
      columns={columns}
      dataSource={data}
      size="small"
      key="id"
      pagination={{
        size: "small",
        pageSize: 5,
        hideOnSinglePage: true,
      }}
      locale={{
        emptyText: "No Available Nostro",
      }}
      onRow={(record) => ({ onClick: () => handleTableClick(record) })}
      rowClassName={(record) =>
        (record as NostroListDataType).SSI_Unique_Id === selectedRow?.SSI_Unique_Id
          ? classes.rowSelected
          : ""
      }
    />
  );
};

export default List;
