export const onSaveUtil = (result, data, setData) => {
  if (result?.applicationConfigId) {
    const tempData = JSON.parse(JSON.stringify(data));
    result.id = result.applicationConfigId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onDeactivateUtil = (result, data, setData) => {
  if (result?.applicationConfigId) {
    const tempData = JSON.parse(JSON.stringify(data));
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
