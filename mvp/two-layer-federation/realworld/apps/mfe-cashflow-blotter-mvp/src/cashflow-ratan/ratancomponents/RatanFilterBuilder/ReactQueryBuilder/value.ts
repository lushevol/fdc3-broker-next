import { Field, RuleType } from "react-querybuilder";
import type {
  ValueEditorSuperType,
  OperatorNameSuperType,
  CustomFunFieldType,
} from "./types";
import { hydrationGenerationField } from "./CustomFunction/utils/utils";
const handelValues = (values: Field["values"]) => {
  return values?.length ? "multiselect" : "multiselectWithoutOptions";
};

export const generateGetValueEditorType =
  (fields: Field[]) =>
  (
    fieldName: string | CustomFunFieldType,
    operator: OperatorNameSuperType
  ): ValueEditorSuperType | null => {
    /**
     * @description: When choose function name then filedName will be as expression need to generate to normal name.
     */
    const newFieldName =
      typeof fieldName === "string" ? fieldName : fieldName?.value ?? "";
    const hydrateFieldName = hydrationGenerationField(newFieldName);
    const field = fields.find((item) => item.name === hydrateFieldName);
    const { inputType = "text", values = [] } = field ?? {};

    switch (inputType) {
      case "text":
        switch (operator) {
          case "notIn":
          case "in":
            return handelValues(values);
          case "matches":
          case "notMatches":
            return "regExpInput";
          default:
            break;
        }
        break;

      case "number":
        switch (operator) {
          case "notIn":
          case "in":
            return "multipleinputnumber";
          default:
            break;
        }
        break;
      case "date":
      case "datetime":
      case "time":
        switch (operator) {
          case "notIn":
          case "in":
            return "multipledatepicker";
          default:
            break;
        }
        break;
      case "boolean":
        return Array.isArray(values) && values.length > 0 ? "radio" : "text";
      default:
        break;
    }
    return null;
  };

export const getDefaultValue = (rule: RuleType) => {
  return "";
};
