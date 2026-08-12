import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { hasPermission } from "Import/ratanutils";

import { ToBeNettedCashflowRequest } from "../../../components/NettingPreview/common/interface";
import { WorkflowActionExtraOptions } from "../../common/interface";
import { netCashflowAction } from "../../store/actions";
import {
  beneficiaryBICNettingValidation,
  canBeneficiaryBICNetting,
} from "./cashflowNettingEligible/beneficiaryBicNetting";
import {
  bilateralNettingValidation,
  cashflowCanBeBilateralNetting,
} from "./cashflowNettingEligible/bilateralNetting";
import {
  cashflowCanBeCCILNetting,
  ccilNettingValidation,
} from "./cashflowNettingEligible/ccilNetting";

const hasNettingPermission = () =>
  hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting"
  ) as boolean;

export enum NetType {
  BilateralNetting,
  CCILNetting,
  BeneficiaryBICNetting,
}

const getRequestData = (
  selectedData: CNCashflow[],
  options: WorkflowActionExtraOptions,
  netType: NetType
): ToBeNettedCashflowRequest => {
  const requestParams: CNCashflow[] = [];
  let selectedDataAreValidToNet = false;
  switch (netType) {
    case NetType.BilateralNetting:
      selectedDataAreValidToNet = bilateralNettingValidation(
        selectedData,
        options
      );
      break;
    case NetType.CCILNetting:
      selectedDataAreValidToNet = ccilNettingValidation(selectedData, options);
      break;

    case NetType.BeneficiaryBICNetting:
      selectedDataAreValidToNet = beneficiaryBICNettingValidation(
        selectedData,
        options
      );
      break;

    default:
      break;
  }
  if (selectedDataAreValidToNet) {
    selectedData.forEach((item) => {
      requestParams.push(item);
    });
  }

  return { requestParams };
};

const netSelectedCashflow = (
  selectedData: CNCashflow[],
  options: WorkflowActionExtraOptions,
  netType: NetType
) => {
  const { dispatch } = options;
  const request: ToBeNettedCashflowRequest = getRequestData(
    selectedData,
    options,
    netType
  );

  if (request.requestParams.length > 0) {
    dispatch(
      netCashflowAction({
        isNetCashflowDialogVisible: true,
        nettingStatus: "INIT",
        data: request,
        netType,
      })
    );
  }
};

export const netCashflowRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  const selectedData: CNCashflow[] = param.api?.getSelectedRows() ?? [];
  if (selectedData.length > 1 && hasNettingPermission()) {
    if (
      selectedData.every((row) => {
        return canBeneficiaryBICNetting(row);
      })
    ) {
      return {
        name: "BIC Net Selected Cashflow",
        action: () => {
          netSelectedCashflow(
            selectedData,
            options,
            NetType.BeneficiaryBICNetting
          );
        },
      };
    } else if (
      selectedData.every((row) => {
        return cashflowCanBeCCILNetting(row);
      })
    ) {
      return {
        name: "CCIL Net Selected Cashflow",
        action: () => {
          netSelectedCashflow(selectedData, options, NetType.CCILNetting);
        },
      };
    } else if (
      selectedData.every((row) => {
        return cashflowCanBeBilateralNetting(row);
      })
    ) {
      return {
        name: "Net Selected Cashflow",
        action: () => {
          netSelectedCashflow(selectedData, options, NetType.BilateralNetting);
        },
      };
    }
    return null;
  }
  return null;
};
