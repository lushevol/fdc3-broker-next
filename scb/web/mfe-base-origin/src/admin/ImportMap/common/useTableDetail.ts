import React from "react";
import useServices from "../services/useServices";
import { useContext } from "../../../hooks/provider";
import { onResetUtil } from "../../common/utils";
import {
  onDeactivateUtil,
  onSaveUtil,
  onUpdateUtil,
  onVerifyUtil,
} from "../../common/utils/importmap";

const useTableDetail = () => {
  const [store] = useContext();
  const {
    updateImportMap,
    verifyImportMap,
    createImportMap,
    deactivateImportMap,
  } = useServices();
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
      if (["verify", "deactivate"].includes(mode)) {
        temp.readOnly = true;
      }
      setRecord(temp);
      setOpenDetail(true);
    },
    []
  );
  const onChange = React.useCallback(
    (value: any, field: string) => {
      const temp = { ...record };
      temp[field] = value;
      setRecord(temp);
    },
    [record]
  );
  const onReset = React.useCallback(() => {
    onResetUtil(data, record, setRecord, setResetId);
  }, [data, record]);
  const onSaveData = React.useCallback(
    async (result) => {
      if (result?.length || result?.updatedBy) {
        onSaveUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data]
  );
  const onSave = React.useCallback(async () => {
    setIsLoading(true);
    const result = await createImportMap(store.entitlementsToken, record);
    onSaveData(result);
    setIsLoading(false);
  }, [store.entitlementsToken, record, data]);
  const onVerify = React.useCallback(async () => {
    setIsLoading(true);
    const result = await verifyImportMap(store.entitlementsToken, record);
    onVerifyUtil(result, data, setData);
    setIsLoading(false);
    onClose();
  }, [store.entitlementsToken, record, data]);
  const onUpdateData = React.useCallback(
    async (result) => {
      if (result?.length || result?.updatedBy) {
        onUpdateUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data]
  );
  const onUpdate = React.useCallback(async () => {
    setIsLoading(true);
    const result = await updateImportMap(store.entitlementsToken, record);
    onUpdateData(result);
    setIsLoading(false);
  }, [store.entitlementsToken, record, data]);
  const onDeactivate = React.useCallback(async () => {
    setIsLoading(true);
    const result = await deactivateImportMap(store.entitlementsToken, record);
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
    onSaveData,
    resetId,
    onVerify,
    onUpdate,
    onUpdateData,
    isLoading,
    onDeactivate,
  };
};

export default useTableDetail;
