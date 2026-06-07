import { ColDef } from "ag-grid-community";
import { ratanSchema2AggridColDef } from "src/Root/RatanFrontEndSchema/util";

import { UtilizationStaticAuditSchemas } from "../../schemas/fields";

export const auditDataGridColumnsDef: ColDef[] = [
  ...UtilizationStaticAuditSchemas.map((k) => ratanSchema2AggridColDef(k)),
];
