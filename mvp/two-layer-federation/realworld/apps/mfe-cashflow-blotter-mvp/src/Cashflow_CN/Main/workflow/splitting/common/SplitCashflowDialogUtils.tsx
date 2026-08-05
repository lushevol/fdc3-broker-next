import { GridApi } from "ag-grid-community";
import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { deepClone } from "Import/ratanutils";
import cloneDeep from "lodash/cloneDeep";
import _get from "lodash/get";
import set from "lodash/set";
import sumBy from "lodash/sumBy";
import { useDispatch, useSelector } from "react-redux";
import { updateCashflow } from "src/Cashflow_CN/Main/store/actions";
import {
  splitingCashflowAction,
  splittingValidateCashflowAction,
} from "src/Cashflow_CN/Main/store/actions/workflowAction";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { api as ultraCashflowQuery } from "src/Cashflow_CN/schema/ultra-cashflow-query.generated";
import {
  LogicFilter,
  PagingOption,
  RatanUltraQuery,
} from "src/generated/types.generated";
import { getFieldListFromAggridApi } from "src/Root/common/utils/field-utils";

import {
  cashflowAmendSplit,
  cashflowManualSplit,
  cashflowUnSplit,
  getCurrencyRounding,
} from "../../../../services";
import { canAmendSplittingState } from "../SplittingCashflowRightMenu";
import {
  AmendSplitDataType,
  InputStatusType,
  ManualSplitDataType,
  SplitActionType,
  SplitCashflowState,
  SplitValidationArrItem,
  UnSplitDataType,
} from "./interface";
import {
  amountAMinusBNumber,
  amountAPlusBNumber,
  checkAmendSplit,
  checkDecimalPrecision,
  checkGreaterThanSource,
  checkIsZero,
  checkManualSplit,
  checkOtherValidation,
  formatAmountToStrByPrecision,
  isAmountAEqualB,
} from "./utils";

