import { FIELD_SEPERATOR } from "../config/const";
import type {
  RatanFieldConfigInCascader,
  RatanFieldCascaderOption,
} from "../type";
import { parseDataType } from "./dataType";

export const getPaths = (fieldConfig: RatanFieldConfigInCascader) => {
  const { indexedTerm, subSelection } = fieldConfig;
  const paths = indexedTerm.split(FIELD_SEPERATOR);
  if (subSelection && paths.length === 1 && paths[0] !== subSelection) {
    paths.unshift(subSelection);
  }
  return paths;
};

export const getLeafLabel = (fieldConfig: RatanFieldConfigInCascader) => {
  const { businessTerm, indexedTerm } = fieldConfig;
  if (businessTerm) return businessTerm;
  const paths = indexedTerm.replace(/_/g, " ").split(FIELD_SEPERATOR);
  return paths[paths.length - 1];
};

const cascaderBuilder = (fieldsConfigs: RatanFieldConfigInCascader[]) => {
  return fieldsConfigs.reduce((res, cur) => {
    cur.dataType = parseDataType(cur.dataType);
    const paths = getPaths(cur);
    return insertFieldsConfigIntoCascaderOption(paths, cur, res);
  }, [] as RatanFieldCascaderOption[]);
};

const insertFieldsConfigIntoCascaderOption = (
  paths: string[],
  fieldConfig: RatanFieldConfigInCascader,
  cascaderOptions: RatanFieldCascaderOption[] = []
): RatanFieldCascaderOption[] => {
  if (paths.length === 0) return cascaderOptions;
  const [path, ...restPaths] = paths;
  const targetIndex = cascaderOptions.findIndex((c) => c.value === path);
  const isLeaf = restPaths.length === 0;
  if (targetIndex > -1) {
    return [
      ...cascaderOptions.slice(0, targetIndex),
      {
        ...cascaderOptions[targetIndex],
        children: insertFieldsConfigIntoCascaderOption(
          restPaths,
          fieldConfig,
          cascaderOptions[targetIndex].children
        ),
      },
      ...cascaderOptions.slice(targetIndex + 1),
    ];
  } else {
    return [
      ...cascaderOptions,
      {
        label: isLeaf ? getLeafLabel(fieldConfig) : path.replace(/_/g, " "),
        value: path,
        disabled: isLeaf ? fieldConfig.disabled : false,
        children: insertFieldsConfigIntoCascaderOption(
          restPaths,
          fieldConfig,
          []
        ),
        // only add field config in leaf
        ...(paths.length === 1 ? fieldConfig : {}),
      },
    ];
  }
};

export default cascaderBuilder;
