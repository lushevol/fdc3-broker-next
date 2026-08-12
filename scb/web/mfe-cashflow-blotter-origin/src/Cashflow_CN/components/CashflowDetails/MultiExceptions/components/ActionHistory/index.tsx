import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FC } from "react";

import { ExceptionBundleStatusTypes } from "../../common/interface";
import { ActionHistoryProps, HistoryDataType } from "./interface";
import StyledRoot, { classes } from "./style";

const tagColorByAction = (act: string) => {
  switch (act) {
    case ExceptionBundleStatusTypes.Approve:
      return "success";
    case ExceptionBundleStatusTypes.Submit:
      return "processing";
    case ExceptionBundleStatusTypes.Reject:
      return "error";
    default:
      return "";
  }
};

const columns: ColumnsType<HistoryDataType> = [
  {
    title: "Action History",
    dataIndex: "Action",
    key: "Action",
    width: "15%",
    render: (_, { Action }) => (
      <Tag color={tagColorByAction(Action + "")}>{Action?.toUpperCase()}</Tag>
    ),
  },
  {
    title: "User PSID",
    dataIndex: "User_PSID",
    key: "User_PSID",
    width: "15%",
  },
  {
    title: "Date Time",
    dataIndex: "Action_Time",
    key: "Action_Time",
    width: "20%",
    render: (_, { Action_Time }) => (
      <span>{Action_Time?.replace(/[TZ]/g, " ")}</span>
    ),
  },
  {
    title: "Comment",
    dataIndex: "FMO_Comments",
    key: "FMO_Comments",
    ellipsis: true,
    render: (_, { FMO_Comments }) =>
      FMO_Comments?.map((com) => (
        <div
          key={`${com.FMO_Comment}_${com.FMO_Comment_Timestamp}`}
          title={com.FMO_Comment ?? ""}
        >
          {com.FMO_Comment}
        </div>
      )),
  },
];

const ActionHistory: FC<ActionHistoryProps> = ({ data }) => {
  return (
    <StyledRoot className={classes.root}>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        rowKey="Action_Time"
        pagination={{
          size: "small",
          pageSize: 2,
          hideOnSinglePage: true,
        }}
        locale={{
          emptyText: "No History Data",
        }}
      />
    </StyledRoot>
  );
};

export default ActionHistory;
