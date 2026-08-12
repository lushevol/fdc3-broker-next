import InfoIcon from "@mui/icons-material/Info";
import { IconButton, Tooltip } from "@mui/material";
import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { message } from "antd";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonCommentActionDialog from "src/Cashflow_CN/components/CommonCommentAction";
import {
  aggridDeselectAll,
  holdWorkflowAction,
  updateCashflow,
} from "src/Cashflow_CN/Main/store/actions";
import { get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_ALL_CF_IDS_BTN } from "src/Root/analysis/const";
import { getUser, hasPermission, isEmpty } from "src/Root/import/ratanutils";

import {
  CashflowState,
  WorkflowActionExtraOptions,
} from "../../common/interface";
import { RootState } from "../../store/interface";
import { AlertWrapper } from "./CustomAlertWrapper";
import { useHoldSubmit } from "./useHoldSubmit";

const holdAvailableState = [CashflowState.WAITING, CashflowState.READY];

export enum HoldActionName {
  HOLD = "Hold",
  UNHOLD = "UnHold",
  SEND_TO_WAITING = "Send to WAITING",
}

export enum HoldMenuName {
  HOLD = "Hold",
  UNHOLD = "Unhold",
  SEND_TO_WAITING = "Send to WAITING",
}

type CashflowSateDTO = string | null | undefined | CashflowState;

const holdCashflow = (
  data: CNCashflow[],
  options: WorkflowActionExtraOptions,
  action: string
) => {
  const { dispatch } = options;
  dispatch(holdWorkflowAction({ isOpenHold: true, data, action }));
};

const hasHoldPermission = () =>
  hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Hold");

const hasUnHoldPermission = () =>
  hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Un_Hold");

const isHoldByYou = (cashflow: CNCashflow) => {
  const { id } = getUser();
  return id === cashflow?.Cashflow?.Cashflow_Sub_State_Updater;
};

export const HoldTestId = (str: string) => {
  return str.replace(/ /g, "_");
};

const getSendToWaitingMenu = (
  selectedRows: CNCashflow[],
  options: WorkflowActionExtraOptions
) => {
  return [
    {
      name: HoldMenuName.SEND_TO_WAITING,
      action: () =>
        holdCashflow(selectedRows, options, HoldActionName.SEND_TO_WAITING),
    },
  ];
};

const getUnholdMenu = (
  selectedRows: CNCashflow[],
  options: WorkflowActionExtraOptions
) => {
  const holdByYou = selectedRows.filter((i) => isHoldByYou(i));
  return [
    {
      name: HoldMenuName.UNHOLD,
      disabled: !!holdByYou.length,
      tooltip: holdByYou.length
        ? `cashflow (${holdByYou
            .map((i) => i.Cashflow?.Cashflow_Id)
            .join(", ")}) held by you`
        : "Unhold action will send cashflow to previous status(QUEUED/WAITING/READY)",
      action: () => holdCashflow(selectedRows, options, HoldActionName.UNHOLD),
    },
  ];
};

const isCashflowState = (value: any): value is CashflowState => {
  return Object.values(CashflowState).includes(value);
};

const isHoldState = (value: CashflowSateDTO): boolean => {
  if (isEmpty(value)) return false;
  if (!isCashflowState(value)) return false;
  return holdAvailableState.includes(value);
};

export const holdRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow>[] => {
  if (!param) return [];
  let selectedRows: CNCashflow[] = param.api?.getSelectedRows() ?? [];
  const data = param.node?.data as CNCashflow;
  if (hasHoldPermission()) {
    if (selectedRows.length === 0) selectedRows = [data];
    if (
      selectedRows.every((row) => isHoldState(row.Cashflow?.Cashflow_State))
    ) {
      return [
        {
          name: HoldMenuName.HOLD,
          action: () => {
            holdCashflow(selectedRows, options, HoldActionName.HOLD);
          },
        },
      ];
    } else {
      const allHold = selectedRows.every(
        (row) => row.Cashflow!.Cashflow_State === CashflowState.HOLD
      );
      const menu: any[] = [];
      if (allHold) {
        menu.push(...getSendToWaitingMenu(selectedRows, options));
        if (hasUnHoldPermission()) {
          menu.push(...getUnholdMenu(selectedRows, options));
        }
      }
      return menu;
    }
  }
  return [];
};

export const HoldWrap: FC = () => {
  const dispatch = useDispatch<any>();
  const { isOpenHold, data, action } = useSelector(
    (state: RootState) => state.holdWorkflow
  );
  const [messageApi, messageContextHolder] = message.useMessage();
  const { handleSubmit } = useHoldSubmit(data, action, messageApi);

  const onClose = (isRefresh: boolean) => {
    dispatch(holdWorkflowAction({ isOpenHold: false, data: null }));
    // @ts-ignore
    if (isRefresh) {
      dispatch(updateCashflow(data.map((i) => i.Cashflow.Cashflow_Id)));
      dispatch(aggridDeselectAll());
    }
  };

  const onSubmit = async (comments: string) => {
    try {
      const resp = await handleSubmit(comments);
      return resp;
    } catch (error: any) {
      messageApi.error(
        error?.response?.data?.errorMessage || error?.message || "action failed"
      );
    }
    return false;
  };

  const generateWarning = () => {
    switch (action) {
      case HoldActionName.UNHOLD: {
        return (
          <AlertWrapper
            message="Warning: Unhold action can auto release payment to downstream"
            type="error"
          />
        );
      }

      case HoldActionName.SEND_TO_WAITING: {
        return (
          <AlertWrapper
            message="Warning: This action will send the cashflow to WAITING status for further manual action"
            type="info"
          />
        );
      }

      default:
        return <></>;
    }
  };

  return (
    <>
      {isOpenHold ? (
        <CommonCommentActionDialog
          open={isOpenHold}
          title={
            <div>
              <span>
                <span>
                  {action}
                  {action === HoldActionName.UNHOLD && (
                    <Tooltip
                      title={
                        "Unhold action will send cashflow to previous status(QUEUED/WAITING/READY)"
                      }
                      placement="top"
                    >
                      <IconButton data-testid={`${action}_description_icon`}>
                        <InfoIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </span>
                {(data?.length || 0) > 1 && (
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
                          action
                        )}
                      >
                        <InfoIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Tooltip>
                  </span>
                )}
              </span>
            </div>
          }
          onSubmit={onSubmit}
          onClose={onClose}
          testId={HoldTestId(action)}
          height={action === HoldActionName.HOLD ? undefined : "360px"}
          customWarning={generateWarning()}
        />
      ) : (
        <></>
      )}
      {messageContextHolder}
    </>
  );
};