export function useSplittingAmountHandler() {
  const dispatch = useDispatch<any>();
  const {
    targetCashflows,
    sourceCashflow,
    amountSetting,
    splitAction,
    initialTargetCashflows,
  } = useSelector((state: RootState) => state.splittingWorkflow);
  const { message, validationArr } = useSelector(
    (state: RootState) => state.splittingValidation
  );
  const sourcePrecision: number = _get(amountSetting, "precision");
  let newCashflows = cloneDeep(targetCashflows);
  const sourceAmount: number = _get(sourceCashflow, "Cashflow.Payment_Amount")
    ? Number(_get(sourceCashflow, "Cashflow.Payment_Amount"))
    : 0;

  /**
   * 1. validate if input value is number
   * 2. cannot allow to input 0
   * 2. validate if input value is greater than source amount
   * 3. validate if input value precision is correct
   * 4. validate if total sum of all split amount is greater than source amount
   */

  /**
   * 1. value must less than sourceAmount reduece all other cannot amend split amount
   * 2. value must less than total of all other split amount
   * 3.generate and refresh validation for current input
   */

  const validateAmountInput = (value: number, rowIndex: number) => {
    const otherUnableSplitSum = amountAPlusBNumber(
      newCashflows?.filter(
        (cur) =>
          !canAmendSplittingState.includes(
            cur.Cashflow?.Cashflow_State as SplitCashflowState
          )
      ),
      (item) => item?.Cashflow?.Payment_Amount,
      sourcePrecision
    );

    const totalOtherSum = amountAPlusBNumber(
      newCashflows?.filter((_, idx) => idx !== rowIndex),
      (item) => item?.Cashflow?.Payment_Amount,
      sourcePrecision
    );

    const maxThreshold = amountAMinusBNumber(
      sourceAmount,
      otherUnableSplitSum,
      sourcePrecision
    );

    const validationMaxInput = amountAMinusBNumber(
      sourceAmount,
      totalOtherSum,
      sourcePrecision
    );

    const { newIsValid, newValidationArr } = validateSplitAmountInput({
      value,
      rowIndex,
      sourceValidationArr: validationArr,
      sourceAmount,
      sourcePrecision,
      splitAction,
      maxThreshold,
      validationMaxInput,
    });

    dispatch(
      splittingValidateCashflowAction({
        isValid: newIsValid,
        message,
        validationArr: newValidationArr,
      })
    );
  };

  const getCurrentlyAvaliableAmount = (value: number, rowIndex: number) => {
    const otherSum = amountAPlusBNumber(
      newCashflows?.filter((_, idx) => idx !== rowIndex),
      (item) => item?.Cashflow?.Payment_Amount,
      sourcePrecision
    );
    const allAvaliableExceptCurrent = amountAMinusBNumber(
      sourceAmount,
      otherSum,
      sourcePrecision
    );
    const currentlyAvaliableAmount = amountAMinusBNumber(
      Number(allAvaliableExceptCurrent),
      value,
      sourcePrecision
    );

    return currentlyAvaliableAmount;
  };

  const generateOnChangePrefix = (value: number, rowIndex: number) => {
    const currentAvaliable = getCurrentlyAvaliableAmount(value, rowIndex);
    const prefixMsg = `Still ${currentAvaliable} amount available to be split.`;
    return prefixMsg;
  };

  /**
   * do validation first, and dispatch the status to redux
   * update newCashflow first
   * for manual split will auto add new row if it still has avaliable amount to be split
   */
  const handleAmountConfim = (value: number, rowIndex: number) => {
    validateAmountInput(value, rowIndex);
    const newAmount = formatAmountToStrByPrecision(value, sourcePrecision);

    newCashflows[rowIndex] = {
      ...newCashflows[rowIndex],
      Cashflow: {
        ...newCashflows[rowIndex].Cashflow,
        Payment_Amount: newAmount,
      },
    };

    if (splitAction === SplitActionType.MANUAL_SPLIT) {
      newCashflows = tryAddManualSplitRow(
        newCashflows,
        rowIndex,
        sourceAmount,
        sourcePrecision
      );
    }

    dispatch(
      splitingCashflowAction({
        splitStatus: "INIT",
        isOpenSplittingDialog: true,
        isOpenLookUpSSIDialog: false,
        targetRowIndex: null,
        sourceCashflow,
        targetCashflows: newCashflows,
        initialTargetCashflows,
        amountSetting,
        splitAction,
      })
    );
  };

  /**
   * 1.delete current index cashflow and generate amount and then dispatch to redux
   * 2.delete validation info from validationArr store
   * 3.update validation info
   * 4.update split target cashflow.
   */
  const handleDeleteRow = (rowIndex: number) => {
    if (rowIndex === 0) return;
    const afterDelCashflow = deleteAndAdjustCashflow(
      newCashflows,
      rowIndex,
      sourceAmount,
      sourcePrecision
    );
    const { newArr, isValid } = deleteValidationByRowId(
      validationArr,
      rowIndex
    );
    dispatch(
      splittingValidateCashflowAction({
        isValid,
        message,
        validationArr: newArr,
      })
    );
    dispatch(
      splitingCashflowAction({
        splitStatus: "INIT",
        isOpenSplittingDialog: true,
        isOpenLookUpSSIDialog: false,
        targetRowIndex: null,
        sourceCashflow,
        targetCashflows: afterDelCashflow,
        initialTargetCashflows: afterDelCashflow,
        amountSetting,
        splitAction,
      })
    );
  };

  return {
    handleAmountConfim,
    generateOnChangePrefix,
    targetCashflows: newCashflows,
    sourceCashflow,
    precision: sourcePrecision,
    handleDeleteRow,
  };
}

interface UseSplittingActionsProps {
  form: FormInstance<any>;
  setOpenAffirmation: (value: React.SetStateAction<boolean>) => void;
  messageApi: MessageInstance;
  setProceedSplitting: (value: React.SetStateAction<boolean>) => void;
}

