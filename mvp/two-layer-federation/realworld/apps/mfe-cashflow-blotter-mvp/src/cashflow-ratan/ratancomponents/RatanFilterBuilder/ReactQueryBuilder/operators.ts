import { defaultOperators } from "react-querybuilder";

export const defaultOperatorsOnValueSourceisField = [
  ...defaultOperators.filter((op) =>
    ["=", "!=", "<", ">", "<=", ">="].includes(op.name)
  ),
];
