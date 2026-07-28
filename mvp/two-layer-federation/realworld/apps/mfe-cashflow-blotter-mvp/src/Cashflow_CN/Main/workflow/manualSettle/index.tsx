import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { message } from "antd";
import { getUser, hasPermission } from "Import/ratanutils";
import { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonCommentAction from "src/Cashflow_CN/components/CommonCommentAction";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";

import { postSettleChecker, postSettleMaker } from "../../../services";
import { WorkflowActionExtraOptions } from "../../common/interface";
import {
  aggridDeselectAll,
  manualSettleWorkflowAction,
  updateCashflow,
} from "../../store/actions";
import { RootState } from "../../store/interface";
import { settlableSwiftStatusList } from "./const";
import {
  AllPossibleSettleUserType,
  ManualSettleApi,
  ManualSettleApiRequestBody,
  SettleUserType,
  SubmitAction,
} from "./interface";

const hasManualSettlePermission = () =>
  hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release"
  );

// swift suppression
const isManualSettleMaker = (cashflow: CNCashflow) =>
  hasManualSettlePermission() &&
  cashflow.Cashflow?.Cashflow_State === "RELEASED" &&
  settlableSwiftStatusList.includes(
    cashflow.Cashflow?.Cashflow_Swift_Status + ""
  );

const isManualSettleCheker = (cashflow: CNCashflow) =>
  hasManualSettlePermission() &&
  cashflow.Cashflow?.Cashflow_State === "RELEASED" &&
  cashflow.Cashflow?.Cashflow_Sub_State_Type === "Manual Settle" &&
  cashflow.Cashflow?.Cashflow_Sub_State === "Pending Verification";

const actionMapping = (cashflow: CNCashflow): AllPossibleSettleUserType => {
  if (isManualSettleCheker(cashflow)) return SettleUserType.Checker;
  if (isManualSettleMaker(cashflow)) return SettleUserType.Maker;
  return "Visitor";
};

const actionNameMapping = (role: AllPossibleSettleUserType) => {
  switch (role) {
    case SettleUserType.Checker:
      return "Verify Settle";

    case SettleUserType.Maker:
      return "Manual Settle";

    default:
      return "";
  }
};

const isSubmitByYou = (data: CNCashflow) => {
  const user = getUser();
  return data.Cashflow?.Cashflow_Sub_State_Updater === user.id;
};

const checkRightMenuActionValidate = (datas: CNCashflow[]) => {
  const makerChecker = datas.filter(
    (d) => isSubmitByYou(d) && actionMapping(d) === SettleUserType.Checker
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

export const manualSettleRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  if (!featureScopedEnabled("Manual_Settle")) return null;
  const hoverRow: CNCashflow = param.node?.data;
  let selectedRows = param.api?.getSelectedRows() as CNCashflow[];
  if (selectedRows.length === 0) selectedRows = [hoverRow];
  const allRoles = selectedRows.reduce<AllPossibleSettleUserType[]>(
    (res, cur) => {
      const a = actionMapping(cur);
      res.push(a);
      return res;
    },
    []
  );
  if (new Set(allRoles).size === 1 && allRoles[0] !== "Visitor") {
    const role = allRoles[0];
    const { dispatch } = options;
    return {
      name: actionNameMapping(role),
      ...checkRightMenuActionValidate(selectedRows),
      action: () => {
        dispatch(
          manualSettleWorkflowAction({
            isOpenDialog: true,
            data: selectedRows,
            role: role as SettleUserType,
          })
        );
      },
    };
  }
  return null;
};

export const ManualSettleWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenDialog, data, role } = useSelector(
    (state: RootState) => state.manualSettleWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();

  const onClose = (isRefresh: boolean) => {
    dispatch(
      manualSettleWorkflowAction({
        isOpenDialog: false,
        data: [],
        role: SettleUserType.Maker,
      })
    );
    isRefresh &&
      dispatch(updateCashflow(data.map((d) => d.Cashflow!.Cashflow_Id!)));
  };

  const requestGenerator = useCallback(
    (isReject?: boolean) => {
      let request;
      let submit: SubmitAction = "ManualSettle";
      const ischecker = role === SettleUserType.Checker;
      if (ischecker) {
        request = postSettleChecker;
        if (isReject) {
          submit = "Reject";
        } else {
          submit = "Approve";
        }
      } else {
        request = postSettleMaker;
      }

      return {
        request,
        submit,
      };
    },
    [data, role]
  );

  const onSubmit = async (comment: string, isReject?: boolean) => {
    const { request, submit } = requestGenerator(isReject);
    const payload: ManualSettleApiRequestBody = {
      action: submit,
      comment,
      cashflows: data.map((d) => ({
        cashflowId: d.Cashflow?.Cashflow_Id + "",
        businessVersion: d.Cashflow?.Cashflow_Business_Version + "",
        cashflowVersion: d.Cashflow?.Cashflow_Version + "",
        minorVersion: d.Cashflow?.Cashflow_Minor_Version + "",
        swiftStatus: d.Cashflow?.Cashflow_Swift_Status + "",
      })),
    };
    await (request as ManualSettleApi)(payload);
    messageApi.success("Submit Success !");
    dispatch(aggridDeselectAll());
    return true;
  };
  return (
    <>
      {isOpenDialog && (
        <CommonCommentAction
          open={isOpenDialog}
          title={actionNameMapping(role)}
          submitText={role === SettleUserType.Checker ? "Approve" : "Submit"}
          onSubmit={(c) => onSubmit(c)}
          onReject={
            role === SettleUserType.Checker
              ? (c) => onSubmit(c, true)
              : undefined
          }
          onClose={onClose}
          testId="manual_settle"
        ></CommonCommentAction>
      )}
      {messageContextHolder}
    </>
  );
};
