import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { aggridDeselectAll } from "src/Cashflow_CN/Main/store/actions";
import { updateNetCashflowWorkflowStatus } from "src/Cashflow_CN/Main/store/actions/workflowAction";
import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";
import {
  cashflowBeneBICNetting,
  cashflowBeneBICNettingPreview,
  cashflowCcilNetting,
  cashflowCcilNettingPreview,
  cashflowNetting,
  cashflowNettingPreview,
} from "src/Cashflow_CN/services";
import { RTT_MUTATION_NETTING } from "src/Root/analysis/const";

import {
  ApiCashflowNewNettingPreviewResponse,
  CashflowNewNettingPreviewMatrix,
  CashflowNewNettingPreviewResult,
  ManualNettingRequestPayload,
  ManualNettingResponse,
} from "./common/interface";
import {
  netPreviewDataExtracter,
  netPreviewDataParser,
} from "./netPreviewDataParser";

const handleNettingResult = async (
  netIds: Set<string>,
  singleIds: Set<string>,
  onCashflowNetted: (ids: string[]) => Promise<CNCashflow[]>,
  onCashflowUpdate: (ids: string[]) => Promise<CNCashflow[]>
) => {
  const [nettedResult, singleResult] = await Promise.allSettled([
    onCashflowNetted(Array.from(netIds)),
    onCashflowUpdate(Array.from(singleIds)),
  ]);
  return {
    netting: nettedResult.status === "fulfilled" ? nettedResult.value : [],
    single: singleResult.status === "fulfilled" ? singleResult.value : [],
  };
};

const showFailedMessage = (
  messageApi: MessageInstance,
  failedIds: Set<string>,
  resultList: CashflowNewNettingPreviewResult[]
) => {
  if (failedIds.size) {
    const allCount = resultList.reduce(
      (res, cur) => res + cur.originalCashflowList.length,
      0
    );
    messageApi.warning(
      Array.from(failedIds) +
        " failed" +
        (allCount > failedIds.size ? ", while other cashflows succeed !" : "")
    );
  } else {
    messageApi.success("Netting Succeed!");
  }
};

