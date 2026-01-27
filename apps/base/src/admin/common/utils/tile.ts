export const onSaveUtil = (result, data, setData) => {
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data));
    result.id = result.applicationTileId;
    result.mode = 'new';
    setData([result, ...tempData]);
  }
};

export const onVerifyUtil = (result, data, setData) => {
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data));
    const index = tempData.findIndex((i) => i.applicationTileId === result.applicationTileId);
    if (index >= 0) {
      result.id = result.applicationTileId;
      result.mode = 'verify';
      tempData[index] = result;
      setData(tempData);
    }
  }
};

export const onUpdateUtil = (result, data, setData) => {
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data));
    const index = tempData.findIndex((i) => i.applicationTileId === result.applicationTileId);
    if (index >= 0) {
      result.id = result.applicationTileId;
      result.mode = 'edit';
      tempData[index] = result;
      setData(tempData);
    }
  }
};

export const onDeactivateUtil = (result, data, setData) => {
  if (result?.applicationTileId) {
    const tempData = JSON.parse(JSON.stringify(data));
    const index = tempData.findIndex((i) => i.applicationTileId === result.applicationTileId);
    if (index >= 0) {
      result.id = result.applicationTileId;
      result.mode = 'deactivate';
      tempData[index] = result;
      setData(tempData);
    }
  }
};
