import { css, styled } from "@mui/material";
import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { Alert, message } from "antd";
import dayjs from "dayjs";
import { getUser, hasPermission } from "Import/ratanutils";
import { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonCommentAction from "src/Cashflow_CN/components/CommonCommentAction";
import { plattenStr } from "src/Root/analysis/utils";

import {
  cashflowSwiftSuppressionCheckerAction,
  cashflowSwiftSuppressionMakerAction,
} from "../../../services";
import { WorkflowActionExtraOptions } from "../../common/interface";
import {
  aggridDeselectAll,
  suppressWorkflowAction,
  updateCashflow,
} from "../../store/actions";
import { RootState } from "../../store/interface";
import {
  ActionType,
  CashflowSwiftSuppressionApi,
  CashflowSwiftSuppressionRequest,
  SubmitAction,
  SubStateType,
} from "./interface";

const swiftSuppressionAvailableState = ["PROJECTED", "WAITING", "READY"];
const SuppressingSubStateTypes: SubStateType[] = [
  "Swift Suppression",
  "Undo Swift Suppression",
  "Cashflow Suppression",
  "Undo Cashflow Suppression",
];

export const isSuppressionForFailed = (cashflow: CNCashflow) => {
  const vd = cashflow.Cashflow?.Payment_Date;
  const isAfterVD = dayjs().isAfter(vd, "date");
  return cashflow.Cashflow?.Cashflow_State === "FAILED" && isAfterVD;
};

const canSuppress = () =>
  hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress");

// swift suppression
const isSwiftSuppressionMaker = (cashflow: CNCashflow) =>
  canSuppress() &&
  ((swiftSuppressionAvailableState.includes(
    cashflow.Cashflow?.Cashflow_State as string
  ) &&
    !SuppressingSubStateTypes.includes(
      cashflow.Cashflow?.Cashflow_Sub_State_Type as SubStateType
    )) ||
    isSuppressionForFailed(cashflow));
const isSwiftSuppressionCheker = (cashflow: CNCashflow) =>
  canSuppress() &&
  cashflow.Cashflow?.Cashflow_State === "WAITING" &&
  cashflow.Cashflow?.Cashflow_Sub_State_Type === "Swift Suppression" &&
  cashflow.Cashflow.Cashflow_Sub_State === "Pending Verification";
// swift undo suppression
const isUndoSwiftSuppressionMaker = (cashflow: CNCashflow) =>
  canSuppress() && cashflow.Cashflow?.Cashflow_State === "SWIFT_SUPPRESSED";
const isUndoSwiftSuppressionCheker = (cashflow: CNCashflow) =>
  canSuppress() &&
  cashflow.Cashflow?.Cashflow_State === "WAITING" &&
  cashflow.Cashflow.Cashflow_Sub_State_Type === "Undo Swift Suppression" &&
  cashflow.Cashflow.Cashflow_Sub_State === "Pending Verification";

// cashflow suppresion
const isCashflowSuppressionMaker = isSwiftSuppressionMaker;
const isCashflowSuppressionCheker = (cashflow: CNCashflow) =>
  canSuppress() &&
  cashflow.Cashflow?.Cashflow_State === "WAITING" &&
  cashflow.Cashflow?.Cashflow_Sub_State_Type === "Cashflow Suppression" &&
  cashflow.Cashflow.Cashflow_Sub_State === "Pending Verification";
// cashflow un-suppression
const isCashflowUnSuppressionMaker = (cashflow: CNCashflow) =>
  canSuppress() && cashflow.Cashflow?.Cashflow_State === "CASHFLOW_SUPPRESSED";
const isCashflowUnSuppressionCheker = (cashflow: CNCashflow) =>
  canSuppress() &&
  cashflow.Cashflow?.Cashflow_State === "WAITING" &&
  cashflow.Cashflow.Cashflow_Sub_State_Type === "Undo Cashflow Suppression" &&
  cashflow.Cashflow.Cashflow_Sub_State === "Pending Verification";

const actionMapping = (cashflow: CNCashflow): ActionType[] => {
  const actions: ActionType[] = [];
  if (isSwiftSuppressionMaker(cashflow)) actions.push("SwiftSuppressionMaker");
  if (isSwiftSuppressionCheker(cashflow))
    actions.push("SwiftSuppressionChecker");
  if (isUndoSwiftSuppressionMaker(cashflow))
    actions.push("UndoSwiftSuppressionMaker");
  if (isUndoSwiftSuppressionCheker(cashflow))
    actions.push("UndoSwiftSuppressionChecker");
  if (isCashflowSuppressionMaker(cashflow))
    actions.push("CashflowSuppressionMaker");
  if (isCashflowSuppressionCheker(cashflow))
    actions.push("CashflowSuppressionChecker");
  if (isCashflowUnSuppressionMaker(cashflow))
    actions.push("CashflowUnSuppressionMaker");
  if (isCashflowUnSuppressionCheker(cashflow))
    actions.push("CashflowUnSuppressionChecker");
  return actions;
};

export const actionNameMapping = (action: ActionType) => {
  switch (action) {
    case "SwiftSuppressionMaker":
      return "Swift Suppression";

    case "SwiftSuppressionChecker":
      return "Verify Swift Suppression";

    case "UndoSwiftSuppressionMaker":
      return "Undo Swift Suppression";

    case "UndoSwiftSuppressionChecker":
      return "Verify Undo Swift Suppression";

    case "CashflowSuppressionMaker":
      return "Suppress Cashflow";

    case "CashflowSuppressionChecker":
      return "Confirm Suppression";

    case "CashflowUnSuppressionMaker":
      return "Un-Suppress Cashflow";

    case "CashflowUnSuppressionChecker":
      return "Confirm Un-Suppression";

    default:
      return "";
  }
};
export const isChecker = (actions: ActionType[]) => {
  if (actions.length) {
    return actions.every((i) =>
      (
        [
          "UndoSwiftSuppressionChecker",
          "SwiftSuppressionChecker",
          "CashflowUnSuppressionChecker",
          "CashflowSuppressionChecker",
        ] as ActionType[]
      ).includes(i)
    );
  }
  return false;
};

const isSubmitByYou = (data: CNCashflow) => {
  const user = getUser();
  return data.Cashflow?.Cashflow_Sub_State_Updater === user.id;
};

export const checkRightMenuActionValidate = (datas: CNCashflow[]) => {
  const makerChecker = datas.filter(
    (d) => isSubmitByYou(d) && isChecker(actionMapping(d))
  );
  return {
    disabled: !!makerChecker.length,
    ...(!!makerChecker.length && {
      tooltip: `For Cashflow ${makerChecker
        .map((i) => i.Cashflow?.Cashflow_Id)
        .join(", ")}, Maker and checker cannot be the same account`,
    }),
  };
};

export const swiftSuppressRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow>[] => {
  const hoverRow: CNCashflow = param.node?.data;
  let selectedRows = param.api?.getSelectedRows() as CNCashflow[];
  if (selectedRows.length === 0) selectedRows = [hoverRow];
  const allActions = selectedRows.reduce<string[]>((res, cur) => {
    const a = actionMapping(cur);
    res.push(a.join(","));
    return res;
  }, []);
  if (new Set(allActions).size === 1 && allActions[0]) {
    const actions = allActions[0].split(",") as ActionType[];
    let actionNames = actions.map((v) => ({
      action: v,
      name: actionNameMapping(v),
      ...checkRightMenuActionValidate(selectedRows),
    }));
    const { dispatch } = options;
    return actionNames.map((action) => ({
      ...action,
      action: () => {
        dispatch(
          suppressWorkflowAction({
            isOpenDialog: true,
            action: action.action,
            data: selectedRows,
          })
        );
      },
    }));
  }
  return [];
};

export const SwiftSuppressWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenDialog, data, action } = useSelector(
    (state: RootState) => state.suppressWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();

  const onClose = (isRefresh: boolean) => {
    dispatch(
      suppressWorkflowAction({
        isOpenDialog: false,
        action: undefined,
        data: undefined,
      })
    );
    isRefresh &&
      dispatch(updateCashflow(data!.map((d) => d.Cashflow!.Cashflow_Id!)));
  };

  const requestGenerator = useCallback(
    (isReject?: boolean) => {
      let request;
      let submit: SubmitAction = "ManualSuppress";
      const ischecker = isChecker([action as ActionType]);
      if (ischecker) {
        //SwiftSuppressionChecker/UndoSwiftSuppressionChecker
        request = cashflowSwiftSuppressionCheckerAction;
        if (isReject) {
          submit = "Reject";
        } else {
          submit = "Approve";
        }
      } else {
        request = cashflowSwiftSuppressionMakerAction;
        switch (action) {
          case "SwiftSuppressionMaker":
            submit = "ManualSwiftSuppress";
            break;

          case "UndoSwiftSuppressionMaker":
            submit = "ManualSwiftUnSuppress";
            break;

          case "CashflowUnSuppressionMaker":
            submit = "ManualUnSuppress";
            break;

          case "CashflowSuppressionMaker":
          default:
            break;
        }
      }

      return {
        request,
        submit,
      };
    },
    [data, action]
  );

  const onSubmit = async (comment: string, isReject?: boolean) => {
    const { request, submit } = requestGenerator(isReject);
    const payload: CashflowSwiftSuppressionRequest = {
      action: submit,
      comment,
      cashflows: data!.map((d) => ({
        cashflowId: d.Cashflow?.Cashflow_Id!,
        businessVersion: d.Cashflow?.Cashflow_Business_Version! + "",
        cashflowVersion: d.Cashflow?.Cashflow_Version! + "",
        minorVersion: d.Cashflow?.Cashflow_Minor_Version! + "",
      })),
    };
    await (request as CashflowSwiftSuppressionApi)(payload);
    messageApi.success("Submit Success !");
    dispatch(aggridDeselectAll());
    return true;
  };
  return (
    <>
      {isOpenDialog && (
        <CommonCommentAction
          open={isOpenDialog}
          title={actionNameMapping(action as ActionType)}
          submitText={isChecker([action as ActionType]) ? "Approve" : "Submit"}
          onSubmit={(c) => onSubmit(c)}
          onReject={
            isChecker([action as ActionType])
              ? (c) => onSubmit(c, true)
              : undefined
          }
          onClose={onClose}
          testId={plattenStr(actionNameMapping(action as ActionType))}
          height={
            ["CashflowSuppressionMaker", "CashflowSuppressionChecker"].includes(
              action + ""
            )
              ? "360px"
              : undefined
          }
        >
          {["CashflowSuppressionMaker", "CashflowSuppressionChecker"].includes(
            action + ""
          ) && (
            <StyledAlert
              message="No Payment and No Settlement Accounting will be generated. Do you still want to proceed ?"
              type="error"
              style={{
                marginBottom: 10,
              }}
            />
          )}
        </CommonCommentAction>
      )}
      {messageContextHolder}
    </>
  );
};

export const StyledAlert = styled(Alert)(
  ({ theme }) => css`
    background-color: ${theme.palette.mode === "dark" ? "#ad3a3c" : "#f54e51"};
    color: #fff;
  `
);
