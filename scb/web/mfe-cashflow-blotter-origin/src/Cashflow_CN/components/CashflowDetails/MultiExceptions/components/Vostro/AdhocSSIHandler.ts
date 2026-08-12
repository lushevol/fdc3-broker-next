import get from "lodash/get";

import { NostroFormDetails } from "../Nostro/interface";
import { VostroFormDetails } from "./interface";
import { VostroFormProps } from "./interface";
interface GraphqlCashflowDetails {
  [key: string]: any;
}
export interface AdhocSSIHandlerProps<T> {
  layoutTitle: string | undefined;
  originalVostroData?: VostroFormDetails;
  currentVostroData: VostroFormDetails;
  nostroDetailsData?: NostroFormDetails;
  cashflowDetails: GraphqlCashflowDetails;
  rules: T[];
}
interface AdhocSSIHandlerRes<T> {
  vostorFormValue?: {
    settlementMeans?: string;
    settlementAccount?: string;
  };
  newRules: T[];
}
/**
 * AdhocSSIHandler is a class to handle the logic of validation rules
 * consturctor will be used to initialize the class with the required parameters AdhocSSIHandlerProps
 */
export class AdhocSSIHandler {
  private readonly context: AdhocSSIHandlerProps<any>;
  private readonly targetTitleScope: string[];
  private readonly res: AdhocSSIHandlerRes<any> = {
    newRules: [],
  };
  constructor(context: AdhocSSIHandlerProps<any>, targetTitleScope: string[]) {
    this.context = context;
    this.targetTitleScope = targetTitleScope;
  }
  isEligibleVostroForm(): boolean {
    const { layoutTitle } = this.context;

    if (this.targetTitleScope.some((kw) => layoutTitle?.includes(kw))) {
      return true;
    }
    return false;
  }
  isPassValidationReceiptSI(): boolean {
    const { cashflowDetails, nostroDetailsData } = this.context;
    const payReceive = get(
      cashflowDetails,
      "cashflow.Cashflow.Pay_Receive_Indicator"
    );
    const paymentCurrency = get(
      cashflowDetails,
      "cashflow.Cashflow.Payment_Currency"
    );
    const settlementMethod = get(cashflowDetails, "cashflow.Settlement_Method");
    const validationCCYList = ["XAU", "XAG", "XPD", "XPT"];
    const isTargetCCY = validationCCYList.includes(paymentCurrency);
    const { settlementMeans } = nostroDetailsData || {};
    if (settlementMethod === "UTIL") {
      return true;
    }
    if (
      payReceive === "Pay" ||
      (payReceive === "Receive" &&
        (isTargetCCY || settlementMeans === "Over-Account"))
    ) {
      return false;
    }
    return true;
  }

  updateFormTargetFields(): this {
    if (this.isEligibleVostroForm()) {
      const { nostroDetailsData, currentVostroData, originalVostroData } =
        this.context;
      const { ssiType: currentSsiType } = currentVostroData || {};
      const { ssiType: originalSsiType } = originalVostroData || {};

      if (nostroDetailsData && !currentSsiType && !originalSsiType) {
        const data = {
          settlementMeans: nostroDetailsData.settlementMeans,
          settlementAccount: nostroDetailsData.settlementAccount,
        };
        this.res.vostorFormValue = data;
      }
    }
    return this;
  }
  resetAdhocSSIValidationRules(): any[] {
    const rulesArr = this.context.rules;
    if (!Array.isArray(rulesArr)) return [];
    return rulesArr.map((item) => {
      const newItem = { ...item };
      if (Array.isArray(newItem.rules)) {
        let hasMandatoryOn = false;
        const newRules = newItem.rules.map((rule) => {
          if (rule.name === "MandatoryOn") {
            hasMandatoryOn = true;
            return { ...rule, name: "AllowEmpty" };
          }
          return rule;
        });
        if (!hasMandatoryOn) {
          newRules.push({ name: "AllowEmpty" });
        }
        newItem.rules = newRules;
      }
      return newItem;
    });
  }
  buildValidateRule(): this {
    let rules = this.context.rules;
    if (this.isEligibleVostroForm() && this.isPassValidationReceiptSI()) {
      rules = this.resetAdhocSSIValidationRules();
    }
    this.res.newRules = rules;
    return this;
  }
  toResult(): AdhocSSIHandlerRes<any> {
    return this.res;
  }
}
interface AdhocSSIHandlerFunctionCallback {
  updateRules: (rule: any[]) => void;
  setVostroFormFieldsValue: VostroFormProps["setVostroFormFieldsValue"];
}
/**
 * below function is used to handle the adhoc SSI logic
 * will use it to handel the logic to call react hooks
 */
export const AdhocSSIHandlerFunction = (
  context: AdhocSSIHandlerProps<any>,
  callbacks: AdhocSSIHandlerFunctionCallback
): void => {
  const re = new AdhocSSIHandler(context, ["Adhoc SSI", "Vostro SI"])
    .updateFormTargetFields()
    .buildValidateRule()
    .toResult();
  const { newRules, vostorFormValue } = re;
  const { updateRules, setVostroFormFieldsValue } = callbacks;
  updateRules(newRules);
  if (vostorFormValue) {
    setVostroFormFieldsValue(vostorFormValue);
  }
};
