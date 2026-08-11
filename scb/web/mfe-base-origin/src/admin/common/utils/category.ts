import { AdminDataSetter, AdminRecord } from "../interface";

export const onSaveUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    result.id = result.applicationCategoryId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onVerifyUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationCategoryId === result.applicationCategoryId
    );
    if (index >= 0) {
      result.id = result.applicationCategoryId;
      result.mode = "verify";
      tempData[index] = result;
      setData(tempData);
    }
  }
};

export const onUpdateUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationCategoryId === result.applicationCategoryId
    );
    if (index >= 0) {
      result.id = result.applicationCategoryId;
      result.mode = "edit";
      tempData[index] = result;
      setData(tempData);
    }
  }
};

export const onDeactivateUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationCategoryId === result.applicationCategoryId
    );
    if (index >= 0) {
      result.id = result.applicationCategoryId;
      result.mode = "deactivate";
      tempData[index] = result;
      setData(tempData);
    }
  }
};

export const getCategory = (categories: AdminRecord[], value: string) => {
  const index = categories.findIndex((e) => e.label === value);
  if (index >= 0) {
    return categories[index];
  } else {
    return "";
  }
};
