import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";

import { postManualResend } from "../../../services";
import { WorkflowActionExtraOptions } from "../../common/interface";
import { hasManualResendPermission } from "../../common/utils";
import { BlotterDataType } from "../../store/interface";

export const manualResendRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef | string => {
  if (!param) return "";
  let selectedRows: BlotterDataType[] = param.api?.getSelectedRows() ?? [];
  const data = param.node?.data as BlotterDataType;
  if (hasManualResendPermission) {
    if (selectedRows.length === 0) selectedRows = [data];
    if (
      selectedRows.every(
        (r) =>
          ["END", "DELIVERED"].includes(r.Status) &&
          r.Booking_System_Event !== "NonEcoAmend"
      )
    ) {
      return {
        name: "Resend",
        action: () => {
          const { messageApi } = options;
          try {
            postManualResend(selectedRows).then(() => {
              messageApi.success("Resend succeeded !");
            });
          } catch (error) {
            messageApi.error("Resend failed !");
          }
        },
      };
    }
  }
  return "";
};
