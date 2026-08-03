import { CardContent, Divider, Skeleton, Stack } from "@mui/material";
import { Descriptions, Typography } from "antd";
import _get from "lodash/get";
import { CSSProperties, FC, useContext, useMemo } from "react";
import { ComponentCashflow } from "src/compat/related-applications";
import {
  canViewChildCashflow,
  ViewSplitChildComponentCashflow,
} from "src/Cashflow_CN/Main/workflow/splitting/SplittingDialog/ViewSplitChildComponentCashflow";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import {
  HandleHoliday,
  ShowTimeCompare,
  SimpleAmount,
} from "src/Root/import/ratancomponents";

import { isNettedCashflow } from "../../CashflowDetails/detailsBody";
import { cashflowCNStatus } from "../common/statusDisplayConfig";
import { DisplayAmendment } from "../components/DisplayAmendment";
import { StatusChain } from "../components/StatusChain";
import { IsPendingRequestContext } from "../detailsBody";
import { CashflowPanelProps } from "./interface";
import StyledRoot, { classes } from "./style";

type KeyInfoDisplayConfig = {
  label: string;
  path: string;
  span?: number;
  render?: (
    _: string,
    data: Pick<CashflowPanelProps, "cashflow" | "cashflowHistory">
  ) => JSX.Element;
};

const KeyInfoDisplay: KeyInfoDisplayConfig[] = [
  { label: "Cashflow ID", path: "Cashflow.Cashflow_Id" },
  {
    label: "Cashflow Business Version",
    path: "Cashflow.Cashflow_Business_Version",
  },
  {
    label: "Cashflow Status",
    path: "Cashflow.Cashflow_State",
    render: (cashflowState) => {
      let type;
      switch (cashflowState) {
        case "FAILED":
          type = "danger";
          break;

        case "SETTLED":
          type = "success";
          break;
        default:
          break;
      }
      return <Typography.Text type={type}>{cashflowState}</Typography.Text>;
    },
  },
  { label: "Cashflow Sub State", path: "Cashflow.Cashflow_Sub_State" },
  {
    label: "Cashflow Sub State Type",
    path: "Cashflow.Cashflow_Sub_State_Type",
  },
  // { label: "Netting ID", path: "Cashflow.Netting_Id", span: 2 },
  { label: "Cashflow Event", path: "Cashflow.Cashflow_Event_Type" },
  {
    label: "Cashflow Affirmation",
    path: "Cashflow.Cashflow_Affirmation_Status",
    render: (affirmationStatus) => {
      const status = affirmationStatus?.toUpperCase();
      return (
        <span
          className={[
            classes.affirmed,
            status === "AFFIRMED" ? "" : "not",
          ].join(" ")}
        >
          {status}
        </span>
      );
    },
  },
  {
    label: "Release Time",
    path: "Cashflow.Payment_Cutoff_Time",
    render: (_, { cashflow }) => {
      return <ShowTimeCompare data={cashflow} />;
    },
  },
  { label: "Payment Type", path: "Cashflow.Payment_Type" },
  {
    label: "CFI Code(FIC Code)",
    path: "Instrument_Common.Financial_Instrument_Code",
  },
];

const PaymentInfo: FC<{ cashflow: CNCashflow }> = ({ cashflow }) => {
  const { Cashflow, Delivery_Method } = cashflow || {};
  const { Payment_Amount, Payment_Currency, Pay_Receive_Indicator } =
    Cashflow ?? {};
  return (
    <Typography.Title className={classes.payment} level={5}>
      <span>We</span>
      &nbsp;
      <span
        className={[
          "key-data-show-span",
          (Pay_Receive_Indicator + "").toLowerCase(),
        ].join(" ")}
      >
        {Pay_Receive_Indicator}
      </span>
      &nbsp;
      <span className="key-data-show-color">{Payment_Currency}</span>
      &nbsp;
      <span className="key-data-show-amount">
        <SimpleAmount
          value={Payment_Amount}
          formatOptions={{ trimMantissa: true }}
        />
      </span>
      &nbsp;
      <span className="key-data-show-span">{Delivery_Method}</span>
    </Typography.Title>
  );
};

const ValueDate: FC<{ cashflow: CNCashflow }> = ({ cashflow }) => {
  const { Payment_Date } = cashflow.Cashflow ?? {};
  return (
    <Typography.Title className={classes.valueDate} level={5}>
      <span>Value Date</span>
      &nbsp;
      <HandleHoliday
        data={cashflow}
        value={Payment_Date}
        field="Cashflow.Payment_Date"
        isAccurateToDay
      />
    </Typography.Title>
  );
};

const CashflowStatusChanges: FC<{
  cashflowStatusChanges: string[];
  style?: CSSProperties;
}> = ({ cashflowStatusChanges, style }) => {
  return cashflowStatusChanges.length > 1 ? (
    <StatusChain
      statusChain={cashflowStatusChanges}
      statusConfig={cashflowCNStatus}
      style={style}
    />
  ) : null;
};

const displayItem = (
  i: KeyInfoDisplayConfig,
  cashflow: CNCashflow,
  cashflowHistory?: CashflowAuditTrail[]
) => {
  if (i.render) {
    return i.render(_get(cashflow, i.path), {
      cashflow,
      cashflowHistory,
    });
  }
  return <Typography>{_get(cashflow, i.path)}</Typography>;
};

const CashflowPanel: FC<CashflowPanelProps> = ({
  cashflow,
  cashflowHistory,
  onQueryCashflow,
}) => {
  const isPendingRequest = useContext(IsPendingRequestContext);
  const cashflowStatusChanges = useMemo(() => {
    if (!cashflowHistory) return [];
    const statusList = cashflowHistory
      .map((i) => i.Cashflow?.Cashflow_State)
      .filter(Boolean) as string[];
    if (statusList.length === 1) return statusList;
    let index = 0;
    for (let i = 1; i < statusList.length; i++) {
      if (statusList[index] !== statusList[i]) {
        statusList[++index] = statusList[i];
      }
    }
    return statusList.slice(0, ++index);
  }, [cashflowHistory]);
  return (
    <StyledRoot className={classes.root}>
      <CardContent>
        <Descriptions
          title={
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography.Title level={5} className={classes.title}>
                Cashflow Details
              </Typography.Title>
              <PaymentInfo cashflow={cashflow} />
              <ValueDate cashflow={cashflow} />
              <DisplayAmendment cashflow={cashflow.Cashflow} />
            </Stack>
          }
          size="small"
          column={{ xs: 3, sm: 3, md: 4, lg: 4, xl: 4, xxl: 5 }}
          extra={
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <CashflowStatusChanges
                style={{
                  overflowY: "auto",
                  maxWidth: "50vw",
                }}
                cashflowStatusChanges={cashflowStatusChanges}
              />
              {isNettedCashflow(cashflow) && (
                <ComponentCashflow
                    details={cashflow}
                    onQueryCashflow={onQueryCashflow}
                    isCashflowSettlementCN
                />
              )}
              {featureScopedEnabled("Manual_Splitting") &&
                canViewChildCashflow(cashflow) && (
                  <ViewSplitChildComponentCashflow details={cashflow} />
                )}
            </Stack>
          }
        >
          {KeyInfoDisplay.map((i) => (
            <Descriptions.Item label={i.label} span={i.span} key={i.path}>
              {!_get(cashflow, i.path) && isPendingRequest ? (
                <Skeleton variant="rounded" width={100} />
              ) : (
                displayItem(i, cashflow, cashflowHistory)
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </CardContent>
    </StyledRoot>
  );
};

export default CashflowPanel;
