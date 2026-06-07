import { RatanRawFieldConfig, RatanFieldConfig } from "../type";
import { parseDataType } from "./dataType";
import { parseValueList } from "./valueList";

export const ratanFieldConfigPreprocessing = (
  fieldConfig: RatanRawFieldConfig
): RatanFieldConfig => {
  const dataType = parseDataType(fieldConfig.dataType);
  return {
    ...fieldConfig,
    valueList: parseValueList(fieldConfig.valueList, dataType),
    dataType,
  };
};
