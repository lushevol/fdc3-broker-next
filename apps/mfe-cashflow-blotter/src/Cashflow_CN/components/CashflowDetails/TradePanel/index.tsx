import { InfoOutlined } from "@mui/icons-material";
import {
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Descriptions, Popover } from "antd";
import { Button } from "Import/index";
import _get from "lodash/get";
import { FC, memo, useContext } from "react";
import {
  CASHFLOW_DETAILS_BOOKING_ENTITY_BTN,
  CASHFLOW_DETAILS_OPEN_TRADE_DETAIL_BTN,
} from "src/Root/analysis/const";
import { Time } from "src/Root/import";
import { EntityDetails } from "src/Root/import/ratancomponents";
import { getTradeStatusArray } from "src/Root/import/ratanutils";

import { tradeStatus } from "../common/statusDisplayConfig";
import { CounterParty } from "../components/CounterParty";
import { StatusChain } from "../components/StatusChain";
import { IsPendingRequestContext } from "../detailsBody";
import { TradePanelProps } from "./interface";
import StyledRoot, { classes } from "./style";

const passAvailableData = (trade, cashflow) => {
  return trade?.Trade_Id ? trade : cashflow;
};

const getDataFromTradeOrCashflow = (
  field: string,
  trade?: (Trade_Review & { Versions: Trade_Review[] }) | null,
  cashflow?: CNCashflow
) => {
  return _get(trade, field) || _get(cashflow, field, "");
};

type KeyInfoDisplayConfig = {
  label: string;
  path: string;
  render?: (
    _: string,
    data: Omit<TradePanelProps, "onOpenTradeDetails">
  ) => JSX.Element;
};

const KeyInfoDisplay: KeyInfoDisplayConfig[] = [
  {
    label: "Trade ID",
    path: "Trade_Id",
    render: (_, { trade, cashflow }) => {
      const data = getDataFromTradeOrCashflow("Trade_Id", trade, cashflow);
      return <>{data}</>;
    },
  },
  {
    label: "Trade Version",
    path: "Trade_Version",
    render: (_, { trade, cashflow }) => {
      const data = getDataFromTradeOrCashflow("Trade_Version", trade, cashflow);
      return <>{data}</>;
    },
  },
  {
    label: "Trade Status",
    path: "Trade_State",
    render: (_, { cashflow }) => {
      return <>{_get(cashflow, "Trade_State")}</>;
    },
  },
  {
    label: "Trade Date",
    path: "Trade_Date",
    render: (_, { trade, cashflow }) => {
      //use Trade_Date from cashflow when data source is Murex, otherwise keep current logic.
      const data =
        cashflow?.Data_Flow?.Data_Source_System?.toLowerCase() === "murex"
          ? cashflow
          : trade;
      const trade_date = _get(data, "Trade_Date");
      return trade_date ? (
        <Time value={trade_date} field="Trade_Date" isAccurateToDay={true} />
      ) : (
        <></>
      );
    },
  },
  {
    label: "Booking Entity",
    path: "Entity.Booking_Entity_SCI_FMCODE",
    render: (_, { trade, cashflow }) => {
      const {
        Booking_Entity_SCI_FMCODE = "N/A",
        Booking_Entity_SCI_FMID = "N/A",
      } = cashflow?.Entity ?? {};
      const { Booking_Entity_SCI_LEID = "N/A", Booking_Entity_LEI = "N/A" } =
        trade?.Entity || {};
      const entity = Booking_Entity_SCI_FMCODE;
      const entityData = [
        {
          key: "Booking Entity SCI LEID",
          version: Booking_Entity_SCI_LEID,
        },
        {
          key: "Booking Entity LEI",
          version: Booking_Entity_LEI,
        },
        {
          key: "Booking Entity SCI FMID",
          version: Booking_Entity_SCI_FMID,
        },
      ];
      return (
        <>
          <span>{entity}</span>
          <Popover
            content={<EntityDetails data={entityData} />}
            trigger="click"
            placement="bottomRight"
          >
            <IconButton
              aria-label="delete"
              size="small"
              className="popover-btn"
              id="cashflow-entity-icon"
              data-testid={CASHFLOW_DETAILS_BOOKING_ENTITY_BTN}
              disabled={!cashflow}
            >
              <InfoOutlined sx={{ fontSize: "12px" }} />
            </IconButton>
          </Popover>
        </>
      );
    },
  },
  {
    label: "Counterparty",
    path: "Entity.Counterparty_SCI_FMCODE",
    render: (_, { trade, cashflow }) => {
      const data = passAvailableData(trade, cashflow);
      const counterpartyCashflow = _get(
        cashflow,
        "Entity.Counterparty_SCI_FMCODE"
      );
      return (
        <>
          <span>{counterpartyCashflow}</span>
          <CounterParty data={data} />
        </>
      );
    },
  },
  {
    label: "Portfolio",
    path: "Portfolio.Booking_Entity_Trade_Portfolio_Name",
    render: (_, { trade, cashflow }) => {
      const data = getDataFromTradeOrCashflow(
        "Portfolio.Booking_Entity_Trade_Portfolio_Name",
        trade,
        cashflow
      );
      return <>{data}</>;
    },
  },
  {
    label: "Counterparty FMID",
    path: "Entity.Counterparty_SCI_FMID",
    render: (_, { trade, cashflow }) => {
      const data = getDataFromTradeOrCashflow(
        "Entity.Counterparty_SCI_FMID",
        trade,
        cashflow
      );
      return <>{data}</>;
    },
  },
  {
    label: "Product Taxonomy",
    path: "Instrument_Common.ISDA_Taxonomy",
    render: (_Product, { trade, cashflow }) => {
      const data = passAvailableData(trade, cashflow);
      const product = getDataFromTradeOrCashflow(
        "Instrument_Common.ISDA_Taxonomy",
        trade,
        cashflow
      );
      return (
        <>
          <span>{product}</span>
        </>
      );
    },
  },
];