export function useSplittingActions({
  form,
  setOpenAffirmation,
  messageApi,
  setProceedSplitting,
}: UseSplittingActionsProps) {
  const dispatch = useDispatch<any>();
  const {
    sourceCashflow,
    targetCashflows,
    initialTargetCashflows,
    splitAction,
    amountSetting,
  } = useSelector((state: RootState) => state.splittingWorkflow);
  const precision = amountSetting?.precision ?? 2;
  const { isValid } = useSelector(
    (state: RootState) => state.splittingValidation
  );

  const handleAffirmationAction = async () => {
    try {
      const valid = await form?.validateFields();
      if (valid) {
        const formData = form?.getFieldsValue();
        formData.affirmedAt = formData.affirmedAt.valueOf();

        setOpenAffirmation && setOpenAffirmation(false);
        await handleSplitAction(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // only mnual and amend need do pre check
  const handleSplitFinalSubmit = () => {
    if (splitAction === SplitActionType.UN_SPLIT) {
      handleUnSplitAction();
    }
    const isPassFinalValidation = handlePreCheckAmount(
      targetCashflows,
      sourceCashflow,
      messageApi,
      isValid,
      precision
    );
    if (isPassFinalValidation && splitAction === SplitActionType.MANUAL_SPLIT) {
      setOpenAffirmation && setOpenAffirmation(true);
    } else if (
      isPassFinalValidation &&
      splitAction === SplitActionType.AMEND_SPLIT
    ) {
      handleAmendAction();
    }
  };

  const handleSplitAction = async (affirmationFormData: any) => {
    if (targetCashflows) {
      const postBody: ManualSplitDataType = {
        parentCashflow: {
          cashflowId: sourceCashflow?.Cashflow?.Cashflow_Id + "",
          amount:
            (sourceCashflow?.Cashflow?.Payment_Amount ?? "").toString() + "",
          currency: sourceCashflow?.Cashflow?.Payment_Currency + "",
        },
        childCashflows: targetCashflows.map((i) => ({
          amount: (i.Cashflow?.Payment_Amount ?? "").toString(),
          currency: i.Cashflow?.Payment_Currency ?? "",
          ...(i.vostroAccount?.settlementMeans
            ? { vostroAccount: i.vostroAccount }
            : {}),
          ...(i.nostroAccount?.settlementMeans
            ? { nostroAccount: i.nostroAccount }
            : {}),
        })),
        affirmationDetails: affirmationFormData ?? {},
      };

      setProceedSplitting && setProceedSplitting(true);
      try {
        const res = await cashflowManualSplit(postBody);
        if (res?.status === 200) {
          messageApi?.success(res?.message);
          dispatch(
            splitingCashflowAction({
              splitStatus: "INIT",
              isOpenSplittingDialog: false,
              isOpenLookUpSSIDialog: false,
              targetRowIndex: null,
              sourceCashflow: null,
              targetCashflows: null,
              initialTargetCashflows: null,
              amountSetting: null,
              splitAction: SplitActionType.COMPONENT_SPLIT,
            })
          );
          setOpenAffirmation && setOpenAffirmation(false);
        } else {
          messageApi?.error(res?.message);
          setOpenAffirmation && setOpenAffirmation(false);
        }
      } catch (error: any) {
        messageApi?.error(error?.response?.data?.errorMessage);
        setOpenAffirmation && setOpenAffirmation(false);
      } finally {
        setProceedSplitting && setProceedSplitting(false);
      }
    } else {
      messageApi?.error(
        "No target cashflows found! Will not proceed this splitting action!"
      );
    }
  };

  const handleAmendAction = async () => {
    if (targetCashflows) {
      // only can be amend cashflow need post to backend
      const modifiedCashflows = targetCashflows.filter((cf, idx) => {
        const original = initialTargetCashflows?.[idx];
        return (
          original &&
          String(cf.Cashflow?.Payment_Amount) !==
            String(original.Cashflow?.Payment_Amount)
        );
      });

      const requestBody: AmendSplitDataType = {
        splittingId: sourceCashflow?.Cashflow?.Splitting_Id + "",
        requestList: modifiedCashflows.map((i) => ({
          cashflowId: i.Cashflow?.Cashflow_Id + "",
          amount: (i.Cashflow?.Payment_Amount ?? "").toString() + "",
        })),
      };

      setProceedSplitting && setProceedSplitting(true);
      try {
        const res = await cashflowAmendSplit(requestBody);
        if (res.status === 200) {
          messageApi?.success(res.message);
          dispatch(
            splitingCashflowAction({
              splitStatus: "INIT",
              isOpenSplittingDialog: false,
              isOpenLookUpSSIDialog: false,
              targetRowIndex: null,
              sourceCashflow: null,
              targetCashflows: null,
              initialTargetCashflows: null,
              amountSetting: null,
              splitAction: SplitActionType.COMPLETE_SPLIT,
            })
          );
          dispatch(
            updateCashflow([sourceCashflow?.Cashflow?.Cashflow_Id + ""])
          );
        } else {
          messageApi?.error(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setProceedSplitting && setProceedSplitting(false);
      }
    } else {
      messageApi?.error(
        "No target cashflows found! Will not proceed this amend action!"
      );
    }
  };

  const handleUnSplitAction = async () => {
    const requestBody: UnSplitDataType = {
      cashflowId: sourceCashflow?.Cashflow?.Cashflow_Id + "",
      minorVersion: sourceCashflow?.Cashflow?.Cashflow_Minor_Version + "",
      businessVersion: sourceCashflow?.Cashflow?.Cashflow_Business_Version + "",
      splittingId: sourceCashflow?.Cashflow?.Splitting_Id + "",
    };
    setProceedSplitting && setProceedSplitting(true);

    try {
      const res = await cashflowUnSplit(requestBody);
      if (res.status === 200) {
        messageApi?.success(res.message);
        dispatch(
          splitingCashflowAction({
            splitStatus: "INIT",
            isOpenSplittingDialog: false,
            isOpenLookUpSSIDialog: false,
            targetRowIndex: null,
            sourceCashflow: null,
            targetCashflows: null,
            initialTargetCashflows: null,
            amountSetting: null,
            splitAction: SplitActionType.COMPLETE_SPLIT,
          })
        );
        dispatch(updateCashflow([sourceCashflow?.Cashflow?.Cashflow_Id ?? ""]));
      } else {
        messageApi?.error(res.message);
      }
    } catch (error: any) {
      messageApi?.error(
        error?.message || "Network error! Will not proceed un-splitting action!"
      );
    } finally {
      setProceedSplitting && setProceedSplitting(false);
    }
  };

  return {
    handleSplitAction,
    handleAmendAction,
    handleUnSplitAction,
    handleAffirmationAction,
    handleSplitFinalSubmit,
  };
}

interface UseQuerySplittingProps {
  messageApi: MessageInstance;
}

export const useQuerySplitting = ({ messageApi }: UseQuerySplittingProps) => {
  const dispatch = useDispatch<any>();
  const opensearch = useSelector((state: RootState) => state.opensearch);

  /**
   * Parallel query currency rounding and cashflow data for splitting
   */
  const querySplittingParallel = async (
    sourceApi: GridApi,
    targetApi: GridApi,
    sourceCashflow: CNCashflow,
    splitAction: SplitActionType
  ) => {
    try {
      sourceApi?.setGridOption("loading", true);
      targetApi?.setGridOption("loading", true);

      const queryCCCY = _get(sourceCashflow, "Cashflow.Payment_Currency") + "";
      const queryPayload = generateQuerySplitCashflowPayload(
        sourceCashflow,
        splitAction
      );

      const [roundingRes, cashflowRes] = await Promise.all([
        getCurrencyRounding(queryCCCY),
        dispatch(
          ultraCashflowQuery.endpoints.SettlementCashflowDataUltraQuery.initiate(
            {
              payload: queryPayload,
              fields: getFieldListFromAggridApi(sourceApi),
              opensearch,
            },
            { forceRefetch: true }
          )
        ).unwrap(),
      ]);
      const { cashflowUltraQuery } = cashflowRes ?? {};
      const results: CNCashflow[] = cashflowUltraQuery?.results ?? [];
      const amountSetting = {
        precision: roundingRes?.precision,
        type: roundingRes?.type,
      };
      const newTargetArr = generateManualSplitTargetArr(results);

      if (!roundingRes || !cashflowRes) {
        messageApi?.error("Failed to get currency rounding or cashflow data.");
        sourceApi?.setGridOption("loading", false);
        targetApi?.setGridOption("loading", false);
        return;
      }

      if (!results.length) {
        messageApi?.error("No cashflow data found.");
        sourceApi?.setGridOption("loading", false);
        targetApi?.setGridOption("loading", false);
        return;
      }

      if (SplitActionType.MANUAL_SPLIT === splitAction) {
        sourceApi?.setGridOption("rowData", results);
        sourceApi?.setGridOption("loading", false);
        targetApi?.setGridOption("rowData", results);
        targetApi?.setGridOption("loading", false);

        dispatch(
          splitingCashflowAction({
            splitStatus: "INIT",
            isOpenSplittingDialog: true,
            isOpenLookUpSSIDialog: false,
            targetRowIndex: null,
            sourceCashflow: results[0],
            targetCashflows: newTargetArr,
            initialTargetCashflows: newTargetArr,
            amountSetting,
            splitAction,
          })
        );
      } else {
        const parentCashflow = generateSplitParentCashflow(results);
        const childCashflows = generateSplitChildCashflow(results);

        sourceApi?.setGridOption("rowData", parentCashflow);
        sourceApi?.setGridOption("loading", false);
        targetApi?.setGridOption("rowData", childCashflows);
        targetApi?.setGridOption("loading", false);

        dispatch(
          splitingCashflowAction({
            splitStatus: "INIT",
            isOpenSplittingDialog: true,
            isOpenLookUpSSIDialog: false,
            targetRowIndex: null,
            sourceCashflow: parentCashflow[0],
            targetCashflows: childCashflows,
            initialTargetCashflows: childCashflows,
            amountSetting,
            splitAction,
          })
        );
      }
    } catch (error: any) {
      sourceApi?.setGridOption("loading", false);
      targetApi?.setGridOption("loading", false);
      messageApi?.error(error?.message || "Failed to query cashflow data.");
    }
  };

  return {
    querySplittingParallel,
  };
};

/**
 * Generate query payload for split cashflow
 */
export const generateQuerySplitCashflowPayload = (
  data: CNCashflow,
  splitAction: SplitActionType
) => {
  let filter: LogicFilter = {};
  if (SplitActionType.MANUAL_SPLIT === splitAction) {
    //@ts-ignore
    filter = {
      and: [
        {
          filters: [
            {
              field: "Cashflow.Cashflow_Id",
              operator: "EQ",
              values: `${data?.Cashflow?.Cashflow_Id}`,
            },
          ],
        },
      ],
    } as LogicFilter;
  } else {
    //@ts-ignore
    filter = {
      and: [
        {
          filters: [
            {
              field: "Cashflow.Splitting_Id",
              operator: "EQ",
              values: `${data?.Cashflow?.Splitting_Id}`,
            },
          ],
        },
      ],
    } as LogicFilter;
  }

  const queryPayload: RatanUltraQuery = {
    filters: filter,
    itemsPerPage: 1000,
    orderArgs: [],
    pageIndex: 0,
    pagingOption: PagingOption.PageIndex,
  };

  return queryPayload;
};

export const generateManualSplitTargetArr = (results: CNCashflow[]) => {
  const cloneTargetArr = deepClone(results);
  return [
    {
      ...cloneTargetArr[0],
      Cashflow: { ...cloneTargetArr[0].Cashflow, Cashflow_Id: "" },
    },
    ...cloneTargetArr.slice(1),
  ];
};

export const generateSplitParentCashflow = (data: CNCashflow[]) => {
  return (
    data.filter((item) => !item.Cashflow?.Cashflow_Id?.startsWith("S")) ?? []
  );
};

/**
 * filter split child cashflow and sort child cashflow by cashflow status
 * put eligible cashflow to the top of the list and unable to amend cashflow to the bottom of the list but not disrupt the order
 * canAmendSplittingState is the elegible cashflow status
 */
export const generateSplitChildCashflow = (data: CNCashflow[]) => {
  const splitChildArr =
    data.filter((item) => item.Cashflow?.Cashflow_Id?.startsWith("S")) ?? [];
  const sortedArr = [...splitChildArr].sort((a: CNCashflow, b: CNCashflow) => {
    const stateA = a.Cashflow?.Cashflow_State;
    const stateB = b.Cashflow?.Cashflow_State;
    const aEligible =
      stateA &&
      isSplitCashflowStateCategory(stateA) &&
      canAmendSplittingState.includes(stateA);
    const bEligible =
      stateB &&
      isSplitCashflowStateCategory(stateB) &&
      canAmendSplittingState.includes(stateB);
    if (aEligible === bEligible) return 0;
    return aEligible ? -1 : 1;
  });

  return sortedArr;
};

export const handlePreCheckAmount = (
  targetCashflows: CNCashflow[] | null | undefined,
  sourceCashflow: CNCashflow | null,
  messageApi: MessageInstance | undefined,
  isValidation: boolean,
  precision: number
) => {
  if (!sourceCashflow?.Cashflow?.Payment_Amount) {
    messageApi?.error("Source cashflow amount is empty");
    return false;
  } else if (!Array.isArray(targetCashflows) || !targetCashflows.length) {
    messageApi?.error("Target cashflows are required!");
    return false;
  } else if (targetCashflows.length < 2) {
    messageApi?.error("At least 2 child cashflow are in eligible status!");
    return false;
  } else if (!isValidation) {
    messageApi?.error("Please resolve all errors before proceed!");
    return false;
  }

  const totalAmount = amountAPlusBNumber(
    targetCashflows,
    (cf) => cf?.Cashflow?.Payment_Amount,
    precision
  );

  const isSourceEqTotal = isAmountAEqualB(
    totalAmount,
    sourceCashflow?.Cashflow?.Payment_Amount ?? 0
  );
  if (!isSourceEqTotal) {
    messageApi?.error(
      "Total split amount must equal to source cashflow amount!"
    );
    return false;
  }
  return true;
};

/**
 * Whether params below to Split Cashflow State
 */
export const isSplitCashflowStateCategory = (
  value: any
): value is SplitCashflowState => {
  return Object.values(SplitCashflowState).includes(value);
};

/**
 * validation amount when user input amount in the grid cell
 */

interface ValidateSplitAmountInputParams {
  value: number;
  rowIndex: number;
  sourceValidationArr: SplitValidationArrItem[];
  sourceAmount: number;
  sourcePrecision: number;
  splitAction: SplitActionType;
  maxThreshold: number;
  validationMaxInput: number;
}

export const validateSplitAmountInput = (
  params: ValidateSplitAmountInputParams
): { newIsValid: boolean; newValidationArr: SplitValidationArrItem[] } => {
  const {
    value,
    rowIndex,
    sourceValidationArr,
    sourceAmount,
    sourcePrecision,
    splitAction,
    maxThreshold,
    validationMaxInput,
  } = params;
  const newArr: SplitValidationArrItem[] = cloneDeep(sourceValidationArr);
  let currentValidation: SplitValidationArrItem | undefined = newArr.find(
    (item) => item.rowId === rowIndex
  );
  if (!currentValidation) {
    currentValidation = {
      cashflowId: null,
      rowId: rowIndex,
      inputStatus: InputStatusType.SUCCESS,
      prefixMessage: "",
    };
    newArr.push(currentValidation);
  }

  if (checkIsZero(value)) {
    currentValidation.inputStatus = InputStatusType.ERROR;
    currentValidation.prefixMessage = "Amount cannot be zero.";
    return { newIsValid: false, newValidationArr: newArr };
  }
  if (checkGreaterThanSource(value, sourceAmount)) {
    currentValidation.inputStatus = InputStatusType.ERROR;
    currentValidation.prefixMessage =
      "Split amount cannot be greater than the source cashflow.";
    return { newIsValid: false, newValidationArr: newArr };
  }
  if (checkDecimalPrecision(value, sourcePrecision)) {
    currentValidation.inputStatus = InputStatusType.ERROR;
    currentValidation.prefixMessage = `Only ${sourcePrecision} decimals allowed.`;
    return { newIsValid: false, newValidationArr: newArr };
  }
  if (
    splitAction === SplitActionType.AMEND_SPLIT &&
    checkAmendSplit(value, maxThreshold)
  ) {
    currentValidation.inputStatus = InputStatusType.ERROR;
    currentValidation.prefixMessage = `Input amount should between 0 and ${maxThreshold}(available balance).`;
    return { newIsValid: false, newValidationArr: newArr };
  }
  if (
    splitAction === SplitActionType.MANUAL_SPLIT &&
    checkManualSplit(value, validationMaxInput)
  ) {
    currentValidation.inputStatus = InputStatusType.ERROR;
    currentValidation.prefixMessage = `Input amount should between 0 and ${validationMaxInput}(available balance).`;
    return { newIsValid: false, newValidationArr: newArr };
  }
  currentValidation.inputStatus = InputStatusType.SUCCESS;
  currentValidation.prefixMessage = "";
  const newIsValid = checkOtherValidation(newArr);
  return { newIsValid, newValidationArr: newArr };
};

/**
 * Try to add a manual split and put current avaliable amount for it
 * @param cashflows - The list of cashflows
 * @param rowIndex - The index of the row to add
 * @param sourceAmount - The source amount
 * @param sourcePrecision - The source precision
 * Using num from container but not decimal, for safe and easy maintance
 * @returns The updated list of cashflows
 */
export const tryAddManualSplitRow = (
  cashflows: SplitTargetCashflow[],
  rowIndex: number,
  sourceAmount: number,
  sourcePrecision: number
) => {
  const newCashflows = cloneDeep(cashflows);
  if (rowIndex === newCashflows.length - 1) {
    const sum = amountAPlusBNumber(
      newCashflows,
      (item) => item?.Cashflow?.Payment_Amount,
      sourcePrecision
    );

    const availableAmount = amountAMinusBNumber(
      sourceAmount,
      sum,
      sourcePrecision
    );

    const availableAmountStr = formatAmountToStrByPrecision(
      availableAmount,
      sourcePrecision
    );

    // create new row if it still has avaliable amount
    if (Number(availableAmount) > 0) {
      const data = {
        ...newCashflows[0],
        Cashflow: {
          ...newCashflows[0].Cashflow,
          Cashflow_Id: "",
          Payment_Amount: availableAmountStr,
        },
      };
      const { vostroAccount, nostroAccount, ...newCashflowWithoutVostro } =
        data;
      newCashflows.push(newCashflowWithoutVostro);
    }
  }
  return newCashflows;
};

/**
 * delete cashflow at rowIndex and adjust the last row amount to ensure total amount equal to source amount
 * return after delete and adjust cashflow array
 */
export const deleteAndAdjustCashflow = (
  cashflows: SplitTargetCashflow[],
  rowIndex: number,
  sourceAmount: number,
  sourcePrecision: number
) => {
  const afterDelCashflow = cloneDeep(cashflows);
  afterDelCashflow.splice(rowIndex, 1);

  // caulate sum exclude last row
  const sum = sumBy(afterDelCashflow.slice(0, -1), (item) =>
    Number(item.Cashflow?.Payment_Amount ?? 0)
  );

  const diffAmount = amountAMinusBNumber(sourceAmount, sum, sourcePrecision);
  const diffAmountStr = formatAmountToStrByPrecision(
    diffAmount,
    sourcePrecision
  );

  // put sum for last row
  if (afterDelCashflow.length > 0) {
    set(
      afterDelCashflow[afterDelCashflow.length - 1],
      "Cashflow.Payment_Amount",
      diffAmountStr
    );
  }
  return afterDelCashflow;
};

export const deleteValidationByRowId = (
  validationArr: SplitValidationArrItem[],
  rowIndex: number
): { newArr: SplitValidationArrItem[]; isValid: boolean } => {
  const newArr = cloneDeep(validationArr);
  const idx = newArr.findIndex((item) => item.rowId === rowIndex);
  if (idx !== -1) {
    newArr.splice(idx, 1);
  }
  const isValid = newArr.every(
    (item) => item.inputStatus !== InputStatusType.ERROR
  );
  return { newArr, isValid };
};
