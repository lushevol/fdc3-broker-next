import {
  customDataTypeMapping,
  standardFieldType,
} from "../config/dataTypeMap";
import { RatanFieldType } from "../type";

function includes<T, U extends T>(arr: readonly U[], elem: T): elem is U {
  return arr.includes(elem as any);
}
const isStandardFieldType = (t: string): t is RatanFieldType => {
  return includes(standardFieldType, t);
};

export const parseDataType = (datatype: string): RatanFieldType => {
  const lowDataType = String.prototype.toLowerCase.call(datatype);
  if (isStandardFieldType(lowDataType)) return lowDataType;
  const targetDataType = customDataTypeMapping.find((i) =>
    i.custom.includes(lowDataType)
  );
  if (targetDataType) return targetDataType.standard;
  return "text";
};
