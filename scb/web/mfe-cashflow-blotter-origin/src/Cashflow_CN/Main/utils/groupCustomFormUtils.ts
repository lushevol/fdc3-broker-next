type UpdateFieldInGroupConfigParams = {
  config: CustomFormGroupConfigProps[];
  value: any;
  form?: any;
  groupTitleUpdaterMap?: Record<
    string,
    (group: CustomFormGroupConfigProps, value: any, form?: any) => void
  >;
  itemUpdaterMap?: Record<
    string,
    (item: CustomFormConfigProps, value: any, form?: any) => void
  >;
};

export const updateFieldInGroupConfig = ({
  config,
  value,
  form,
  groupTitleUpdaterMap = {},
  itemUpdaterMap = {},
}: UpdateFieldInGroupConfigParams) => {
  const updateGroupTitles = (group: CustomFormGroupConfigProps) => {
    for (const prefix in groupTitleUpdaterMap) {
      if (group.title?.startsWith(prefix)) {
        groupTitleUpdaterMap[prefix](group, value, form);
      }
    }
  };

  const updateItemsInRow = (row: RowConfigProps) => {
    if (!row.itemConfig) {
      return;
    }

    for (const item of row.itemConfig) {
      const updater = itemUpdaterMap[item.field];
      if (updater) {
        updater(item, value, form);
      }
    }
  };

  const updateChildGroups = (row: RowConfigProps) => {
    if (!row.childGroup) {
      return;
    }

    for (const child of row.childGroup) {
      processGroups([child]);
    }
  };

  const processRows = (rows: RowConfigProps[]) => {
    for (const row of rows) {
      updateItemsInRow(row);
      updateChildGroups(row);
    }
  };

  const processGroups = (groups: CustomFormGroupConfigProps[]) => {
    for (const group of groups) {
      updateGroupTitles(group);
      processRows(group.row);
    }
  };

  processGroups(config);
};

/**
 * Find the form item config by field name from group config
 */
export const findGroupConfigItemByField = (
  config: CustomFormGroupConfigProps[],
  field: string
): CustomFormConfigProps | undefined => findInGroups(config, field);

/**
 * Find the form item config by field name from rows config
 */
export const findInRowsByField = (
  rows: RowConfigProps[],
  field: string
): CustomFormConfigProps | undefined => {
  for (const row of rows) {
    const item = row.itemConfig?.find((i) => i.field === field);
    if (item) return item;
    const nestedItem = row.childGroup && findInGroups(row.childGroup, field);
    if (nestedItem) return nestedItem;
  }

  return undefined;
};

/**
 * Find the form item config by field name from group config, with group support
 */
export const findInGroups = (
  groups: CustomFormGroupConfigProps[],
  field: string
): CustomFormConfigProps | undefined => {
  for (const group of groups) {
    const found = findInRowsByField(group.row, field);
    if (found) return found;
  }

  return undefined;
};
