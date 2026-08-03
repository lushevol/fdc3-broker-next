import InfoIcon from "@mui/icons-material/Info";
import { IconButton, Tooltip } from "@mui/material";
import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { message } from "antd";
import { hasPermission } from "Import/ratanutils";
import { FC, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormRef } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/interface";
import Affirmation from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/components/Affirmation";
import { layoutSettingContext } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/components/Layout/item";
import CommonCommentActionDialog from "src/Cashflow_CN/components/CommonCommentAction";
import { useRTT } from "src/Root/analysis";
import {
  get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_ALL_CF_IDS_BTN,
  RTT_MUTATION_LIFECYCLE_ACTION,
} from "src/Root/analysis/const";
import { plattenStr } from "src/Root/analysis/utils";

import { cashflowUserStatusUpdate } from "../../../services";
import { WorkflowActionExtraOptions } from "../../common/interface";
import {
  aggridDeselectAll,
  earlyMaterializationWorkflowAction,
  updateCashflow,
} from "../../store/actions";
import { RootState } from "../../store/interface";
import {
  CashflowUserStatusUpdateApi,
  CashflowUserStatusUpdateRequest,
  CashflowUserStatusUpdateResponse,
} from "./interface";

const isMatchMaterialization = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_State === "PROJECTED";
const isMatchReInstate = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_State === "FAILED" ||
  (cashflow.Cashflow?.Cashflow_State === "QUEUED" &&
    cashflow.Cashflow.Cashflow_Sub_State_Type === "Pending Exception");
const isMatchSettleAsGross = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_State === "WAITING" &&
  (["Pending Netting", "Pending Auto Netting"].includes(
    cashflow.Cashflow.Cashflow_Sub_State_Type as string
  ) ||
    (cashflow.Cashflow.Cashflow_Sub_State_Type === "Pending Another Leg" &&
      ["NA", "Pending Operator"].includes(
        cashflow.Cashflow?.Cashflow_Sub_State as string
      )));
const isMatchReplayStatusWriteBack = (cashflow: CNCashflow) =>
  ["RELEASED", "SETTLED", "NOSTRO_MATCHED"].includes(
    cashflow.Cashflow?.Cashflow_State as string
  );
const isMatchResendToRazor = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_State === "READY" &&
  cashflow.Cashflow.Cashflow_Sub_State_Type === "Pending Ack";
const isMatchEarlyRelease = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_State === "READY" &&
  cashflow.Cashflow.Cashflow_Sub_State === "NA" &&
  cashflow.Cashflow.Cashflow_Sub_State_Type === "NA";
const isMatchAffirmed = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_Affirmation_Status !== "Affirmed" &&
  cashflow.Cashflow?.Cashflow_State === "WAITING" &&
  cashflow.Cashflow?.Cashflow_Sub_State_Type === "Pending Exception";
const isMatchReGenerateSwift = (cashflow: CNCashflow) =>
  cashflow.Cashflow?.Cashflow_State === "READY" &&
  cashflow.Cashflow.Cashflow_Sub_State_Type === "Pending Ack" &&
  cashflow.Cashflow.Cashflow_Swift_Message_Standard === "STRATEGIC";

export const actionMapping = (cashflow: CNCashflow) => {
  if (isMatchMaterialization(cashflow)) return "Materialize";
  else if (isMatchReInstate(cashflow)) return "ReInstate";
  else if (isMatchSettleAsGross(cashflow)) return "SettleAsGross";
  // else if (isManualStp(cashflow)) return "ManualStp";
  else if (isMatchReplayStatusWriteBack(cashflow))
    return "ReplayStatusWriteBack";
  else if (isMatchReGenerateSwift(cashflow)) return "ReGenerateSwift";
  else if (isMatchResendToRazor(cashflow)) return "ResendToRazor";
  else if (isMatchEarlyRelease(cashflow)) return "EarlyRelease";
  else if (isMatchAffirmed(cashflow)) return "ManualAffirmed";
  return "";
};

export const actionNameMapping = (action: string) => {
  switch (action) {
    case "Materialize":
      return "Early Materialization";

    case "ReInstate":
      return "ReInstate";

    case "SettleAsGross":
      return "Settle As Gross";

    case "ReplayStatusWriteBack":
      return "Status Write Back";

    case "ResendToRazor":
      return "Resend To Razor";

    case "EarlyRelease":
      return "Early Release";

    case "ManualAffirmed":
      return "Update Affirmation";

    case "Comment":
      return "Comment";

    case "ReGenerateSwift":
      return "Regenerate Swift";

    default:
      return "";
  }
};

const checkHasPermission = (actionName: string) => {
  if (actionName === "ReInstate") {
    return hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Reinstate");
  } else {
    return hasPermission(
      "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release"
    );
  }
};

export const earlyMaterializationRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  const hoverRow: CNCashflow = param.node?.data;
  let selectedRows = (param.api?.getSelectedRows() ?? []) as CNCashflow[];
  const allActions: string[] = [];

  if (selectedRows.length === 0) selectedRows = [hoverRow];
  selectedRows.forEach((item: any) => {
    const actionName = actionNameMapping(actionMapping(item));
    if (actionName && checkHasPermission(actionName)) {
      allActions.push(actionName);
    }
  });

  if (
    allActions.length !== selectedRows.length ||
    new Set(allActions).size !== 1
  )
    return null;

  if (allActions[0] === "Update Affirmation" && allActions.length > 1)
    return null;
  const { dispatch } = options;
  return {
    name: allActions[0],
    action: () => {
      dispatch(
        earlyMaterializationWorkflowAction({
          isOpenDialog: true,
          action: actionMapping(selectedRows[0]),
          data: selectedRows,
        })
      );
    },
  };
};