export const netCashflowHelper =
  ({
    requestParams,
    setProceedNetting,
    netType,
    messageApi,
    setErrorMessage,
    dispatch,
    setPreviewMetrix,
    onCashflowNetted,
    onCashflowUpdate,
    setNettingResult,
    startTrackingRTT,
  }: {
    requestParams: CNCashflow[];
    setProceedNetting: (value: React.SetStateAction<boolean>) => void;
    netType: NetType;
    messageApi: MessageInstance;
    setErrorMessage: (value: React.SetStateAction<string>) => void;
    dispatch: any;
    setPreviewMetrix: (
      value: React.SetStateAction<CashflowNewNettingPreviewMatrix[]>
    ) => void;
    onCashflowNetted: (ids: string[]) => Promise<CNCashflow[]>;
    onCashflowUpdate: (ids: string[]) => Promise<CNCashflow[]>;
    setNettingResult: (
      value: React.SetStateAction<{
        netting: CNCashflow[];
        single: CNCashflow[];
        failed: CNCashflow[];
        valid: CNCashflow[];
      }>
    ) => void;
    startTrackingRTT: (props1?: { name?: string }) => {
      completeTracking: (props2?: { name?: string }) => void;
      abortTracking: () => void;
    };
  }) =>
  async (affirmationFormData = null) => {
    if (Array.isArray(requestParams) && requestParams.length > 1) {
      setProceedNetting(true);
      const { completeTracking, abortTracking } = startTrackingRTT();
      try {
        const requestPayload: ManualNettingRequestPayload = {
          affirmationDetails: affirmationFormData,
          requestList: requestParams.map((i) => netPreviewDataExtracter(i)),
        };
        const nettingApi = getNettingApi(netType);
        const res = await nettingApi!(requestPayload);
        completeTracking({ name: RTT_MUTATION_NETTING });
        /* 
            suggest backend using http codes indicate errors, 
            then the error handler will move to catch block
          */
        if (res?.status !== 200) {
          messageApi.error(
            res?.message ??
              "Error occureed! Will not proceed this netting action!"
          );
          /**
           * below error message using for showing in the dialog
           */
          setErrorMessage(
            "Error occureed! Will not proceed this netting action! Please check content of cashflows selected"
          );
          dispatch(updateNetCashflowWorkflowStatus({ nettingStatus: "ERROR" }));
        } else {
          const { resultList } =
            res?.data as ApiCashflowNewNettingPreviewResponse;
          const netIds = new Set<string>();
          const failedIds = new Set<string>();
          const failedCashflow: CNCashflow[] = [];
          const validCashflow: CNCashflow[] = [];
          const singleIds = new Set<string>();
          const previewMatrix = resultList.map((item) => {
            const {
              originalCashflowList,
              previewCashflowList,
              valid,
              errorMsg,
            } = item;
            const source: CNCashflow[] =
              originalCashflowList?.map((i) => {
                const cashflow = netPreviewDataParser(i);
                if (valid) {
                  validCashflow.push(cashflow);
                  !previewCashflowList && singleIds.add(i.cashflowId + "");
                } else {
                  failedIds.add(i.cashflowId + "");
                  failedCashflow.push({
                    ...cashflow,
                    Error: errorMsg,
                  } as CNCashflow);
                }
                return cashflow;
              }) || [];
            const preview: CNCashflow[] =
              previewCashflowList?.map((i) => {
                i.netId && netIds.add(i.netId);
                return netPreviewDataParser(i);
              }) || [];
            return {
              ...item,
              originalCashflowList: source,
              previewCashflowList: preview,
            };
          });
          setPreviewMetrix(previewMatrix);
          const nettingResult = await handleNettingResult(
            netIds,
            singleIds,
            onCashflowNetted,
            onCashflowUpdate
          );

          setNettingResult({
            ...nettingResult,
            valid: validCashflow,
            failed: failedCashflow,
          });

          showFailedMessage(messageApi, failedIds, resultList);
          if (!failedIds.size) {
            messageApi.success("Netting Succeed!");
            dispatch(aggridDeselectAll());
          }
        }
      } catch (error: any) {
        abortTracking();
        messageApi.error(
          error?.response?.data?.message || error?.message || error
        );
      } finally {
        setProceedNetting(false);
      }
    }
  };

export const netCashflowWithAffirmationHelper =
  ({
    form,
    closeAffirmation,
    netCashflow,
  }: {
    form: FormInstance<any>;
    closeAffirmation: () => void;
    netCashflow: (affirmationFormData?: null) => Promise<void>;
  }) =>
  async () => {
    try {
      const valid = await form.validateFields();
      if (valid) {
        const formData = form.getFieldsValue();
        formData.affirmedAt = formData.affirmedAt.valueOf();
        closeAffirmation();
        netCashflow(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

export const getNettingPreviewApi = (netType: NetType) => {
  switch (netType) {
    case NetType.BilateralNetting:
      return cashflowNettingPreview;

    case NetType.CCILNetting:
      return cashflowCcilNettingPreview;

    case NetType.BeneficiaryBICNetting:
    default:
      return cashflowBeneBICNettingPreview;
  }
};

type NettingApiFunction = (
  data: ManualNettingRequestPayload
) => Promise<ManualNettingResponse>;

export const getNettingApi = (
  netType: NetType
): NettingApiFunction | undefined => {
  switch (netType) {
    case NetType.BeneficiaryBICNetting:
      return cashflowBeneBICNetting;

    case NetType.BilateralNetting:
      return cashflowNetting;

    case NetType.CCILNetting:
      return cashflowCcilNetting;

    default:
      break;
  }
};
