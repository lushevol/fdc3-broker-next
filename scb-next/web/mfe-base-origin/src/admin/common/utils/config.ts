import { AdminDataSetter, AdminRecord } from "../interface";

export const onSaveUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationConfigId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    result.id = result.applicationConfigId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onDeactivateUtil = (
  result: AdminRecord,
  data: AdminRecord[],
  setData: AdminDataSetter
) => {
  if (result?.applicationConfigId) {
    const tempData = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    const index = tempData.findIndex(
      (i) => i.applicationConfigId === result.applicationConfigId
    );
    if (index >= 0) {
      result.id = result.applicationConfigId;
      result.mode = "deactivate";
      tempData[index] = result;
      setData(tempData);
    }
  }
};
