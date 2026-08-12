import { CustomFormGroupConfigProps, RowConfigProps } from "../interface";
import { CustomFormConfigProps } from "../../CustomForm/FormItemComponents";

export const collectFieldsFromGroupConfig = (
  groups: CustomFormGroupConfigProps[]
): string[] => {
  const fields: string[] = [];

  const visitRows = (rows: RowConfigProps[]) => {
    rows.forEach((row) => {
      row.itemConfig?.forEach((item) => {
        if (item.field) {
          fields.push(item.field);
        }
      });

      row.childGroup?.forEach((cg) => visitRows(cg.row));
    });
  };

  groups.forEach((group) => {
    visitRows(group.row);
  });

  return fields;
};

export const findGroupConfigItemByField = (
  config: CustomFormGroupConfigProps[],
  field: string
): CustomFormConfigProps | undefined => {
  const findInRows = (
    rows: RowConfigProps[]
  ): CustomFormConfigProps | undefined => {
    for (const row of rows) {
      const item = row.itemConfig?.find((i) => i.field === field);
      if (item) return item;

      if (row.childGroup) {
        for (const child of row.childGroup) {
          const found = findInRows(child.row);
          if (found) return found;
        }
      }
    }
    return undefined;
  };

  for (const group of config) {
    const found = findInRows(group.row);
    if (found) return found;
  }

  return undefined;
};
