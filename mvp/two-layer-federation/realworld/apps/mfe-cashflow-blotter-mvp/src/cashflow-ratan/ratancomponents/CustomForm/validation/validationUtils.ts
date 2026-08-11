export const convertValue = (value: any) => {
  switch (value) {
    case true:
      return "Y";
    case false:
      return "N";
    default:
      return value;
  }
};

export const setOnChangeFun = (
  subSubItem: any,
  isRequiredObj: any,
  field: string,
  ruleId: number,
  set: any,
  form: any,
  value: any
) => {
  const realValue = convertValue(value);
  let isRequired = true;
  let subRuleId = "";

  subSubItem.rules.forEach((subRule: any) => {
    subRuleId += subRule.value;
    if (subRule.name === "RegExp") {
      if (!new RegExp(subRule.value).test(realValue)) {
        isRequired = false;
      }
    }
  });

  if (isRequiredObj[field]) {
    if (isRequiredObj[field][ruleId]) {
      isRequiredObj[field][ruleId][subRuleId] = isRequired;
    } else {
      isRequiredObj[field][ruleId] = {
        [subRuleId]: isRequired,
      };
    }
  } else {
    isRequiredObj[field] = {
      [ruleId]: {
        [subRuleId]: isRequired,
      },
    };
  }

  set(field, isRequiredObj[field]);
  setTimeout(() => {
    const fieldValue = form.getFieldsValue([field]);
    form.resetFields([field]);
    form.setFieldsValue(fieldValue);
  }, 0);
};
