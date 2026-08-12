import { ColDef } from "ag-grid-community";
import { BicStaticAuditSchemas } from "src/Cashflow_BIC_Netting_Static_Table/schemas/fields";
import { ratanSchema2AggridColDef } from "src/Root/RatanFrontEndSchema/util";

export const auditDataGridColumnsDef: ColDef[] = [
  ...BicStaticAuditSchemas.map((k) => ratanSchema2AggridColDef(k)),
];
