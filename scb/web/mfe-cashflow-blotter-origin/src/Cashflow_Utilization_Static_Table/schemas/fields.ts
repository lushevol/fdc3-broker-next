import { RatanSchema } from "src/Root/RatanFrontEndSchema/type";

export const UtilizationStaticSchemas: RatanSchema[] = [
  {
    schemaLabel: "ID",
    schemaKey: "id",
    dataType: "text",
  },
  {
    schemaLabel: "CounterParty FMID",
    schemaKey: "counterpartyFmId",
    dataType: "text",
  },
  {
    schemaLabel: "CounterParty FMCode",
    schemaKey: "counterpartyFmCode",
    dataType: "text",
  },
  {
    schemaLabel: "Entity FMID",
    schemaKey: "entityFmId",
    dataType: "text",
  },
  {
    schemaLabel: "Entity FMCode",
    schemaKey: "entityFmCode",
    dataType: "text",
  },
  {
    schemaLabel: "Auto Util",
    schemaKey: "autoUtil",
    dataType: "text",
  },
  {
    schemaLabel: "Status",
    schemaKey: "dataStatus",
    dataType: "text",
  },
  {
    schemaLabel: "Updated At",
    schemaKey: "updatedAt",
    dataType: "datetime",
  },
];

export const UtilizationStaticAuditSchemas: RatanSchema[] = [
  {
    schemaLabel: "ID",
    schemaKey: "id",
    dataType: "text",
    width: 80,
  },
  {
    schemaLabel: "Entity ID",
    schemaKey: "snapshot.id",
    dataType: "number",
    width: 100,
  },
  {
    schemaLabel: "CounterParty FMID",
    schemaKey: "snapshot.counterpartyFmId",
    dataType: "text",
    width: 180,
  },
  {
    schemaLabel: "CounterParty FMCode",
    schemaKey: "snapshot.counterpartyFmCode",
    dataType: "text",
    width: 180,
  },
  {
    schemaLabel: "Entity FMID",
    schemaKey: "snapshot.entityFmId",
    dataType: "text",
    width: 150,
  },
  {
    schemaLabel: "Entity FMCode",
    schemaKey: "snapshot.entityFmCode",
    dataType: "text",
    width: 150,
  },
  {
    schemaLabel: "Auto Util",
    schemaKey: "snapshot.autoUtil",
    dataType: "text",
    width: 110,
  },
  {
    schemaLabel: "Status",
    schemaKey: "dataStatus",
    dataType: "text",
  },
  {
    schemaLabel: "Maker ID",
    schemaKey: "snapshot.makerId",
    dataType: "text",
    width: 110,
  },
  {
    schemaLabel: "Checker ID",
    schemaKey: "snapshot.checkerId",
    dataType: "text",
    width: 120,
  },
  {
    schemaLabel: "Created At",
    schemaKey: "snapshot.createdAt",
    dataType: "text",
    width: 230,
  },
];
