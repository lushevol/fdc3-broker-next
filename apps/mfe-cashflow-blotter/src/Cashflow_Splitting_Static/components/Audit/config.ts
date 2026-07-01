import { ColDef } from "ag-grid-community";
import { AutoSplitAuditSchemas } from "src/Cashflow_Splitting_Static/schemas/fields";
import { ratanSchema2AggridColDef } from "src/Root/RatanFrontEndSchema/util";

export const auditDataGridColumnsDef: ColDef[] = [
  ...AutoSplitAuditSchemas.map((k) => ratanSchema2AggridColDef(k)),
];
