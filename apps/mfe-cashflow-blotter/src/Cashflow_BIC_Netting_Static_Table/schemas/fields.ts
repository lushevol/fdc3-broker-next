import { RatanSchema } from "src/Root/RatanFrontEndSchema/type";

export const BicStaticSchemas: RatanSchema[] = [
  {
    schemaLabel: "ID",
    schemaKey: "id",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: false,
      },
    ],
  },
  {
    schemaLabel: "Family",
    schemaKey: "family",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Entity FM Id",
    schemaKey: "entityFmId",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Group",
    schemaKey: "group",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Type",
    schemaKey: "type",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Typology",
    schemaKey: "typology",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Strategy",
    schemaKey: "strategy",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Beneficiary BIC",
    schemaKey: "beneficiaryBic",
    dataType: "text",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: true,
      },
    ],
  },
  {
    schemaLabel: "Status",
    schemaKey: "dataStatus",
    dataType: "text",
    properties: [
      {
        id: "2",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: false,
      },
    ],
  },
  {
    schemaLabel: "Updated At",
    schemaKey: "updatedAt",
    dataType: "datetime",
    properties: [
      {
        id: "0",
        module: "beneficiary_bic_netting_static",
        name: "display_in_quick_search",
        value: false,
      },
    ],
  },
];

export const BicStaticAuditSchemas: RatanSchema[] = [
  {
    schemaLabel: "ID",
    schemaKey: "id",
    dataType: "text",
  },
  {
    schemaLabel: "Entity ID",
    schemaKey: "bicEntityId",
    dataType: "text",
  },
  {
    schemaLabel: "Snapshot",
    schemaKey: "snapshot",
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
    schemaLabel: "Family",
    schemaKey: "benBicManipulation.family",
    dataType: "text",
  },
  {
    schemaLabel: "Entity FM Id",
    schemaKey: "benBicManipulation.entityFmId",
    dataType: "text",
  },
  {
    schemaLabel: "Group",
    schemaKey: "benBicManipulation.group",
    dataType: "text",
  },
  {
    schemaLabel: "Type",
    schemaKey: "benBicManipulation.type",
    dataType: "text",
  },
  {
    schemaLabel: "Typology",
    schemaKey: "benBicManipulation.typology",
    dataType: "text",
  },
  {
    schemaLabel: "Strategy",
    schemaKey: "benBicManipulation.strategy",
    dataType: "text",
  },
  {
    schemaLabel: "Beneficiary BIC",
    schemaKey: "benBicManipulation.beneficiaryBic",
    dataType: "text",
  },
  {
    schemaLabel: "Maker ID",
    schemaKey: "benBicManipulation.makerId",
    dataType: "text",
  },
  {
    schemaLabel: "Checker ID",
    schemaKey: "benBicManipulation.checkerId",
    dataType: "text",
  },
  {
    schemaLabel: "Created At",
    schemaKey: "createdAt",
    dataType: "text",
  },
];
