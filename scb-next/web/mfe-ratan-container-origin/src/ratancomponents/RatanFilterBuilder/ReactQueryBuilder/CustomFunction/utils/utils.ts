import { parseDataType } from "../../../RatanOne/utils/dataType";
import { FieldInput } from "../../types";

interface HydrationResult {
  funName: string | undefined;
  funField: string | undefined;
  param: any[];
  isRegx?: boolean;
}

const LEFT_BRACKET = "(";
const RIGHT_BRACKET = ")";

export const isValidationFunExpression = (value: string | undefined) => {
  // expression must begain with letter and end with bracket
  const REGEX_FUNCTION = /^[A-Za-z]+[(].*[)]$/;

  if (!value) return false;
  return REGEX_FUNCTION.test(value);
};

const parseFunctionExpression = (str) => {
  let result: HydrationResult = {
    funName: undefined,
    funField: "",
    param: [],
  };

  let leftBracketIndex = -1;
  let rightBracketIndex = -1;

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === LEFT_BRACKET) {
      leftBracketIndex = i;
      break;
    }
  }

  if (leftBracketIndex !== -1) {
    for (let i = str.length - 1; i >= leftBracketIndex; i--) {
      if (str.charAt(i) === RIGHT_BRACKET) {
        rightBracketIndex = i;
        break;
      }
    }
  }

  if (leftBracketIndex !== -1 && rightBracketIndex !== -1) {
    result.funName = str.substring(0, leftBracketIndex).trim();
    let paramsStr = str
      .substring(leftBracketIndex + 1, rightBracketIndex)
      .trim();
    let paramsArray = paramsStr.split(",");
    result.funField = paramsArray[0].trim();
    result.param = paramsArray.slice(1).map((param) => param.trim());
  }

  return result;
};

export const hydrationGenerationObj = (value: string | undefined) => {
  if (isValidationFunExpression(value)) {
    return {
      ...parseFunctionExpression(value),
      isRegx: true,
    } as HydrationResult;
  } else {
    return {
      funName: undefined,
      funField: value,
      param: [],
      isRegx: false,
    } as HydrationResult;
  }
};

export const hydrationGenerationField = (value: string) => {
  if (isValidationFunExpression(value)) {
    const field = parseFunctionExpression(value).funField;
    return field;
  } else {
    return value;
  }
};

export const getNewField = (field, props) => {
  const copyField = field as any;
  const { level } = props;
  if (level == 1) {
    return copyField?.value || field;
  } else if (copyField.fn && Object.keys(copyField.fn).length > 0) {
    return copyField.fn?.expression;
  }
  return field;
};

export const generateNewType = (
  rule,
  field,
  props,
  schema,
  inputType,
  functionConfig
) => {
  const copyRule = rule as any;
  const newFieldName = getNewField(field, props);

  const { funField, funName, isRegx } = hydrationGenerationObj(newFieldName);
  const fieldConfig = schema?.fieldMap?.[funField ?? ""] as
    | FieldInput
    | undefined;
  if (copyRule.enrich) {
    const newInputType =
      copyRule.enrich?.resultType.toLowerCase() ||
      (parseDataType(
        fieldConfig?.config?.dataType ?? inputType ?? "text"
      ) as any);
    const fun = parseFunctionExpression(copyRule.enrich.expression);
    const functionObj = functionConfig.find(
      (func) => func.functionName === fun.funName
    );
    const compObj = functionObj?.methodReturnType[0];
    return { newInputType, compObj };
  } else if (isRegx) {
    const functionObj = functionConfig.find(
      (func) => func.functionName === funName
    );
    const compObj = functionObj?.methodReturnType[0];
    const resultType = compObj?.paramType ?? inputType;
    return { newInputType: resultType?.toLowerCase(), compObj };
  } else return { newInputType: inputType, compObj: {} };
};
