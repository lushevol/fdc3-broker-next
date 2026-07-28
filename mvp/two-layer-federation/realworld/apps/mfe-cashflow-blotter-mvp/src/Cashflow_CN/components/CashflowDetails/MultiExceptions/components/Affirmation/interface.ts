import { FormProps } from "antd";
import type { Dayjs } from "dayjs";

import { ExceptionItem } from "../../common/interface";

export interface AffirmationProps {
  exceptions?: ExceptionItem[];
  data: AffirmationFormDataType | null;
  labelColSpan?: number;
  wrapperColSpan?: number;
  formLayout?: FormProps["layout"];
  disabled?: boolean;
}

export type affirmationSubmitFormRawDataType = {
  affirmedBy: string;
  phone_email: string;
  affirmedAt: Dayjs;
};

export type affirmationSubmitFormDataType = {
  affirmedBy: string;
  phone_email: string;
  affirmedAt: string;
};

export type AffirmationFormDataType = RatanAffirmation;
