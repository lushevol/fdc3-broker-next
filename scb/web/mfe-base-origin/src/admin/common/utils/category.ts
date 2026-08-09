export const onSaveUtil = (result, data, setData) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data));
    result.id = result.applicationCategoryId;
    result.mode = "new";
    setData([result, ...tempData]);
  }
};

export const onVerifyUtil = (result, data, setData) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data));
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

export const onUpdateUtil = (result, data, setData) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data));
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

export const onDeactivateUtil = (result, data, setData) => {
  if (result?.applicationCategoryId) {
    const tempData = JSON.parse(JSON.stringify(data));
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

export const getCategory = (categories, value) => {
  const index = categories.findIndex((e) => e.label === value);
  if (index >= 0) {
    return categories[index];
  } else {
    return "";
  }
};
