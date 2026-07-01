import { defaultOperators } from "react-querybuilder";

import type { RatanFieldConfig } from "./types";

export const getOperators = (field: RatanFieldConfig) => {
  switch (field.dataType) {
    case "text":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "contains", "in", "notIn"].includes(op.name)
        ),
        { name: "match", value: "match", label: "match" },
      ];
    case "number":
    case "date":
    case "datetime":
    case "time":
      return [
        ...defaultOperators.filter((op) =>
          ["=", "!=", "<=", ">=", "in", "notIn", "between"].includes(op.name)
        ),
      ];
    case "boolean":
      return [...defaultOperators.filter((op) => ["="].includes(op.name))];
    default:
      return defaultOperators;
  }
};
