import _cloneDeep from "lodash/cloneDeep";
import _get from "lodash/get";

const isSameRecord = <T>(a: T, b: T, rowKey: string) => {
  return _get(a, rowKey) === _get(b, rowKey);
};

const noDataToChange = (props) => {
  const { dataToUpdates, dataToDelete } = props;
  return dataToUpdates.length === 0 && dataToDelete.length === 0;
};

const noChangeDatas = <T>(
  updatedDatas: T[],
  addedDatas: T[],
  deletedDatas: T[]
) => {
  return !updatedDatas.length && !addedDatas.length && !deletedDatas.length;
};

export const consumeNotification = async <T>(props: {
  getCurrentTableDatas: () => Promise<T[]>;
  dataToUpdates: T[];
  dataToDelete: T[];
  rowKey: string;
  isDataUpdated: (origin: T, newone: T) => boolean;
}): Promise<{
  isUpdate: boolean;
  addedDatas?: T[];
  updatedDatas?: T[];
  deletedDatas?: T[];
  newTableDatas?: T[];
  originDatasBeUpdated?: T[];
  paginationSizeOffset?: number;
}> => {
  const {
    getCurrentTableDatas,
    dataToUpdates,
    dataToDelete,
    rowKey = "id",
    isDataUpdated,
  } = props;
  if (noDataToChange(props))
    return {
      isUpdate: false,
    };
  const blotterdataList = await getCurrentTableDatas();
  const updatedDatas: T[] = [];
  const deletedDatas: T[] = [];
  const newDataList = _cloneDeep(blotterdataList) as T[];
  const originDatasBeUpdated: T[] = [];
  for (let i = 0; i < newDataList.length; i++) {
    const originData = newDataList[i];
    if (dataToUpdates.length) {
      const targetFilteredIndex = dataToUpdates.findIndex((r) =>
        isSameRecord(r, originData, rowKey)
      );
      if (targetFilteredIndex > -1) {
        const targetFilteredData = dataToUpdates.at(targetFilteredIndex) as T;
        dataToUpdates.splice(targetFilteredIndex, 1);
        if (isDataUpdated(originData, targetFilteredData)) {
          updatedDatas.push(targetFilteredData);
          originDatasBeUpdated.push(newDataList[i]);
          newDataList[i] = targetFilteredData;
        }
      }
    }

    if (
      dataToDelete.length &&
      dataToDelete?.findIndex((r) => isSameRecord(r, originData, rowKey)) > -1
    ) {
      const targetDroppedIndex = dataToDelete.findIndex((r) =>
        isSameRecord(r, originData, rowKey)
      );
      const targetDroppedData = dataToDelete.at(targetDroppedIndex) as T;
      deletedDatas.push(targetDroppedData);
    }
  }
  const addedDatas: T[] = dataToUpdates;
  if (noChangeDatas(updatedDatas, addedDatas, deletedDatas))
    return {
      isUpdate: false,
    };

  const deletedDatasIds = deletedDatas.map((c) => _get(c, rowKey));
  const newBlotterDatas = [
    ...addedDatas,
    ...newDataList.filter((c) => !deletedDatasIds.includes(_get(c, rowKey))),
  ];

  let paginationSizeIncrease = addedDatas.length;

  const paginationSizeOffset = paginationSizeIncrease - deletedDatas.length;

  return {
    isUpdate: true,
    addedDatas,
    updatedDatas,
    deletedDatas,
    originDatasBeUpdated,
    newTableDatas: newBlotterDatas,
    paginationSizeOffset,
  };
};
