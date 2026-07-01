import { FormInstance } from "antd";
import { ValidateStatus } from "antd/es/form/FormItem";
import { CustomFormConfigProps } from "./FormItemComponents";

export interface PopulateRulesParams {
  rules?: any[];
  updateRules?: (rules: any[]) => void;
}

export interface CustomFormProps {
  formConfig: any;
  className?: string;
  defaultData?: any;
  initialValues?: any;
  editable?: boolean;
  layout?: any;
  onChange?: Function;
  onSubmit?: Function;
  onReject?: Function;
  onNext?: Function;
  onPre?: Function;
  enableReset?: boolean;
  validationRuleName?: string;
  customRules?: any[];
  data?: any;
  formName?: string;
  isCashflowSettlementCN?: boolean;
  validationRules?: any[];
  populateRules?: (params: PopulateRulesParams) => void;
}

export interface RefStructType {
  getForm: () => FormInstance<any>;
  setValidateStatus: (vs: { [n: string]: AntFormCustomValidate }) => void;
  clearValidateStatus: () => void;
  forceRefreshValidation: (data: any) => void;
  setFormConfig: (config: CustomFormConfigProps[]) => void;
  valuesChange: (obj: any) => void;
}

export interface AntFormCustomValidate {
  validateStatus: ValidateStatus;
  help: string;
  hasFeedback: boolean;
}
