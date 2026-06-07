import { RatanSchema } from "src/Root/RatanFrontEndSchema/type";

export const AutoSplitAuditSchemas: RatanSchema[] = [
  {
    schemaLabel: "ID",
    schemaKey: "id",
    dataType: "text",
  },
  {
    schemaLabel: "Rule ID",
    schemaKey: "ruleUniqueId",
    dataType: "text",
  },
  {
    schemaLabel: "Status",
    schemaKey: "dataStatus",
    dataType: "text",
  },
  {
    schemaLabel: "User Id",
    schemaKey: "userId",
    dataType: "text",
  },
  {
    schemaLabel: "Booking Entity FMID",
    schemaKey: "splittingManipulation.entityFmId",
    dataType: "text",
  },
  {
    schemaLabel: "Booking Entity FMCODE",
    schemaKey: "splittingManipulation.entityFmCode",
    dataType: "text",
  },
  {
    schemaLabel: "Nostro Agent",
    schemaKey: "splittingManipulation.nostroAgent",
    dataType: "text",
  },
  {
    schemaLabel: "Currency",
    schemaKey: "splittingManipulation.currency",
    dataType: "text",
  },
  {
    schemaLabel: "Threshold",
    schemaKey: "splittingManipulation.threshold",
    dataType: "text",
  },
  {
    schemaLabel: "Amount",
    schemaKey: "splittingManipulation.amount",
    dataType: "text",
  },
  {
    schemaLabel: "Limitation",
    schemaKey: "splittingManipulation.limitation",
    dataType: "text",
  },
  {
    schemaLabel: "Maker ID",
    schemaKey: "splittingManipulation.makerId",
    dataType: "text",
  },
  {
    schemaLabel: "Checker ID",
    schemaKey: "splittingManipulation.checkerId",
    dataType: "text",
  },
  {
    schemaLabel: "Created At",
    schemaKey: "createdAt",
    dataType: "text",
  },
];
