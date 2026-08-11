import { deepCloneConfig } from "../../../ratanutils/utils";
import { CommonUtil } from "../../../Root/import/index";
import { CustomFormConfigProps } from "../FormItemComponents";

export const getIsRequired = (isRequired: any) => {
  if (typeof isRequired !== "boolean") {
    let newIsRequired = false;
    for (const key in isRequired) {
      let newSubIsRequired = true;
      for (const subKey in isRequired[key]) {
        if (!isRequired[key][subKey]) {
          newSubIsRequired = false;
        }
      }
      if (newSubIsRequired) {
        newIsRequired = true;
      }
    }

    return newIsRequired;
  }
  return isRequired;
};

export const copyConfig = (config: CustomFormConfigProps[]) => {
  return config.map((item) => {
    return deepCloneConfig(item);
  });
};

export const getRules = (rules: any, isRequiredObj: any) => {
  const newRules: any[] = [];

  rules.forEach((item: any) => {
    if (CommonUtil.isNumber(item.ruleId)) {
      let newSubIsRequired = true;
      for (const subKey in isRequiredObj[item.ruleId]) {
        if (!isRequiredObj[item.ruleId][subKey]) {
          newSubIsRequired = false;
        }
      }
      if (newSubIsRequired) {
        newRules.push(item);
      }
    } else {
      newRules.push(item);
    }
  });

  return newRules;
};
