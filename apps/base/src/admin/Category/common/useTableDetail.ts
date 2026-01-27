import React from 'react';
import { useContext } from '../../../hooks/provider';
import { onResetUtil } from '../../common/utils';
import {
  onDeactivateUtil,
  onSaveUtil,
  onUpdateUtil,
  onVerifyUtil,
} from '../../common/utils/category';
import useServices from '../services/useServices';

const useTableDetail = () => {
  const [store] = useContext();
  const { updateCategory, verifyCategory, createCategory, deactivateCategory } = useServices();
  const [resetId, setResetId] = React.useState<number>(new Date().getTime());
  const [record, setRecord] = React.useState<any>(undefined);
  const [data, setData] = React.useState<any[]>([]);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const onClose = React.useCallback(() => {
    setRecord(undefined);
    setOpenDetail(false);
  }, []);
  const onOpen = React.useCallback(
    (row, mode) => () => {
      const temp = JSON.parse(JSON.stringify(row));
      temp.mode = mode;
      if (['verify', 'deactivate'].includes(mode)) {
        temp.readOnly = true;
      }
      setRecord(temp);
      setOpenDetail(true);
    },
    [],
  );
  const onChange = React.useCallback(
    (value: any, field: string) => {
      const temp = { ...record };
      temp[field] = value;
      setRecord(temp);
    },
    [record],
  );
  const onReset = React.useCallback(() => {
    onResetUtil(data, record, setRecord, setResetId);
  }, [data, record]);
  const onSave = React.useCallback(async () => {
    setIsLoading(true);
    const result = await createCategory(store.entitlementsToken, record);
    onSaveUtil(result, data, setData);
    setIsLoading(false);
    onClose();
  }, [store.entitlementsToken, record, data]);
  const onVerify = React.useCallback(async () => {
    setIsLoading(true);
    const result = await verifyCategory(store.entitlementsToken, record);
    onVerifyUtil(result, data, setData);
    setIsLoading(false);
    onClose();
  }, [store.entitlementsToken, record, data]);
  const onUpdate = React.useCallback(async () => {
    setIsLoading(true);
    const result = await updateCategory(store.entitlementsToken, record);
    onUpdateUtil(result, data, setData);
    setIsLoading(false);
    onClose();
  }, [store.entitlementsToken, record, data]);
  const onDeactivate = React.useCallback(async () => {
    setIsLoading(true);
    const result = await deactivateCategory(store.entitlementsToken, record);
    onDeactivateUtil(result, data, setData);
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
    resetId,
    onVerify,
    onUpdate,
    isLoading,
    onDeactivate,
  };
};

export default useTableDetail;
