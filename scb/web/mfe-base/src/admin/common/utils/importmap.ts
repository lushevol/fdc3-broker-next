import { AdminDataSetter, AdminRecord } from "../interface";

export const onSaveUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    result.id = result.importMapId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onVerifyUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.importMapId === result.importMapId
    );
    if (index >= 0) {
      result.id = result.importMapId;
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
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.importMapId === result.importMapId
    );
    if (index >= 0) {
      result.id = result.importMapId;
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
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.importMapId === result.importMapId
    );
    if (index >= 0) {
      result.id = result.importMapId;
      result.mode = "deactivate";
      tempData[index] = result;
      setData(tempData);
    }
  }
};

export const getImportMap = (importMap: AdminRecord[], value: string) => {
  const index = importMap.findIndex((e) => e.keyName === value);
  if (index >= 0) {
    return importMap[index];
  } else {
    return "";
  }
};
