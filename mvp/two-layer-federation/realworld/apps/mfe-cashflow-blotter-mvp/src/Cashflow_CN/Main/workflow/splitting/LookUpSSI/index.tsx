import { Box } from "@mui/material";
import { message } from "antd";
import { Button } from "Import/index";
import cloneDeep from "lodash/cloneDeep";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NostroSection from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/components/Nostro";
import useData from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/hooks/useData";
import useForm from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/hooks/useForm";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

import { generateEmptyGraphQLCashflowDetails } from "../../../../components/CashflowDetails/common/utils";
import { MultiExceptionsNames } from "../../../../components/CashflowDetails/MultiExceptions/common/interface";
import VostroSection from "../../../../components/CashflowDetails/MultiExceptions/components/Vostro";
import { splitingCashflowAction } from "../../../store/actions";
import StyledMuiDialog from "./style";
import {
  fetchCounterPartyDetails,
  fetchGraphCashflowDetails,
  getCurrentSplittingData,
  hasSplittingWorkflowData,
  validateSplitLookupSubmit,
} from "./utils";

export const SplitLookUpSSIComp: FC = () => {
  const {
    isOpenLookUpSSIDialog,
    sourceCashflow,
    targetRowIndex,
    targetCashflows,
    ...rest
  } = useSelector((state: RootState) => state.splittingWorkflow);
  const opensearch = useSelector((state: RootState) => state.opensearch);
  const cloneSourceCashflow = cloneDeep(sourceCashflow);
  const dispatch = useDispatch();
  const [graphCashflowDetails, setGraphCashflowDetails] =
    useState<GraphqlCashflowDetails>(
      generateEmptyGraphQLCashflowDetails(cloneSourceCashflow)
    );
  const [counterPartyDetails, setCounterPartyDetails] =
    useState<CounterPartyDetailsFMEntity>();
  const [messageApi, messageContext] = message.useMessage();
  const isSplittingDataAvailable = hasSplittingWorkflowData(
    isOpenLookUpSSIDialog,
    targetRowIndex,
    targetCashflows
  );
  const currentSplittingData = getCurrentSplittingData(
    isOpenLookUpSSIDialog,
    targetRowIndex,
    targetCashflows
  );

  const {
    vostroListData,
    vostroDetailsData,
    handleSelectVostroRecord,
    nostroListData,
    nostroDetailsData,
    handleSelectNostroRecord,
    classifiedCommonExceptions,
  } = useData({
    cashflowDetails: graphCashflowDetails,
    isSplittingScene: isOpenLookUpSSIDialog,
    isSplittingDataAvailable,
    currentSplittingData,
  });
  const { vostroFormRef, nostroFormRef, onResetFormValidationStatus } =
    useForm();
  const vostroCache = useRef("");
  const nostroCache = useRef("");

  useEffect(() => {
    fetchGraphCashflowDetails(
      cloneSourceCashflow?.Cashflow?.Cashflow_Id,
      setGraphCashflowDetails,
      opensearch
    );
    fetchCounterPartyDetails(
      cloneSourceCashflow?.Entity?.Counterparty_SCI_FMID,
      setCounterPartyDetails
    );
  }, [sourceCashflow]);

  useEffect(() => {
    //auto refresh validation when vostroDetailsData change
    if (vostroDetailsData) {
      const vostroDetailsDataStr = JSON.stringify(vostroDetailsData);
      if (vostroDetailsDataStr !== vostroCache.current)
        vostroFormRef.current?.forceRefreshValidation(vostroDetailsData);
      vostroCache.current = vostroDetailsDataStr;
      vostroFormRef.current?.clearValidateStatus();
    }
  }, [vostroDetailsData, vostroFormRef]);

  useEffect(() => {
    //auto refresh validation when nostroDetailsData change
    if (nostroDetailsData) {
      const nostroDetailsDataStr = JSON.stringify(nostroDetailsData);
      if (nostroDetailsDataStr !== nostroCache.current)
        nostroFormRef.current?.forceRefreshValidation(nostroDetailsData);
      nostroCache.current = nostroDetailsDataStr;
      nostroFormRef.current?.clearValidateStatus();
    }
  }, [nostroDetailsData, nostroFormRef]);

  const setVostroFormFieldsValue = useCallback((p: { [f: string]: any }) => {
    const vostroForm = vostroFormRef.current?.getForm();
    if (p.ssiType) {
      // RATAN-14730 this is for auto populate when switch swiftType.
      const nostroForm = nostroFormRef.current?.getForm();
      const { settlementMeans, settlementAccount } =
        nostroForm?.getFieldsValue() || {};
      settlementMeans && (p.settlementMeans = settlementMeans);
      settlementAccount && (p.settlementAccount = settlementAccount);
      vostroForm?.validateFields(["swiftType"]);
    }
    vostroForm?.setFieldsValue(p);
  }, []);

  const onClose = () => {
    vostroFormRef.current?.getForm()?.resetFields();
    nostroFormRef.current?.getForm()?.resetFields();
    dispatch(
      splitingCashflowAction({
        isOpenLookUpSSIDialog: false,
        sourceCashflow,
        targetRowIndex: null,
        targetCashflows,
        ...rest,
      })
    );
  };

  const onReset = () => {
    vostroFormRef.current?.getForm()?.resetFields();
    nostroFormRef.current?.getForm()?.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const { valid, newTargetCashflows } = validateSplitLookupSubmit({
        targetRowIndex,
        targetCashflows,
        vostroFormRef,
        nostroFormRef,
        vostroDetailsData,
        nostroDetailsData,
        messageApi,
      });
      if (!valid) return;

      dispatch(
        splitingCashflowAction({
          isOpenLookUpSSIDialog: false,
          sourceCashflow,
          targetRowIndex: null,
          targetCashflows: newTargetCashflows,
          ...rest,
        })
      );
      vostroFormRef.current?.getForm()?.resetFields();
      nostroFormRef.current?.getForm()?.resetFields();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {messageContext}
      <StyledMuiDialog
        open={isOpenLookUpSSIDialog}
        onClose={onClose}
        title={"Look Up SSI"}
        width="1700px"
        height="850px"
        enableResize
      >
        <Box
          style={{ paddingRight: "5px", paddingTop: "5px", textAlign: "right" }}
        >
          <Button
            type="primary"
            onClick={handleSubmit}
            variant="contained"
            size="medium"
            style={{ marginRight: 10 }}
          >
            Submit
          </Button>
          <Button
            onClick={() => onReset()}
            data-testid={"look-up-ssi-reset-button"}
            variant="outlined"
            size="medium"
          >
            Reset
          </Button>
        </Box>
        <div
          className="split-lookup-ssi-dialog"
          style={{ display: "flex", width: "100%" }}
        >
          <div
            className="split-lookup-vostro-section"
            style={{ flex: 1, paddingRight: 20 }}
          >
            <div
              style={{ fontWeight: 600, fontSize: 16, margin: "12px 0 8px 0" }}
            >
              Vostro SI Information
            </div>
            <VostroSection
              ref={vostroFormRef}
              listData={vostroListData}
              detailsData={vostroDetailsData}
              exceptions={
                classifiedCommonExceptions[MultiExceptionsNames.Vostro]
              }
              onSelectRecord={handleSelectVostroRecord}
              onResetFormValidationStatus={onResetFormValidationStatus}
              setVostroFormFieldsValue={setVostroFormFieldsValue}
              counterPartyDetails={counterPartyDetails}
              cashflowDetails={graphCashflowDetails}
              nostroDetailsData={nostroDetailsData}
              isLookUpOnly={true}
            />
          </div>

          <div className="split-lookup-nostro-section" style={{ width: 560 }}>
            <div
              style={{ fontWeight: 600, fontSize: 16, margin: "12px 0 8px 0" }}
            >
              Nostro SI Information
            </div>
            <NostroSection
              ref={nostroFormRef}
              listData={nostroListData}
              detailsData={nostroDetailsData}
              onSelectRecord={handleSelectNostroRecord}
            />
          </div>
        </div>
      </StyledMuiDialog>
    </>
  );
};
