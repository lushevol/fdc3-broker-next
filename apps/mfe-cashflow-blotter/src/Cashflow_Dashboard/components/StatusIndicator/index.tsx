import { Card, CardActionArea, CardContent, Stack } from "@mui/material";
import { Statistic } from "antd";
import dayjs from "dayjs";
import get from "lodash/get";
import { DateFormat } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";
import { getDateByWorkdayOffset } from "src/Cashflow_Dashboard/Main/common/utils";
import { get_DASHBOARD_STATUS_INDICATOR } from "src/Root/analysis/const";

import { type CashflowStatusNum, TILE_MENU } from "../../Main/common/interface";
import { useDashboardContext } from "../../Main/hooks/context";
import useController from "../../Main/hooks/useController";
import { ACCOUNTING_ERROR_STATUS, SWIFT_ERROR_STATUS } from "./const";

type StatusIndicatorItem = {
  label: string;
  key: keyof CashflowStatusNum;
  getfilters: () => Filter[];
  hidden?: boolean;
};

const getVDOffset = () => {
  return 2;
};

const generateCashflowStatusFilter = (value) => {
  return {
    field: "Cashflow.Cashflow_State",
    operator: "IN",
    values: value,
  };
};

const generateDashboardStatusFilter = (value) => {
  return {
    field: "Status",
    operator: "in",
    values: [value],
  };
};

const generateDashboardGroupStatusFilter = (values: string[]) => {
  return {
    field: "Group_Status",
    operator: "in",
    values: values,
  };
};

const generateCashflowValueDateFilter = (
  offsetStart: number,
  offsetEnd: number
) => {
  return {
    field: "Cashflow.Payment_Date",
    operator: "BET",
    values: [
      getDateByWorkdayOffset(offsetStart),
      getDateByWorkdayOffset(offsetEnd),
    ],
  };
};

const generateGroupValueDateFilter = (
  _offsetStart: number,
  offsetEnd: number
) => {
  return {
    field: "Value_Date",
    operator: "<=",
    values: getDateByWorkdayOffset(offsetEnd),
  };
};

export const StatusList: StatusIndicatorItem[] = [
  {
    label: "Waiting VD Today",
    key: "Wating_Today_Num",
    getfilters: () => [
      generateCashflowStatusFilter(["WAITING"]),
      {
        field: "Cashflow.Payment_Date",
        operator: "EQ",
        values: dayjs().format(DateFormat),
      },
    ],
  },
  {
    label: "Failed VD Today",
    key: "Failed_Today_Num",
    getfilters: () => [
      generateCashflowStatusFilter(["FAILED"]),
      {
        field: "Cashflow.Payment_Date",
        operator: "EQ",
        values: dayjs().format(DateFormat),
      },
    ],
  },
  {
    label: "Error",
    key: "Error_Num",
    getfilters: () => [
      generateCashflowStatusFilter(["ERROR"]),
      generateCashflowValueDateFilter(0, getVDOffset()),
    ],
  },
  {
    label: "Accounting Error",
    key: "Accounting_Error_Num",
    getfilters: () => [
      {
        field: "Cashflow.Cashflow_Accounting_Status",
        operator: "IN",
        values: ACCOUNTING_ERROR_STATUS,
      },
      generateCashflowValueDateFilter(-1, 1),
    ],
  },
  {
    label: "Swift Error",
    key: "Swift_Error_Num",
    getfilters: () => [
      {
        field: "Cashflow.Cashflow_Swift_Status",
        operator: "IN",
        values: SWIFT_ERROR_STATUS,
      },
      generateCashflowValueDateFilter(-1, 1),
    ],
  },
  {
    label: "Queued",
    key: "Queued_Num",
    getfilters: () => [
      generateCashflowStatusFilter(["QUEUED"]),
      generateCashflowValueDateFilter(0, getVDOffset()),
    ],
  },
  {
    label: "Hold",
    key: "Hold_Num",
    getfilters: () => [
      generateCashflowStatusFilter(["HOLD"]),
      generateCashflowValueDateFilter(0, getVDOffset()),
    ],
  },
  {
    label: "Group Pending",
    key: "Group_Pending_Num",
    getfilters: () => [
      generateDashboardStatusFilter("PENDING"),
      generateDashboardGroupStatusFilter([
        "PENDING",
        "PENDING_PRE_GROUP",
        "COMPLETED",
      ]),
    ],
  },
  {
    label: "Group Error",
    key: "Group_Error_Num",
    getfilters: () => [generateDashboardStatusFilter("ERROR")],
  },
  {
    label: "Group Pending Validation",
    key: "Group_Pending_Validation_Num",
    getfilters: () => [
      generateDashboardStatusFilter("PENDING"),
      generateDashboardGroupStatusFilter(["PENDING_TRADE_VALIDATION"]),
      generateGroupValueDateFilter(0, 1),
    ],
  },
];

export const StatusIndicator = () => {
  const data = useDashboardContext();
  const { openCashflowBlotterByFilter } = useController();
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {StatusList.filter((item) => !item.hidden).map((item) => (
        <Card sx={{ minWidth: 138 }} key={item.key}>
          <CardActionArea
            onClick={() =>
              openCashflowBlotterByFilter(
                item.getfilters(),
                item.label.includes("Group")
                  ? TILE_MENU.CASHFLOW_GROUP_MANAGEMENT
                  : TILE_MENU.CASHFLOW_CN
              )
            }
          >
            <CardContent sx={{ paddingBottom: "16px" }}>
              <Statistic
                title={item.label}
                value={get(data, `Status_Num.${item.key}.value`)}
                loading={get(data, `Status_Num.${item.key}.loading`)}
                valueStyle={{
                  color:
                    get(data, `Status_Num.${item.key}.value`, 0) === 0
                      ? undefined
                      : "#ffa726",
                }}
                data-testid={get_DASHBOARD_STATUS_INDICATOR(item.key)}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
};
