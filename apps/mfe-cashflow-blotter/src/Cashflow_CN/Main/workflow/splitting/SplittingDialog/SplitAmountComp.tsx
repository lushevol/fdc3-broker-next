import { DeleteOutlined } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DnsIcon from "@mui/icons-material/Dns";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingOutlineIcon from "@mui/icons-material/Pending";
import { Button, IconButton } from "@mui/material";
import { InputNumber, message, Tooltip } from "antd";
import { isEmpty } from "Import/ratanutils";
import { cloneDeep } from "lodash";
import isNumber from "lodash/isNumber";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

import { splitingCashflowAction } from "../../../store/actions";
import { InputStatusType, SplitActionType } from "../common/interface";
import {
  isSplitCashflowStateCategory,
  useSplittingAmountHandler,
} from "../common/SplitCashflowDialogUtils";
import { formatAndParseNumberByPrecision } from "../common/utils";
import { canAmendSplittingState } from "../SplittingCashflowRightMenu";

export const SplittingAmount: FC<any> = (props) => {
  const { handleAmountConfim, targetCashflows, precision } =
    useSplittingAmountHandler();
  const { splitAction } = useSelector(
    (state: RootState) => state.splittingWorkflow
  );
  const { validationArr } = useSelector(
    (state: RootState) => state.splittingValidation
  );
  const currentIndex = props?.node?.rowIndex;
  const isLast = props?.node?.lastChild;
  const currentRowDataAmount =
    targetCashflows?.[currentIndex]?.Cashflow?.Payment_Amount ?? 0;
  const [inputValue, setInputValue] = useState<any>(currentRowDataAmount);

  const currentValidation = validationArr.find(
    (item) =>
      item.cashflowId ===
        targetCashflows?.[currentIndex]?.Cashflow?.Cashflow_Id ||
      item.rowId === currentIndex
  );
  const currentStoreStatus = currentValidation?.inputStatus;
  const [inputStatus, setInputStatus] = useState<InputStatusType | undefined>(
    currentStoreStatus ?? InputStatusType.SUCCESS
  );
  const showNormalCompAction = [
    SplitActionType.COMPONENT_SPLIT,
    SplitActionType.UN_SPLIT,
  ];
  const isShowNormalComp = showNormalCompAction.includes(splitAction);

  const isEnableEiditable = () => {
    if (splitAction === SplitActionType.AMEND_SPLIT) {
      const state = targetCashflows?.[currentIndex]?.Cashflow?.Cashflow_State;
      return (
        state &&
        isSplitCashflowStateCategory(state) &&
        canAmendSplittingState.includes(state)
      );
    } else if (splitAction === SplitActionType.MANUAL_SPLIT) {
      return isLast;
    } else return false;
  };

  const handleInputNumberChange = (
    value: any,
    precision: number,
    setInputValue: (v: any) => void
  ) => {
    let formattedValue = cloneDeep(value);
    if (isNumber(value)) {
      formattedValue = formatAndParseNumberByPrecision(
        formattedValue,
        precision
      );
    }

    setInputValue(formattedValue);
    setInputStatus(InputStatusType.WAITING);
  };

  const confirmAmount = () => {
    setInputStatus(undefined);
    handleAmountConfim(Number(inputValue), currentIndex);
  };

  return isShowNormalComp ? (
    <div>{props?.value} </div>
  ) : (
    <div
      className={`splittingAmount_${currentIndex}`}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
      }}
    >
      <PreCheckComp
        currentStatus={inputStatus}
        cashflowId={
          targetCashflows?.[currentIndex]?.Cashflow?.Cashflow_Id ?? ""
        }
        currentRowId={currentIndex}
      />
      <InputNumber
        className={`value-amount-${currentIndex}`}
        size={"small"}
        placeholder="Input Amount"
        min={0.00000000000000001}
        disabled={!isEnableEiditable()}
        readOnly={splitAction === SplitActionType.COMPONENT_SPLIT}
        value={inputValue}
        style={{
          fontSize: "12px",
          width: "120px",
          height: "35px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "2px",
        }}
        onChange={(value) => {
          handleInputNumberChange(value, precision, setInputValue);
        }}
        onBlur={confirmAmount}
        onPressEnter={confirmAmount}
        status={inputStatus}
        precision={precision}
        data-testid={`splittingAmount_Input_${currentIndex}`}
      />
    </div>
  );
};