const TradeStatusChanges: FC<{
  trade: (Trade_Review & { Versions: Trade_Review[] }) | null;
}> = ({ trade }) => {
  const {
    Trade_State,
    Trade_Lake_Trade_Major_Version,
    Trade_Lake_Trade_Minor_Version,
    Versions,
  } = trade ?? {};
  const latestVersion = {
    Trade_Lake_Trade_Major_Version,
    Trade_Lake_Trade_Minor_Version,
    Trade_State,
  };

  const newVersionArr = [...(Versions || []), latestVersion];
  const tradeStatusArray = getTradeStatusArray(newVersionArr);
  if (tradeStatusArray && tradeStatusArray.length > 1) {
    return (
      <StatusChain statusConfig={tradeStatus} statusChain={tradeStatusArray} />
    );
  }
  return null;
};

const displayTradeItem = (
  i: KeyInfoDisplayConfig,
  trade,
  data,
  cashflow?: CashflowDataModal
) => {
  if (i.render) {
    return i.render(_get(data, i.path), { trade, cashflow });
  }
  return <Typography>{_get(trade, i.path)}</Typography>;
};

const TradePanel: FC<TradePanelProps> = memo(
  ({ trade, cashflow, onOpenTradeDetails, disableTradeOpenBtn = false }) => {
    const isPendingRequest = useContext(IsPendingRequestContext);
    const data = passAvailableData(trade, cashflow);
    return (
      <StyledRoot className={classes.root}>
        <CardContent>
          <Descriptions
            title="Trade Details"
            size="small"
            column={{ xs: 3, sm: 3, md: 4, lg: 4, xl: 4, xxl: 5 }}
            extra={
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <TradeStatusChanges trade={trade} />
                {!!cashflow?.Trade_Id && !disableTradeOpenBtn && (
                  <Button
                    onClick={onOpenTradeDetails}
                    variant="outlined"
                    data-testid={CASHFLOW_DETAILS_OPEN_TRADE_DETAIL_BTN}
                  >
                    Open Trade Details
                  </Button>
                )}
              </Stack>
            }
          >
            {KeyInfoDisplay.map((i) => (
              <Descriptions.Item label={i.label} key={i.path}>
                {!_get(data, i.path) && isPendingRequest ? (
                  <Skeleton variant="rounded" width={100} />
                ) : (
                  displayTradeItem(i, trade, data, cashflow)
                )}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </CardContent>
      </StyledRoot>
    );
  }
);

export default TradePanel;
