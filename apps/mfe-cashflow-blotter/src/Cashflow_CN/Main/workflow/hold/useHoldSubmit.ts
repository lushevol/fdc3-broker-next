import { MessageInstance } from "antd/es/message/interface";
import {
  cashflowHold,
  cashflowUnhold,
  cashflowUserStatusUpdate,
} from "src/Cashflow_CN/services";

import { CashflowUserStatusUpdateResponse } from "../earlyMaterialization/interface";
import { HoldActionName } from "./index";

const getHoldPayload = (
  data: CNCashflow[],
  action: string,
  comments: string
) => {
  return {
    action,
    comment: comments,
    cashflows: data.map((item) => ({
      cashflowId: item?.Cashflow?.Cashflow_Id + "",
      businessVersion: item?.Cashflow?.Cashflow_Business_Version + "",
      minorVersion: item?.Cashflow?.Cashflow_Minor_Version + "",
      cashflowVersion: item?.Cashflow?.Cashflow_Version + "",
    })),
  };
};

const getSendToWaitingPayload = (data: CNCashflow[], comments: string) => {
  return {
    lifecycleRequests: data.map((d) => ({
      cashflowId: d.Cashflow?.Cashflow_Id + "",
      businessVersion: d.Cashflow?.Cashflow_Business_Version + "",
      cashflowVersion: d.Cashflow?.Cashflow_Version + "",
      minorVersion: d.Cashflow?.Cashflow_Minor_Version + "",
      nstpReason: d.Cashflow?.NSTP_Reason,
      comment: comments,
      ratanAction: "ReInstate",
    })),
  };
};

const handleUnhold = async (
  data: CNCashflow[],
  comments: string,
  messageApi: MessageInstance
) => {
  const payload = getHoldPayload(data, HoldActionName.UNHOLD, comments);
  try {
    const resp = await cashflowUnhold(payload);
    if (resp?.status === 200) {
      messageApi.success("Unhold successfully submitted!");
      return true;
    } else {
      messageApi.error(resp?.errorMessage || "Unhold action failed");
      return false;
    }
  } catch {
    messageApi.error("Unhold action failed");
    return false;
  }
};

const handleHold = async (
  data: CNCashflow[],
  comments: string,
  messageApi: MessageInstance
) => {
  const payload = getHoldPayload(data, HoldActionName.HOLD, comments);
  try {
    const resp = await cashflowHold(payload);
    if (resp?.status === 200) {
      messageApi.success("Hold successfully submitted");
      return true;
    } else {
      messageApi.error(resp?.errorMessage || "Hold action failed");
      return false;
    }
  } catch {
    messageApi.error("Hold action failed");
    return false;
  }
};

const handleSendToWaiting = async (
  data: CNCashflow[],
  comments: string,
  messageApi: MessageInstance
) => {
  const payload = getSendToWaitingPayload(data, comments);
  try {
    const resp: CashflowUserStatusUpdateResponse =
      await cashflowUserStatusUpdate(payload);
    if (resp?.success) {
      messageApi.success("Send To WAITING Action Success!");
      return true;
    } else {
      resp?.responses?.forEach((e: any) => {
        const { success, cashflowId, errorMessage } = e;
        if (!success) messageApi.error(`${cashflowId} failed: ${errorMessage}`);
      });
      return false;
    }
  } catch {
    messageApi.error("Send To WAITING action failed");
    return false;
  }
};

export const useHoldSubmit = (
  data: CNCashflow[],
  action: string,
  messageApi: MessageInstance
) => {
  const handleSubmit = async (comments: string): Promise<boolean> => {
    try {
      if (action === HoldActionName.UNHOLD) {
        return await handleUnhold(data, comments, messageApi);
      }
      if (action === HoldActionName.HOLD) {
        return await handleHold(data, comments, messageApi);
      }
      if (action === HoldActionName.SEND_TO_WAITING) {
        return await handleSendToWaiting(data, comments, messageApi);
      }
      messageApi.error("No match action");
      return false;
    } catch {
      messageApi.error("No match action");
      return false;
    }
  };

  return { handleSubmit };
};
