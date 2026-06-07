import { TransformQueryOptions } from "react-querybuilder";
import { Operator } from "src/generated/types.generated";

type OperatorType = `${Operator}`;

const operatorMap: Record<string, OperatorType> = {
  "=": "EQ",
  "!=": "NE",
  "<": "LT",
  ">": "GT",
  "<=": "LTE",
  ">=": "GTE",
  contains: "LIKE",
  in: "IN",
  notIn: "NOTIN",
  between: "BET",
  match: "MATCH",
};

const combinatorMap = {
  and: "&&",
  or: "||",
};

export const transformQueryOptions: TransformQueryOptions = {
  operatorMap,
  combinatorMap,
};
