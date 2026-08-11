import { AdminDataSetter, AdminRecord } from "../interface";

export const onSaveUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    result.id = result.applicationTileId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onVerifyUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationTileId === result.applicationTileId
    );
    if (index >= 0) {
      result.id = result.applicationTileId;
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
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationTileId === result.applicationTileId
    );
    if (index >= 0) {
      result.id = result.applicationTileId;
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
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationTileId === result.applicationTileId
    );
    if (index >= 0) {
      result.id = result.applicationTileId;
      result.mode = "deactivate";
      tempData[index] = result;
      setData(tempData);
    }
  }
};
