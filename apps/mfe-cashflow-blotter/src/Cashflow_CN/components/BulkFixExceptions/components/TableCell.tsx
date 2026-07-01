import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import ErrorIcon from "@mui/icons-material/Error";
import { Chip, ChipTypeMap } from "@mui/material";
import { Space, Tag, Tooltip, Typography } from "antd";

import {
  ExceptionCategory,
  MultiExceptionsNames,
} from "../../CashflowDetails/MultiExceptions/common/interface";
import { matchException } from "../../CashflowDetails/MultiExceptions/common/utils";
import { CommonException } from "../../CashflowDetails/MultiExceptions/components/CommonExceptions/interface";
import { BulkResultStatus, CashflowDisplay } from "../type";

export const BulkActionResultCell = (
  _: any,
  record: CashflowDisplay,
  index: number
) => {
  const { status, message } = record.bulkActionResult;
  switch (status) {
    case BulkResultStatus.SubmitSuccess:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {message?.toLowerCase()}
        </Tag>
      );

    case BulkResultStatus.SubmitFailed:
      return (
        <Tooltip title={message}>
          <Tag icon={<CloseCircleOutlined />} color="error">
            failed
          </Tag>
        </Tooltip>
      );

    case BulkResultStatus.Submiting:
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          processing
        </Tag>
      );

    case BulkResultStatus.NotificationUpdated:
      return <Tag>Status Updated</Tag>;

    default:
      return <></>;
  }
};

const exceptionsSorting = (exceptions: RatanException[]) => {
  return exceptions.sort((a, b) => {
    if (matchException(a) === MultiExceptionsNames.Affirmation) return -1;
    return 0;
  });
};

export const getChipProps = (props: CommonException) => {
  const { Exception_Code, Exception_Category, Bulk_Eligible } = props;

  let chipProps: ChipTypeMap["props"] = {
    label: Exception_Code,
    color: "default",
    variant: "outlined",
  };
  switch (Exception_Category) {
    case ExceptionCategory.HIGH_RISK_NSTP:
      chipProps.icon = <ErrorIcon titleAccess="High Risk Exception" />;
      chipProps.color = "error";
      break;

    case ExceptionCategory.HARD_BLOCKER:
      chipProps.icon = <ErrorIcon titleAccess="Hard Blocker Exception" />;
      chipProps.color = "error";
      break;

    case ExceptionCategory.AFFIRMATION:
      chipProps.color = "warning";
      break;

    default:
      break;
  }

  if (!Bulk_Eligible) {
    chipProps.label = (
      <Typography.Text delete>{Exception_Code}</Typography.Text>
    );
  }

  return chipProps;
};

export const ExceptionsCell = (
  _: any,
  record: CashflowDisplay,
  index: number
) => {
  const { exceptions } = record;
  return (
    <Space wrap>
      {exceptionsSorting(exceptions).map((e) => (
        <Tooltip title={e.Description} placement="top" key={e.Exception_Code}>
          <Chip size="small" {...getChipProps(e)} />
        </Tooltip>
      ))}
    </Space>
  );
};
