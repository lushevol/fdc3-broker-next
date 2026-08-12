import InfoIcon from "@mui/icons-material/Info";
import { IconButton, Tooltip } from "@mui/material";
import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import dayjs from "dayjs";
import { getUser, hasPermission, isEmpty } from "Import/ratanutils";
import { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import CommonCommentAction from "src/Cashflow_CN/components/CommonCommentAction";
import { get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_ALL_CF_IDS_BTN } from "src/Root/analysis/const";

import { cashflowBulkFail } from "../../../services";
import {
  CashflowState,
  WorkflowActionExtraOptions,
} from "../../common/interface";
import {
  aggridDeselectAll,
  commonCommentActionWorkflowAction,
  updateCashflow,
} from "../../store/actions";
import { RootState } from "../../store/interface";
import {
  ActionType,
  CashflowFailedRequest,
  CashflowFailedResponse,
  SubmitAction,
} from "./interface";

const MAX_FAIL_COUNT = 1000;

const failedAvailableState = [
  CashflowState.QUEUED,
  CashflowState.WAITING,
  CashflowState.READY,
];
const suppressionState = [
  CashflowState.SWIFT_SUPPRESSED,
  CashflowState.CASHFLOW_SUPPRESSED,
];

/**
 * To check if value is belong to CashflowState type.
 */
const isCashflowStateCategory = (value: any): value is CashflowState => {
  return Object.values(CashflowState).includes(value);
};

type CashflowStateDTO = string | null | undefined | CashflowState;
export const isSuppressionState = (cat: CashflowStateDTO): boolean => {
  if (isEmpty(cat)) return false;
  if (!isCashflowStateCategory(cat)) return false;
  return suppressionState.includes(cat);
};

export const isFailedAvailableState = (cat: CashflowStateDTO): boolean => {
  if (isEmpty(cat)) return false;
  if (!isCashflowStateCategory(cat)) return false;
  return failedAvailableState.includes(cat);
};

const cashflowCanBeFailedInSuppression = (cashflow: CNCashflow) => {
  return (
    isSuppressionState(cashflow.Cashflow?.Cashflow_State) &&
    dayjs().isAfter(dayjs(cashflow.Cashflow?.Payment_Date), "day")
  );
};

const cashflowCanBeFailed = (cashflow: CNCashflow) => {
  return (
    isFailedAvailableState(cashflow.Cashflow?.Cashflow_State) ||
    cashflowCanBeFailedInSuppression(cashflow)
  );
};

export const actionNameMapping = (action: ActionType | undefined) => {
  switch (action) {
    case "Failed":
      return "Manual Fail";

    case "ConfirmFailed":
      return "Confirm Manual Fail";

    default:
      return null;
  }
};

export const isChecker = (actions: ActionType[]) => {
  if (actions.length) {
    return actions.every((i) =>
      (["ConfirmFailed"] as ActionType[]).includes(i)
    );
  }
  return false;
};

const isSubmitByYou = (data: CNCashflow) => {
  const user = getUser();
  return data.Cashflow?.Cashflow_Sub_State_Updater === user?.id;
};

const isManualFailMaker = (cashflow: CNCashflow): boolean =>
  hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Fail") &&
  cashflowCanBeFailed(cashflow) &&
  cashflow.Cashflow?.Cashflow_Sub_State_Type !== "Pending Manual Fail";

const isManualFailCheker = (cashflow: CNCashflow) =>
  hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Fail") &&
  cashflow.Cashflow?.Cashflow_Sub_State_Type === "Pending Manual Fail" &&
  cashflow.Cashflow.Cashflow_Sub_State === "Pending Verification";

const actionMapping = (cashflow: CNCashflow): ActionType[] => {
  const actions: ActionType[] = [];
  if (isManualFailMaker(cashflow)) actions.push("Failed");
  if (isManualFailCheker(cashflow)) actions.push("ConfirmFailed");
  return actions;
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

export const onClickAction = (
  selectedRows: CNCashflow[],
  menuName: string,
  actions: ActionType[],
  dispatch: Dispatch,
  messageApi: MessageInstance
) => {
  if (selectedRows.length > MAX_FAIL_COUNT) {
    messageApi.error(
      `You can select up to ${MAX_FAIL_COUNT} cashflows to perform ${menuName} action.`
    );
    return;
  }
  dispatch(
    commonCommentActionWorkflowAction({
      isOpenDialog: true,
      action: actions[0],
      data: selectedRows,
    })
  );
};

export const failedRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  const hoverRow: CNCashflow = param.node?.data;
  let selectedRows: CNCashflow[] = param.api?.getSelectedRows() ?? [];

  if (selectedRows.length === 0) selectedRows = [hoverRow];
  const allActions = selectedRows.reduce<string[]>((res, cur) => {
    const a = actionMapping(cur);
    res.push(a.join(","));
    return res;
  }, []);
  if (new Set(allActions).size === 1 && allActions[0]) {
    const actions = allActions[0].split(",") as ActionType[];
    const { dispatch, messageApi } = options;

    const menuName = actionNameMapping(actions[0]);
    return (
      menuName && {
        name: menuName,
        ...checkRightMenuActionValidate(selectedRows),
        action: () =>
          onClickAction(selectedRows, menuName, actions, dispatch, messageApi),
      }
    );
  }
  return null;
};

export const FailedWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenDialog, data, action } = useSelector(
    (state: RootState) => state.commonCommentActionWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();

  const onClose = (isRefresh: boolean) => {
    dispatch(
      commonCommentActionWorkflowAction({
        isOpenDialog: false,
        data: undefined,
        action: undefined,
      })
    );
    if (isRefresh) {
      dispatch(updateCashflow(data!.map((d) => d.Cashflow!.Cashflow_Id!)));
      dispatch(aggridDeselectAll());
    }
  };

  type RequestFunction = (
    payload: CashflowFailedRequest
  ) => Promise<CashflowFailedResponse>;

  const requestGenerator = useCallback(
    (
      isReject?: boolean
    ): { request: RequestFunction; submit: SubmitAction } => {
      const request = cashflowBulkFail;
      let submit: SubmitAction = "Fail";
      const ischecker = isChecker([action as ActionType]);
      if (ischecker) {
        if (isReject) {
          submit = "Reject";
        } else {
          submit = "Approve";
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

    const payload: CashflowFailedRequest = {
      action: submit,
      comment,
      cashflows: data!.map((d) => ({
        cashflowId: d.Cashflow?.Cashflow_Id!,
        businessVersion: d.Cashflow?.Cashflow_Business_Version! + "",
        cashflowVersion: d.Cashflow?.Cashflow_Version! + "",
        minorVersion: d.Cashflow?.Cashflow_Minor_Version! + "",
      })),
    };

    try {
      const resp = await request(payload);
      if (resp?.status === 200) {
        messageApi.success("Submit Success!");
        dispatch(aggridDeselectAll());
        return true;
      } else {
        messageApi.error(resp?.errorMessage ?? "Submit Failed");
        return false;
      }
    } catch (error: any) {
      messageApi.error(
        error?.response?.data?.errorMessage || error?.message || "Submit Failed"
      );
      return false;
    }
  };
  return (
    <>
      {isOpenDialog ? (
        <CommonCommentAction
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
                        "manual_fail"
                      )}
                    >
                      <InfoIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Tooltip>
                </span>
              )}
            </span>
          }
          submitText={isChecker([action as ActionType]) ? "Approve" : "Submit"}
          onSubmit={onSubmit}
          onReject={
            isChecker([action as ActionType])
              ? (c) => onSubmit(c, true)
              : undefined
          }
          onClose={onClose}
          testId="manual_fail"
        />
      ) : (
        <></>
      )}
      {messageContextHolder}
    </>
  );
};
