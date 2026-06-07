import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton, Tooltip as Tip } from "@mui/material";
import { MessageArgsProps, Tag, Tooltip } from "antd";
import { ReactNode } from "react";
import { SimpleAmount } from "src/Root/import/ratancomponents";

import {
  CashflowDisplay,
  ExtraFormSubmitFormDataType,
  ResultStatus,
  SettlementMethodUpdateRequestBody,
  SettlementMethodUpdateResponse,
  TradeCashflow,
} from "../type";

export const BULK_UPDATE_LIMIT = 100;
const SETTLEMENT_METHOD_TOGGLE: Record<string, string> = {
  UTIL: "GROSS",
  GROSS: "UTIL",
  "": "UTIL",
};

/**
 * Builds the API request body for the settlement method update.
 *
 * Steps:
 *   1. Group cashflow IDs by their parent tradeId
 *   2. Determine the target settlement method (toggle from current) (GROSS/"" → UTIL, UTIL → GROSS)
 *   3. Attach the comment from the extra form
 */
export const handlePayload = (
  dialogData: CashflowDisplay[],
  formPayload: ExtraFormSubmitFormDataType
): SettlementMethodUpdateRequestBody => {
  const tradeMap = new Map<string, string[]>();
  dialogData.forEach(({ tradeId, cashflowId }) => {
    const tid = tradeId ?? "";
    const cid = cashflowId ?? "";
    if (!tradeMap.has(tid)) {
      tradeMap.set(tid, []);
    }
    tradeMap.get(tid)!.push(cid);
  });

  const trades: TradeCashflow[] = Array.from(tradeMap.entries()).map(
    ([tradeId, cashflowIds]) => ({ tradeId, cashflowIds })
  );

  const currentMethod = dialogData[0]?.settlementMethod ?? "";
  const targetSettlementMethod = SETTLEMENT_METHOD_TOGGLE[currentMethod];

  return {
    trades,
    settlementMethod: targetSettlementMethod,
    comment: formPayload.comment,
  };
};

export const sortByTradeId = (
  a: CashflowDisplay,
  b: CashflowDisplay
): number => {
  return (a.tradeId ?? "").localeCompare(b.tradeId ?? "");
};

export const renderPaymentAmount = (value: string): ReactNode => {
  return <SimpleAmount value={value} formatOptions={{ trimMantissa: true }} />;
};

export const renderSettlementMethod = (value: string): string =>
  SETTLEMENT_METHOD_TOGGLE[value] ?? value;

export const renderOriginalSettlementMethod = (
  value: string | null | undefined
): ReactNode => {
  if (value === "" || value == null) return value;
  return <Tag color="blue">{value}</Tag>;
};

export const renderTargetSettlementMethod = (
  value: string | null | undefined
): ReactNode => {
  const targetValue = renderSettlementMethod(value ?? "");
  return (
    <Tag color="orange" style={{ fontWeight: "bold" }}>
      {targetValue}
    </Tag>
  );
};

export const ActionResultCell = (
  _: string,
  record: CashflowDisplay
): ReactNode => {
  const { status, message } = record.actionResult;
  switch (status) {
    case ResultStatus.SubmitSuccess:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {message?.toLowerCase()}
        </Tag>
      );

    case ResultStatus.SubmitFailed:
      return (
        <Tooltip title={message}>
          <Tag icon={<CloseCircleOutlined />} color="error">
            failed
          </Tag>
        </Tooltip>
      );

    case ResultStatus.Submiting:
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          processing
        </Tag>
      );

    default:
      return <></>;
  }
};

export const ActionReasonCell = (
  _: string,
  record: CashflowDisplay
): ReactNode => {
  const insufficientReason = record.insufficientReason;
  return (
    <Tooltip title={insufficientReason}>
      <Tag icon={<InfoCircleOutlined />} color="error"></Tag>
    </Tooltip>
  );
};

export const getFeedbackType = (
  success: string[],
  failed: string[]
): MessageArgsProps["type"] => {
  if (success.length === 0) return "error";
  return failed.length === 0 ? "success" : "warning";
};

export const submitResultStatistic = (
  results: SettlementMethodUpdateResponse[]
): { success: string[]; failed: string[] } => {
  const state = { success: [] as string[], failed: [] as string[] };

  results.forEach((r) => {
    const tradeId = r.tradeId ?? "";
    if (r.success) {
      state.success.push(tradeId);
    } else {
      state.failed.push(tradeId);
    }
  });

  return state;
};

export const submitResultFeedback = (
  results: SettlementMethodUpdateResponse[]
): MessageArgsProps => {
  const { success, failed } = submitResultStatistic(results);

  const messages = [
    success.length
      ? `${success.length} ${success.length > 1 ? "trades" : "trade"} succeed !`
      : "",
    failed.length
      ? `${failed.length} ${failed.length > 1 ? "trades" : "trade"} failed !`
      : "",
  ].filter(Boolean);

  const type: MessageArgsProps["type"] = getFeedbackType(success, failed);
  const hint = "Click to view details";

  return {
    content: (
      <div>
        {messages.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4 }}>{hint}</div>
      </div>
    ),
    type,
  };
};

export const handleDialogTitle = (
  cashflowDataByTrade: CNCashflow[]
): ReactNode => {
  const uniqueTradeIds = Array.from(
    new Set(
      cashflowDataByTrade.map((c) => c.Trade_Id).filter(Boolean) as string[]
    )
  );
  return (
    <span>
      <span>Settlement Method Update</span>
      <span style={{ fontSize: 12, color: "#ffa726" }}>
        <span>
          &nbsp;&nbsp;-&nbsp;&nbsp;System automatically selected all cashflows
          under trades
        </span>
        <Tip
          title={`Trade Id(s): ${uniqueTradeIds.join(", ")}`}
          placement="right"
        >
          <IconButton>
            <InfoIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Tip>
      </span>
    </span>
  );
};

export const setInitResultStatusToCashflowDisplay = (
  cashflow: CashflowDisplay
): CashflowDisplay => {
  return {
    ...cashflow,
    actionResult: {
      status: ResultStatus.None,
      message: "",
    },
  };
};

export const setProcessingToCashflowDisplay = (
  cashflow: CashflowDisplay
): CashflowDisplay => {
  return {
    ...cashflow,
    actionResult: {
      status: ResultStatus.Submiting,
      message: "",
    },
  };
};
