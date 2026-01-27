import React from 'react';
import { useContext } from '../../../hooks/provider';
import { onResetUtil } from '../../common/utils';
import { getCategory } from '../../common/utils/category';
import useServices from '../services/useServices';

const useTableDetail = (categories) => {
  const [store] = useContext();
  const { updateDeclaration, createDeclaration, deleteDeclaration } = useServices();
  const [resetId, setResetId] = React.useState<number>(new Date().getTime());
  const [record, setRecord] = React.useState<any>(undefined);
  const [data, setData] = React.useState<any[]>([]);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Utils implementation locally to avoid dependency on Tile utils if they are specific
  const onSaveUtil = (result, data, setData) => {
    if (result?.appId) {
      // changed from applicationTileId
      const tempData = JSON.parse(JSON.stringify(data));
      result.id = result.appId;
      // result.mode = "new";
      setData([result, ...tempData]);
    }
  };

  const onUpdateUtil = (result, data, setData) => {
    if (result?.appId) {
      const tempData = JSON.parse(JSON.stringify(data));
      const index = tempData.findIndex((i) => i.appId === result.appId);
      if (index >= 0) {
        result.id = result.appId;
        // result.mode = "edit";
        tempData[index] = result;
        setData(tempData);
      }
    }
  };

  const onDeleteUtil = (result, data, setData) => {
    if (result?.appId) {
      const tempData = data.filter((d) => d.appId !== result.appId);
      setData(tempData);
    }
  };

  const onClose = React.useCallback(() => {
    setRecord(undefined);
    setOpenDetail(false);
  }, []);

  const onOpen = React.useCallback(
    (row, mode) => () => {
      const temp = JSON.parse(JSON.stringify(row));
      temp.mode = mode;
      setRecord(temp);
      setOpenDetail(true);
    },
    [],
  );

  const onChange = React.useCallback(
    (value: any, field: string) => {
      const temp = { ...record };
      if (field === 'applicationCategory') {
        value = getCategory(categories, value);
      }
      temp[field] = value;
      setRecord(temp);
    },
    [record, categories],
  );

  const onReset = React.useCallback(() => {
    onResetUtil(data, record, setRecord, setResetId);
  }, [data, record]);

  const onSaveData = React.useCallback(
    async (result) => {
      if (result?.appId) {
        onSaveUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data],
  );

  const onSave = React.useCallback(async () => {
    setIsLoading(true);
    const result = await createDeclaration(store.entitlementsToken, record);
    onSaveData(result);
    setIsLoading(false);
  }, [store.entitlementsToken, record, data]);

  const onUpdateData = React.useCallback(
    async (result) => {
      if (result?.appId) {
        onUpdateUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data],
  );

  const onUpdate = React.useCallback(async () => {
    setIsLoading(true);
    const result = await updateDeclaration(store.entitlementsToken, record);
    onUpdateData(result);
    setIsLoading(false);
  }, [store.entitlementsToken, record, data]);

  const onDelete = React.useCallback(async () => {
    setIsLoading(true);
    const result = await deleteDeclaration(store.entitlementsToken, record);
    onDeleteUtil(result, data, setData);
    setIsLoading(false);
    onClose();
  }, [store.entitlementsToken, record, data]);

  return {
    onClose,
    onOpen,
    openDetail,
    data,
    setData,
    record,
    setRecord,
    onChange,
    onReset,
    onSave,
    onSaveData,
    resetId,
    onUpdate,
    onUpdateData,
    isLoading,
    setIsLoading,
    onDelete,
    setOpenDetail,
  };
};

export default useTableDetail;
