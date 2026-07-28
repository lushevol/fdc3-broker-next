import { message, MessageArgsProps, Modal } from "antd";
import cloneDeep from "lodash/cloneDeep";
import { FC, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useIterableCollect, useRTT } from "src/Root/analysis";

import { SSI_DETAILS_CONFIG_CN } from "../../../Main/config/fieldsConfig";
import { MultiExceptionsNames, MultiExceptionsProps } from "./common/interface";
import StyledRoot, { classes } from "./common/style";
import { isSSIGoodStamping } from "./common/utils";
import ActionHistory from "./components/ActionHistory";
import ExceptionActions from "./components/Actions";
import { ExceptionActionsProps } from "./components/Actions/interface";
import Affirmation from "./components/Affirmation";
import BackValue from "./components/BackValue";
import Comments from "./components/Comments";
import CommonExceptions from "./components/CommonExceptions";
import Layout from "./components/Layout";
import NostroSection from "./components/Nostro";
import VostroSection from "./components/Vostro";
import { VostroFormDetails } from "./components/Vostro/interface";
import useController, {
  AdhocingContext,
  FixingMissingNostroContext,
} from "./hooks/useController";
import useData from "./hooks/useData";
import useForm from "./hooks/useForm";
import { submitHelper } from "./utils/submit";

const getFormConfig = (data?: VostroFormDetails) => {
  const SSI_DETAILS_CONFIG_CN_COPY = cloneDeep(SSI_DETAILS_CONFIG_CN);
  // RATAN-15034
  const swiftType = SSI_DETAILS_CONFIG_CN_COPY.find(
    (i) => i.field === "swiftType"
  );
  return swiftType && data?.swiftType
    ? swiftType.onChange(data?.swiftType, SSI_DETAILS_CONFIG_CN_COPY, {
        getFieldsValue: () => data,
      })
    : SSI_DETAILS_CONFIG_CN_COPY;
};

