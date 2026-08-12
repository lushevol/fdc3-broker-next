import { defaultOperators } from "react-querybuilder";
import { RatanFieldConfig } from "../../RatanFilterBuilder/RatanOne/type";
import { operatorLabelMap } from "./converter";

export const getOperators = (field: RatanFieldConfig) => {
  switch (field.dataType) {
    case "number":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "in", "notIn", "between"].includes(op.name)
        ),
        { name: "<", label: "LESS" },
        { name: ">", label: "GREATER" },
        { name: "<=", label: "LESS OR ON" },
        { name: ">=", label: "GREATER OR ON" },
      ];
    case "boolean":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "null", "notNull"].includes(op.name)
        ),
      ];
    case "date":
    case "datetime":
    case "time":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "in", "notIn", "between"].includes(op.name)
        ),
        { name: "<", label: "EARLIER" },
        { name: ">", label: "LATER" },
        { name: "<=", label: "EARLIER OR ON" },
        { name: ">=", label: "LATER OR ON" },
      ];
    default:
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "contains", "in", "notIn", "null", "notNull"].includes(
            op.name
          )
        ),
      ];
  }
};

export const handleOperators = (field: RatanFieldConfig) => {
  const operators = getOperators(field);
  return operators.map((item) => {
    return {
      ...item,
      label: operatorLabelMap[item.name] || item.label,
    };
  });
};