export const SplittingDeleteButton: FC<any> = (props) => {
  const { handleDeleteRow } = useSplittingAmountHandler();
  const currentIndex = props?.node?.rowIndex;
  const isLast = props?.node?.lastChild;
  const isDisable = !isLast || currentIndex === 0;
  const deleteColor = isDisable ? "disabled" : "error";

  return (
    <IconButton
      aria-label="delete"
      data-testid={`splittingDeleteButton_${currentIndex}`}
      onClick={(_e) => handleDeleteRow(currentIndex)}
      disabled={isDisable}
    >
      <DeleteOutlined color={deleteColor} />
    </IconButton>
  );
};

interface PreCheckCompProps {
  currentStatus: InputStatusType | undefined;
  cashflowId: string;
  currentRowId: number;
}
export const PreCheckComp: FC<PreCheckCompProps> = ({
  currentStatus,
  cashflowId,
  currentRowId,
}) => {
  const { validationArr } = useSelector(
    (state: RootState) => state.splittingValidation
  );
  const currentValidation = validationArr.find(
    (item) => item.cashflowId === cashflowId || item.rowId === currentRowId
  );
  const currentMessage = currentValidation?.prefixMessage;
  const status = currentStatus ?? currentValidation?.inputStatus;

  if (status === InputStatusType.WAITING) {
    return (
      <Tooltip title={currentMessage}>
        <PendingOutlineIcon
          fontSize="small"
          style={{ color: "var(--theme-status-color-orange)" }}
        />
      </Tooltip>
    );
  } else if (status === InputStatusType.SUCCESS) {
    return (
      <CheckCircleOutlineIcon
        fontSize="small"
        style={{ color: "var(--theme-status-color-status)" }}
      />
    );
  } else {
    return (
      <Tooltip title={currentMessage} defaultOpen={true}>
        <ErrorOutlineIcon
          fontSize="small"
          style={{ color: "var(--theme-status-color-red)" }}
        />
      </Tooltip>
    );
  }
};

export const SplittingLookUpSSIBtn: FC<any> = (props) => {
  const {
    isOpenLookUpSSIDialog,
    sourceCashflow,
    targetRowIndex,
    targetCashflows,
    ...rest
  } = useSelector((state: RootState) => state.splittingWorkflow);
  const dispatch = useDispatch();
  const currentIndex = props?.node?.rowIndex;
  const [messageApi, messageContext] = message.useMessage();
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  useEffect(() => {
    if (
      !isEmpty(currentIndex) &&
      Array.isArray(targetCashflows) &&
      targetCashflows[currentIndex]?.vostroAccount?.settlementMeans
    ) {
      setBackgroundColor("green");
    } else {
      setBackgroundColor("");
    }
  }, [currentIndex, targetCashflows]);

  const onClick = () => {
    if (
      !isEmpty(currentIndex) &&
      Array.isArray(targetCashflows) &&
      targetCashflows[currentIndex]
    ) {
      dispatch(
        splitingCashflowAction({
          isOpenLookUpSSIDialog: true,
          targetRowIndex: currentIndex,
          targetCashflows,
          sourceCashflow,
          ...rest,
        })
      );
    } else {
      messageApi.error("No data found!");
    }
  };
  return (
    <>
      <Button
        variant="contained"
        disabled={!sourceCashflow}
        startIcon={<DnsIcon />}
        onClick={onClick}
        style={{ backgroundColor: backgroundColor }}
        data-testid={`lookUpSSIBtn_${currentIndex}`}
      >
        Look Up SSI
      </Button>
      {messageContext}
    </>
  );
};
