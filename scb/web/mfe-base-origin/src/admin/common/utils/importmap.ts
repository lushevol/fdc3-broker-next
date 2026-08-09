export const onSaveUtil = (result, data, setData) => {
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data));
    result.id = result.importMapId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onVerifyUtil = (result, data, setData) => {
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data));
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

export const onUpdateUtil = (result, data, setData) => {
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data));
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

export const onDeactivateUtil = (result, data, setData) => {
  if (result?.importMapId) {
    const tempData = JSON.parse(JSON.stringify(data));
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

export const getImportMap = (importMap, value) => {
  const index = importMap.findIndex((e) => e.keyName === value);
  if (index >= 0) {
    return importMap[index];
  } else {
    return "";
  }
};
