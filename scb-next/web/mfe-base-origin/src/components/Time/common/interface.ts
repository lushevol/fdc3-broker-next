import type { DateValue } from "../../../utils/common";

export interface TimeProps {
  value: DateValue;
  isAccurateToDay?: boolean;
  field?: string | string[];
  colDef?: {
    field: string;
  };
}
