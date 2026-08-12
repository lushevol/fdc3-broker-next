import _get from "lodash/get";
import { CommonUtil } from "../../Root/import";

export function getDateColumnCommonDefs(
  field: string,
  alternateField?: string
) {
  return {
    valueGetter: (params) => {
      const date =
        _get(params.data, field) || _get(params.data, alternateField);
      return date ? CommonUtil.formatDate(date, true) : "";
    },
    comparator(valueA, valueB) {
      const dateA = new Date(valueA).getTime();
      const dateB = new Date(valueB).getTime();
      return dateA - dateB;
    },
  };
}
