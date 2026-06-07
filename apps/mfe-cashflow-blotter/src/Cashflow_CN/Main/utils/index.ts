import { WorkflowActionExtraOptions } from "../common/interface";
import { updateCashflowsByNetid } from "../store/actions/cashflowAction";

// RATAN-10587 query by Cashflow.Netting_Id when netting succ
export const nettingSuccessUpdateCashflowByNettingId = async (
  nettingIds: string[],
  { dispatch }: Pick<WorkflowActionExtraOptions, "dispatch">
) => {
  const result = await dispatch(updateCashflowsByNetid(nettingIds) as any);
  return result;
};

export const formatterBooleanValue = (value: string) => {
  if (value === "true") {
    return "Yes";
  } else if (value === "false") {
    return "No";
  }
  return value;
};

export function label2id(label: string, prefix?: string) {
  return `${prefix ? prefix + "-" : ""}${label
    .toLowerCase()
    .replace(/\./g, "_")}`;
}

// "true", "True", "1", non-0 => true
// "false", "False", "0", 0   => false
export function transformVagueBoolean(val: string | number | boolean) {
  switch (typeof val) {
    case "boolean":
      return val;

    case "string":
      if (["true", "1"].includes(val.toLowerCase())) return true;
      else if (["false", "0"].includes(val.toLowerCase())) return false;
      else {
        throw new Error("unexcept string value");
      }
    case "number":
      return !!val;

    default:
      throw new Error("unexcept type");
  }
}

// returns diff object which only contains different key path with obj2 value.
export const getDiff = <T extends Object>(obj1: T, obj2: T) => {
  const diff = {};
  Object.keys(obj1).forEach((key) => {
    if (
      typeof obj1[key] === "object" &&
      obj1[key] !== null &&
      typeof obj2[key] === "object" &&
      obj2[key] !== null
    ) {
      diff[key] = getDiff(obj1[key], obj2[key]);
    } else if (obj1[key] !== obj2[key]) {
      diff[key] = obj2[key];
    }
  });
  return diff;
};

// { a: 1, b: { c: 2, d: { e: 3 } } } => ["a", "b.c", "b.d.e"]
export const flattenKeys = (obj: Object, prefix: string = ""): string[] => {
  return Object.keys(obj).reduce<string[]>((acc, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nested = flattenKeys(obj[key], path);
      return [...acc, ...nested];
    } else return [...acc, path];
  }, []);
};

export const generateRandomString = () => {
  return window.crypto.getRandomValues(new Uint32Array(1)).at(0) + "";
};

export const emptyOrNilOptional = (val, opt) =>
  ["", null, undefined].includes(val) ? opt : val;

export const isEmptyArray = (target: any) => {
  return target instanceof Array && target.length === 0;
};
