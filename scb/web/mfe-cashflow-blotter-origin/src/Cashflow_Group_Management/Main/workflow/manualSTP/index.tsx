import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { MessageInstance } from "antd/es/message/interface";

import { postManualSTP } from "../../../services";
import { CommonRespDataType } from "../../../services/type";
import { WorkflowActionExtraOptions } from "../../common/interface";
import { hasManualSTPPermission } from "../../common/utils";
import { BlotterDataType } from "../../store/interface";
import { getManualSTPWarningContent } from "./utils";

const targetGroupStatusArr = ["PENDING_TRADE_VALIDATION", "PENDING_PRE_GROUP"];

export const manualSTPRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions,
  callback: (data: BlotterDataType[]) => void
): MenuItemDef | string => {
  if (!param) return "";
  let selectedRows: BlotterDataType[] = param.api?.getSelectedRows() ?? [];
  const data = param.node?.data as BlotterDataType;
  if (hasManualSTPPermission) {
    if (selectedRows.length === 0) selectedRows = [data];
    if (selectedRows.every((r) => ["PENDING", "ERROR"].includes(r.Status))) {
      return {
        name: "Manual STP",
        action: () => {
          (async () => {
            const { messageApi, modalApi } = options;
            if (
              selectedRows.length > 1 &&
              !selectedRows.every((r) =>
                targetGroupStatusArr.includes(r.Group_Status)
              )
            ) {
              messageApi?.error(
                "Bulk Manual STP is only applicable for cashflows in PENDING_TRADE_VALIDATION or PENDING_PRE_GROUP group status."
              );
              return false;
            } else {
              const confirmed = await modalApi?.confirm({
                title: "Warning",
                content: getManualSTPWarningContent(selectedRows),
                okText: "Continue",
                getContainer: false,
                centered: true,
                width: 450,
              });
              if (!confirmed) return false;
              processManualSTPResult(
                selectedRows,
                postManualSTP,
                messageApi,
                callback
              );
            }
          })();
        },
      };
    }
  }
  return "";
};

export const processManualSTPResult = async (
  selectedRows: BlotterDataType[],
  postManualSTP: (
    rows: BlotterDataType[]
  ) => Promise<CommonRespDataType<BlotterDataType[] | null>>,
  messageApi: MessageInstance,
  callback: (data: BlotterDataType[]) => void
) => {
  try {
    const resp = await postManualSTP(selectedRows);
    if (resp?.errorCode === 200) {
      messageApi.success(resp?.errorMessage);
      resp?.data && callback(resp?.data);
    } else {
      messageApi.error(resp?.errorMessage);
    }
  } catch (error: any) {
    messageApi.error(error?.response?.data?.message || "Manual STP failed !");
  }
};
