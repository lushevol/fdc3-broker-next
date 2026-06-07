import { GridApi } from "ag-grid-community";

export const getFieldListFromAggridApi = (api?: GridApi) => {
  if (!api) return [];
  return (
    (api
      ?.getAllDisplayedColumns()
      .map((col) => col.getColDef().field)
      .filter((i) => !!i) as string[]) ?? []
  );
};

export const excludeFieldsFromParams = (obj: Record<string, any>) => {
  const { fields, ...rest } = obj;

  return rest;
};