const mk = "cashflow-details-multi-exception-message";
const MultiExceptions: FC<MultiExceptionsProps> = memo(
  ({ cashflowDetails, counterPartyDetails, refreshCashflow, closeDialog }) => {
    const { startTracking } = useIterableCollect();
    const [messageApi, messageContext] = message.useMessage();
    const [modalApi, modalContext] = Modal.useModal();
    const vostroCache = useRef("");
    const nostroCache = useRef("");
    const { startTracking: startTrackingRTT } = useRTT();
    // data
    const {
      userRole,
      isSubmitByYou,
      cashflowSubState,
      actionHistoryListData,
      vostroListData,
      vostroDetailsData,
      handleSelectVostroRecord,
      nostroListData,
      nostroDetailsData,
      handleSelectNostroRecord,
      affirmationDefaultFormData,
      backvalueDefaultFormData,
      allAvailableCommonExceptionsData,
      classifiedCommonExceptions,
      makerSubmittedData,
      disableAllActions,
      isAdhocing,
      setIsAdhocing,
      exceptionsWithRejectAction,
      hasRebookExceptions,
      hasHighRiskExceptionsButNoPermission,
      hasHardBlockerExceptions,
      isFixingMissingNostro,
      setIsFixingMissingNostro,
      isAuthLimit,
      settlementMethod,
    } = useData({ cashflowDetails });

    // form
    const {
      vostroFormRef,
      nostroFormRef,
      affirmationFormRef,
      backvalueFormRef,
      commentsFormRef,
      allFormsSubmit,
      setFormValidateStatus,
      clearFormValidateStatus,
      onResetFormValidationStatus,
    } = useForm();

    useEffect(() => {
      if (vostroDetailsData) {
        const vostroDetailsDataStr = JSON.stringify(vostroDetailsData);
        if (vostroDetailsDataStr !== vostroCache.current)
          vostroFormRef.current?.forceRefreshValidation(vostroDetailsData);
        vostroCache.current = vostroDetailsDataStr;
        vostroFormRef.current?.clearValidateStatus();
        const vostroFormConfig = getFormConfig(vostroDetailsData);
        vostroFormRef.current?.setFormConfig(vostroFormConfig);
      }
    }, [vostroDetailsData]);

    useEffect(() => {
      if (nostroDetailsData) {
        const nostroDetailsDataStr = JSON.stringify(nostroDetailsData);
        if (nostroDetailsDataStr !== nostroCache.current)
          nostroFormRef.current?.forceRefreshValidation(nostroDetailsData);
        nostroCache.current = nostroDetailsDataStr;
        nostroFormRef.current?.clearValidateStatus();
      }
    }, [nostroDetailsData]);

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

    const { layoutSetting } = useController({
      classifiedCommonExceptions,
      userRole,
      cashflowSubState,
      isSubmitByYou,
      disableAllActions,
      isAdhocing,
      isFixingMissingNostro,
    });

    const showFeedback = useCallback(({ content, type }: MessageArgsProps) => {
      messageApi.open({
        key: mk,
        type,
        content,
      });
    }, []);

    const handleSubmitOrReject: ExceptionActionsProps["onSubmit"] =
      submitHelper({
        cashflowDetails,
        allFormsSubmit,
        classifiedCommonExceptions,
        isAdhocing,
        isFixingMissingNostro,
        startTracking,
        startTrackingRTT,
        userRole,
        makerSubmittedData,
        setFormValidateStatus,
        showFeedback,
        hasRebookExceptions,
        hasHardBlockerExceptions,
        modalApi,
        allAvailableCommonExceptionsData,
        clearFormValidateStatus,
        closeDialog,
        refreshCashflow,
        settlementMethod,
      });

    const isFixingMissingNostroValue = useMemo(
      () => ({ isFixingMissingNostro, setIsFixingMissingNostro }),
      [isFixingMissingNostro, setIsFixingMissingNostro]
    );

    const isAdhocingValue = useMemo(
      () => ({ isAdhocing, setIsAdhocing }),
      [isAdhocing, setIsAdhocing]
    );

    return (
      <StyledRoot className={classes.root}>
        {messageContext}
        {modalContext}
        <FixingMissingNostroContext.Provider value={isFixingMissingNostroValue}>
          <AdhocingContext.Provider value={isAdhocingValue}>
            <Layout setting={layoutSetting}>
              <ActionHistory data={actionHistoryListData} />
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
                cashflowDetails={cashflowDetails}
                nostroDetailsData={nostroDetailsData}
              />
              <NostroSection
                ref={nostroFormRef}
                listData={nostroListData}
                detailsData={nostroDetailsData}
                onSelectRecord={handleSelectNostroRecord}
              />
              <Affirmation
                ref={affirmationFormRef}
                exceptions={
                  classifiedCommonExceptions[MultiExceptionsNames.Affirmation]
                }
                data={affirmationDefaultFormData}
              />
              <BackValue
                ref={backvalueFormRef}
                exceptions={
                  classifiedCommonExceptions[MultiExceptionsNames.Backvalue]
                }
                data={backvalueDefaultFormData}
              />
              <CommonExceptions
                data={[
                  ...classifiedCommonExceptions[
                    MultiExceptionsNames.Vostro
                  ].filter((e) => !isSSIGoodStamping(e)),
                  ...classifiedCommonExceptions[
                    MultiExceptionsNames.Affirmation
                  ],
                  ...classifiedCommonExceptions[MultiExceptionsNames.Backvalue],
                  ...classifiedCommonExceptions[
                    MultiExceptionsNames.HIGH_RISK_NSTP
                  ],
                  ...classifiedCommonExceptions[
                    MultiExceptionsNames.HARD_BLOCKER
                  ],
                  ...classifiedCommonExceptions[MultiExceptionsNames.NSTP],
                  ...classifiedCommonExceptions[MultiExceptionsNames.Other],
                ]}
              />
              {/* <CommonExceptions
                data={classifiedCommonExceptions[MultiExceptionsNames.Other]}
              /> */}
              <Comments ref={commentsFormRef} />
              <ExceptionActions
                userRole={userRole}
                isSubmitByYou={isSubmitByYou}
                onSubmit={handleSubmitOrReject}
                disableAllActions={disableAllActions}
                exceptionsWithRejectAction={exceptionsWithRejectAction}
                hasHighRiskExceptionsButNoPermission={
                  hasHighRiskExceptionsButNoPermission
                }
                hasAuthLimitNotSufficient={!isAuthLimit}
              />
            </Layout>
          </AdhocingContext.Provider>
        </FixingMissingNostroContext.Provider>
      </StyledRoot>
    );
  }
);

export default MultiExceptions;