export const adhocCommentRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  if (!param) return null;
  let selectedRows = param.api?.getSelectedRows() as CNCashflow[];
  const cashflow = param.node?.data as CNCashflow;
  if (selectedRows.length === 0) selectedRows = [cashflow];
  const { dispatch } = options;
  return {
    name: "Comment",
    action: () => {
      dispatch(
        earlyMaterializationWorkflowAction({
          isOpenDialog: true,
          action: "Comment",
          data: selectedRows,
        })
      );
    },
  };
};

export const EarlyMaterializationWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenDialog, action, data } = useSelector(
    (state: RootState) => state.earlyMaterializationWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();
  const affirmRef = useRef<FormRef>(null);
  const [affirmFormDisable, setAffirmFormDisable] = useState(false);
  const { startTracking } = useRTT();

  const scopeLayoutSetting = useMemo(
    () => ({
      disable: affirmFormDisable,
      availableActions: [],
      setDisable: () => {
        // empty
      },
    }),
    [affirmFormDisable]
  );

  const onClose = (isRefresh: boolean) => {
    dispatch(
      earlyMaterializationWorkflowAction({
        isOpenDialog: false,
        action: "",
        data: undefined,
      })
    );
    if (isRefresh) {
      dispatch(updateCashflow(data!.map((d) => d.Cashflow!.Cashflow_Id!)));
      dispatch(aggridDeselectAll());
    }
  };

  const isAffrimed = useMemo(() => action === "ManualAffirmed", [action]);

  const onSubmit = async (comment: string) => {
    const payload: CashflowUserStatusUpdateRequest = {
      lifecycleRequests: data!.map((d) => ({
        cashflowId: d.Cashflow?.Cashflow_Id!,
        businessVersion: d.Cashflow?.Cashflow_Business_Version! + "",
        cashflowVersion: d.Cashflow?.Cashflow_Version! + "",
        minorVersion: d.Cashflow?.Cashflow_Minor_Version! + "",
        nstpReason: d.Cashflow?.NSTP_Reason,
        comment,
        ratanAction: action,
      })),
    };
    if (isAffrimed) {
      const form = affirmRef.current?.getForm();
      if (!form) return false;
      try {
        await form.validateFields();
      } catch (error) {
        return false;
      }
      const formData = form.getFieldsValue();
      payload.lifecycleRequests.forEach(
        (i) => (i.affirmationDetails = formData)
      );
    }
    const { completeTracking, abortTracking } = startTracking();
    try {
      setAffirmFormDisable(true);
      const resp: CashflowUserStatusUpdateResponse = await (
        cashflowUserStatusUpdate as CashflowUserStatusUpdateApi
      )(payload);
      completeTracking({ name: RTT_MUTATION_LIFECYCLE_ACTION });
      if (resp?.success) {
        messageApi.success("Action Success !");
      } else {
        resp?.responses.forEach((e) => {
          const { success, cashflowId, errorMessage } = e;
          if (!success)
            messageApi.error(`${cashflowId} failed: ${errorMessage}`);
        });
        return false;
      }
    } catch (error) {
      abortTracking();
      return false;
    } finally {
      setAffirmFormDisable(false);
    }
    return true;
  };
  return (
    <>
      {isOpenDialog ? (
        <CommonCommentActionDialog
          open={isOpenDialog}
          title={
            <span>
              <span>{actionNameMapping(action)}</span>
              {(data?.length ?? 0) > 1 && (
                <span style={{ fontSize: 12, color: "#ffa726" }}>
                  <span>
                    &nbsp;&nbsp;-&nbsp;&nbsp;{data?.length} cashflows selected
                  </span>
                  <Tooltip
                    title={`Cashflow Ids: ${data
                      ?.map((d) => d.Cashflow?.Cashflow_Id)
                      .join(", ")}`}
                    placement="right"
                  >
                    <IconButton
                      data-testid={get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_ALL_CF_IDS_BTN(
                        actionNameMapping(action)
                      )}
                    >
                      <InfoIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Tooltip>
                </span>
              )}
            </span>
          }
          onSubmit={onSubmit}
          onClose={onClose}
          showCommentLabel={isAffrimed}
          commentRows={isAffrimed ? 6 : undefined}
          labelColSpan={isAffrimed ? 7 : undefined}
          wrapperColSpan={isAffrimed ? 16 : undefined}
          height={isAffrimed ? "410px" : undefined}
          testId={plattenStr(actionNameMapping(action))}
        >
          {isAffrimed && (
            <layoutSettingContext.Provider value={scopeLayoutSetting}>
              <Affirmation
                ref={affirmRef}
                data={null}
                labelColSpan={7}
                wrapperColSpan={16}
              />
            </layoutSettingContext.Provider>
          )}
        </CommonCommentActionDialog>
      ) : (
        <></>
      )}
      {messageContextHolder}
    </>
  );
};
