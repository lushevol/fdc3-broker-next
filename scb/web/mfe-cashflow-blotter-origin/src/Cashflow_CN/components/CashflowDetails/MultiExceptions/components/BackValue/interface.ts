import { FormProps } from "antd";

import { ExceptionItem } from "../../common/interface";

export interface BackValueProps {
  exceptions?: ExceptionItem[];
  data: BackValueFormDataType | null;
  label?: string;
  labelColSpan?: number;
  wrapperColSpan?: number;
  formLayout?: FormProps["layout"];
  disabled?: boolean;
}

export interface BackValueFormDataType {
  swiftPaymentDate: string;
}
