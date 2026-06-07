import { MessageInstance } from "antd/es/message/interface";
import { isEmpty } from "Import/ratanutils";
import { cloneDeep, isNil } from "lodash";

import { RefStructType } from "../../../../components/CashflowDetails/MultiExceptions/common/interface";
import { NostroFormDetails } from "../../../../components/CashflowDetails/MultiExceptions/components/Nostro/interface";
import { VostroFormDetails } from "../../../../components/CashflowDetails/MultiExceptions/components/Vostro/interface";
import { getCountryInfo } from "../../../../services";
import {
  queryCashFlowDetails,
  queryCounterPartyDetails_CN,
} from "../../../../services/graphql";
import {
  SplitRowIndexType,
  SplittingTargetCashflowType,
} from "../common/interface";

export const validateSplitLookupSubmit = ({
  targetRowIndex,
  targetCashflows,
  vostroFormRef,
  nostroFormRef,
  vostroDetailsData,
  nostroDetailsData,
  messageApi,
}: {
  targetRowIndex: SplitRowIndexType;
  targetCashflows: SplitTargetCashflow[] | null | undefined;
  vostroFormRef: React.RefObject<RefStructType>;
  nostroFormRef: React.RefObject<RefStructType>;
  vostroDetailsData: VostroFormDetails | undefined;
  nostroDetailsData: NostroFormDetails | undefined;
  messageApi: MessageInstance;
}): { valid: boolean; newTargetCashflows?: SplitTargetCashflow[] } => {
  const newTargetCashflows = cloneDeep(targetCashflows);
  const nostroSettlementMeans = nostroFormRef.current
    ?.getForm()
    ?.getFieldValue("settlementMeans");
  const vostroSettlementMeans = vostroFormRef.current
    ?.getForm()
    ?.getFieldValue("settlementMeans");
  const nostroSettlementAccount = nostroFormRef.current
    ?.getForm()
    ?.getFieldValue("settlementAccount");
  const vostroSettlementAccount = vostroFormRef.current
    ?.getForm()
    ?.getFieldValue("settlementAccount");

  if (!isEmpty(targetRowIndex) && !isNil(targetRowIndex)) {
    if (!vostroSettlementMeans && !nostroSettlementMeans) {
      messageApi.warning("You do not choose any ssi");
      delete newTargetCashflows[targetRowIndex].vostroAccount;
      delete newTargetCashflows[targetRowIndex].nostroAccount;
    } else if (!vostroSettlementMeans && nostroSettlementMeans) {
      messageApi.error("Please select vostro ssi");
      return { valid: false };
    } else if (!nostroSettlementMeans && vostroSettlementMeans) {
      messageApi.error("Please select nostro ssi");
      return { valid: false };
    } else if (
      vostroSettlementAccount !== nostroSettlementAccount ||
      vostroSettlementMeans !== nostroSettlementMeans
    ) {
      messageApi.error("Vostro and Nostro SSI must be same");
      return { valid: false };
    } else {
      newTargetCashflows[targetRowIndex].vostroAccount = vostroDetailsData;
      newTargetCashflows[targetRowIndex].nostroAccount = nostroDetailsData;
    }
  }
  return { valid: true, newTargetCashflows };
};

export const fetchGraphCashflowDetails = async (
  cashflowId: string | undefined,
  setGraphCashflowDetails: (data: GraphqlCashflowDetails) => void,
  opensearch: boolean = false
) => {
  if (!cashflowId) return;
  try {
    const res = await queryCashFlowDetails([cashflowId + ""], opensearch);
    const resp = res?.graphCashFlowDetails?.[0];
    if (resp) setGraphCashflowDetails(resp);
  } catch (error) {
    console.error(error);
  }
};

export const fetchCounterPartyDetails = async (
  counterpartyFMID: string | undefined,
  setCounterPartyDetails: (data: CounterPartyDetailsFMEntity) => void
) => {
  if (!counterpartyFMID) return;
  try {
    const res = await queryCounterPartyDetails_CN(counterpartyFMID);
    if (!res?.fmEntity) return;
    const data = res.fmEntity;
    const convertData = cloneDeep(data);
    const requestParams = convertData.fmAddress
      ?.map((i) => i.country)
      .filter((item: any) => item !== null);

    try {
      const result = await getCountryInfo({
        countryCodes: Array.from(new Set(requestParams)),
      });
      convertData.fmAddress?.forEach((k) => {
        const countryInfo = result.countryInfoList?.find(
          (i) => i.countryCode === k.country
        );
        k.country = countryInfo?.countryName || k.country;
      });
      setCounterPartyDetails(convertData);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Check if has splitting workflow data when open look up ssi dialog
 */
export const hasSplittingWorkflowData = (
  isOpenLookUpSSIDialog: boolean,
  targetRowIndex: string | number | null,
  targetCashflows: SplittingTargetCashflowType
) => {
  return (
    isOpenLookUpSSIDialog &&
    !isEmpty(targetRowIndex) &&
    targetRowIndex !== null &&
    targetRowIndex !== undefined &&
    Array.isArray(targetCashflows)
  );
};

/**
 * Get current splitting data when open look up ssi dialog
 */
export const getCurrentSplittingData = (
  isOpenLookUpSSIDialog: boolean,
  targetRowIndex: string | number | null,
  targetCashflows: SplittingTargetCashflowType
): SplitTargetCashflow | undefined => {
  if (
    isOpenLookUpSSIDialog &&
    !isEmpty(targetRowIndex) &&
    targetRowIndex !== null &&
    targetRowIndex !== undefined &&
    Array.isArray(targetCashflows)
  )
    return targetCashflows[targetRowIndex];
  return undefined;
};
