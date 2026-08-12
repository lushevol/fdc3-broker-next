import { defaultOperators } from "react-querybuilder";

import type { RatanFieldConfig } from "./types";

export const getOperators = (field: RatanFieldConfig) => {
  if (field.indexedTerm === "Country")
    return defaultOperators.filter((op) => ["=", "in"].includes(op.name));
  switch (field.dataType) {
    case "boolean":
      return [...defaultOperators.filter((op) => ["="].includes(op.name))];
    case "text":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "contains", "in", "notIn"].includes(op.name)
        ),
      ];
    case "time":
    case "date":
    case "number":
    case "datetime":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "<=", ">=", "in", "notIn", "between"].includes(op.name)
        ),
      ];
    default:
      return defaultOperators;
  }
};
