import { ColDef } from "ag-grid-community";

import { RatanSchema } from "./type";

export const ratanSchema2AggridColDef = (rs: RatanSchema): ColDef => {
  return {
    field: rs.schemaKey,
    headerName: rs.schemaLabel,
    width: rs.width,
  };
};
