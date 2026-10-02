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
import { AdminRecord } from "../../common/interface";

const useTableDetail = () => {
  const [store] = useContext();
  const {
    updateImportMap,
    verifyImportMap,
    createImportMap,
    deactivateImportMap,
  } = useServices();
  const [resetId, setResetId] = React.useState<number>(new Date().getTime());
  const [record, setRecord] = React.useState<AdminRecord>();
  const [data, setData] = React.useState<AdminRecord[]>([]);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const onClose = React.useCallback(() => {
    setRecord(undefined);
    setOpenDetail(false);
  }, []);
  const onOpen = React.useCallback(
    (row: AdminRecord, mode: string) => () => {
      const temp = JSON.parse(JSON.stringify(row)) as AdminRecord;
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
    (value: unknown, field: string) => {
      const temp = { ...record };
      temp[field] = value;
      setRecord(temp);
    },
    [record]
  );
  const onReset = React.useCallback(() => {
    if (record) onResetUtil(data, record, setRecord, setResetId);
  }, [data, record]);
  const onSaveData = React.useCallback(
    async (result: AdminRecord) => {
      if (result?.length || result?.updatedBy) {
        onSaveUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data]
  );
  // Axios reports request failures; errors in successful response processing must still propagate.
  const onSave = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    try {
      await createImportMap(store.entitlementsToken, record).then(onSaveData, () => undefined);
    } finally {
      setIsLoading(false);
    }
  }, [store.entitlementsToken, record, data]);
  const onVerify = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    try {
      await verifyImportMap(store.entitlementsToken, record).then(
        (result) => {
          onVerifyUtil(result, data, setData);
          onClose();
        },
        () => undefined,
      );
    } finally {
      setIsLoading(false);
    }
  }, [store.entitlementsToken, record, data]);
  const onUpdateData = React.useCallback(
    async (result: AdminRecord) => {
      if (result?.length || result?.updatedBy) {
        onUpdateUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data]
  );
  const onUpdate = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    try {
      await updateImportMap(store.entitlementsToken, record).then(onUpdateData, () => undefined);
    } finally {
      setIsLoading(false);
    }
  }, [store.entitlementsToken, record, data]);
  const onDeactivate = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    try {
      await deactivateImportMap(store.entitlementsToken, record).then(
        (result) => {
          onDeactivateUtil(result, data, setData);
          onClose();
        },
        () => undefined,
      );
    } finally {
      setIsLoading(false);
    }
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
