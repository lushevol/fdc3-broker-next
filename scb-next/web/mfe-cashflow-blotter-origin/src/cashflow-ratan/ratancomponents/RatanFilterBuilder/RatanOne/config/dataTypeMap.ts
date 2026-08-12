import { RatanFieldType } from "../type";

export const standardFieldType: RatanFieldType[] = [
  "text",
  "number",
  "boolean",
  "date",
  "datetime",
  "time",
];

export const customDataTypeMapping: {
  custom: string[];
  standard: RatanFieldType;
}[] = [
  {
    custom: ["string", "xsd:normalizedstring", "varchar"],
    standard: "text",
  },
  {
    custom: ["decimal", "integer", "xsd:decimal"],
    standard: "number",
  },
  {
    custom: [],
    standard: "boolean",
  },
  {
    custom: ["date-format", "xsd:date"],
    standard: "date",
  },
  {
    custom: ["date-time-format", "timestamp"],
    standard: "datetime",
  },
  {
    custom: ["time-format"],
    standard: "time",
  },
];
