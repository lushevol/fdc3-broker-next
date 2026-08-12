import { Stack, Tooltip } from "@mui/material";
import { Checkbox, Popconfirm } from "antd";
import { LoadingButton } from "Import/index";
import uniqBy from "lodash/uniqBy";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import {
  MULTI_EXCEPTION_APPROVE_BTN,
  MULTI_EXCEPTION_REJECT_BTN,
  MULTI_EXCEPTION_REJECT_MULTI_BTN,
  MULTI_EXCEPTION_SUBMIT_BTN,
} from "src/Root/analysis/const";

import { Checker, Maker } from "../../common/interface";
import { matchException } from "../../common/utils";
import { AdhocingContext } from "../../hooks/useController";
import { ExceptionActionsProps } from "./interface";
import StyledRoot, { classes } from "./style";

export const RejectBtns = ({
  RejectOptions,
  wrapAction,
  onSubmit,
  setRejectExceptions,
  rejectExceptions,
  allActionBtnsLoading,
  isSubmitByYou,
  hasHighRiskExceptionsButNoPermission,
  handleRejectOptionSelect,
}: {
  RejectOptions: {
    label: string;
    value: string;
  }[];
  wrapAction: (
    callback: (b: boolean, p?: any) => Promise<boolean>,
    isSubmit: boolean,
    payload?: any
  ) => () => Promise<void>;
  onSubmit: (t: boolean, payload?: any) => Promise<boolean>;
  setRejectExceptions: React.Dispatch<React.SetStateAction<string[]>>;
  rejectExceptions: string[];
  allActionBtnsLoading: boolean;
  isSubmitByYou: boolean;
  hasHighRiskExceptionsButNoPermission: boolean;
  handleRejectOptionSelect: (selectedOptions: any) => void;
}) => {
  switch (RejectOptions.length) {
    case 0:
      return <div></div>;

    case 1:
      return (
        <LoadingButton
          color="error"
          loading={allActionBtnsLoading}
          disabled={isSubmitByYou || hasHighRiskExceptionsButNoPermission}
          onClick={wrapAction(onSubmit, false, [])}
          variant="outlined"
          size="medium"
          loadingSize={10}
          data-testid={MULTI_EXCEPTION_REJECT_BTN}
        >
          Reject {RejectOptions[0].label}
        </LoadingButton>
      );

    default:
      return (
        <Popconfirm
          placement="bottomRight"
          title="Reject Exceptions"
          onOpenChange={(isShow) => !isShow && setRejectExceptions([])}
          description={
            <Checkbox.Group
              options={RejectOptions}
              value={rejectExceptions}
              onChange={handleRejectOptionSelect}
            />
          }
          overlayInnerStyle={{
            width: "250px",
          }}
          disabled={isSubmitByYou || hasHighRiskExceptionsButNoPermission}
          onConfirm={wrapAction(onSubmit, false, rejectExceptions)}
          okText="Submit Rejection"
          okType="primary"
          okButtonProps={{
            danger: true,
            disabled: !rejectExceptions.length,
          }}
          cancelText="Cancel"
          cancelButtonProps={{
            type: "text",
          }}
        >
          <LoadingButton
            color="error"
            loading={allActionBtnsLoading}
            disabled={isSubmitByYou || hasHighRiskExceptionsButNoPermission}
            variant="outlined"
            size="medium"
            loadingSize={10}
            data-testid={MULTI_EXCEPTION_REJECT_MULTI_BTN}
          >
            Reject
          </LoadingButton>
        </Popconfirm>
      );
  }
};

const ExceptionActions: FC<ExceptionActionsProps> = ({
  userRole,
  isSubmitByYou,
  onSubmit,
  disableAllActions,
  exceptionsWithRejectAction,
  hasHighRiskExceptionsButNoPermission,
  hasAuthLimitNotSufficient,
}) => {
  const [allActionBtnsLoading, setAllActionBtnsLoading] = useState(false);
  const [rejectExceptions, setRejectExceptions] = useState<string[]>([]);
  const adhocing = useContext(AdhocingContext);
  const handleRejectOptionSelect = useCallback((selectedOptions) => {
    setRejectExceptions(selectedOptions);
  }, []);
  const wrapAction = useCallback(
    (
      callback: (b: boolean, p?: any) => Promise<boolean>,
      isSubmit: boolean,
      payload?: any
    ) => {
      return async () => {
        try {
          setAllActionBtnsLoading(true);
          const res = await callback(isSubmit, payload);
          res && adhocing.setIsAdhocing(false);
          setRejectExceptions([]);
        } catch (error) {
          console.error(error);
        } finally {
          setAllActionBtnsLoading(false);
        }
      };
    },
    []
  );
  const RejectOptions = useMemo(() => {
    return uniqBy(
      exceptionsWithRejectAction.map((e) => ({
        label: e.Exception_Category,
        value: matchException(e),
      })),
      "value"
    ) as { label: string; value: string }[];
  }, [exceptionsWithRejectAction]);

  const approveTips = hasAuthLimitNotSufficient
    ? "The Cashflow amount is above your Authorization Limit"
    : null;

  return (
    <StyledRoot className={classes.root}>
      {!disableAllActions &&
        (Maker === userRole || adhocing.isAdhocing ? (
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <LoadingButton
              loading={allActionBtnsLoading}
              onClick={wrapAction(onSubmit, true)}
              data-testid={MULTI_EXCEPTION_SUBMIT_BTN}
              disabled={hasHighRiskExceptionsButNoPermission}
              variant="contained"
              size="medium"
              loadingSize={10}
            >
              Submit
            </LoadingButton>
          </Stack>
        ) : (
          userRole === Checker && (
            <Stack direction="row" justifyContent="space-between">
              <RejectBtns
                RejectOptions={RejectOptions}
                wrapAction={wrapAction}
                onSubmit={onSubmit}
                setRejectExceptions={setRejectExceptions}
                rejectExceptions={rejectExceptions}
                allActionBtnsLoading={allActionBtnsLoading}
                isSubmitByYou={isSubmitByYou}
                hasHighRiskExceptionsButNoPermission={
                  hasHighRiskExceptionsButNoPermission
                }
                handleRejectOptionSelect={handleRejectOptionSelect}
              />
              <Tooltip title={approveTips} placement="top-start">
                <span>
                  <LoadingButton
                    loading={allActionBtnsLoading}
                    onClick={wrapAction(onSubmit, true)}
                    disabled={
                      isSubmitByYou ||
                      hasHighRiskExceptionsButNoPermission ||
                      hasAuthLimitNotSufficient
                    }
                    data-testid={MULTI_EXCEPTION_APPROVE_BTN}
                    variant="contained"
                    size="medium"
                    loadingSize={10}
                    color="success"
                  >
                    Approve
                  </LoadingButton>
                </span>
              </Tooltip>
            </Stack>
          )
        ))}
    </StyledRoot>
  );
};

export default ExceptionActions;
