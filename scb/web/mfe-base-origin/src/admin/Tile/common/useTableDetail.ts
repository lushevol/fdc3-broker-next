import React from "react";
import useServices from "../services/useServices";
import { useContext } from "../../../hooks/provider";
import { onResetUtil } from "../../common/utils";
import {
  onDeactivateUtil,
  onSaveUtil,
  onUpdateUtil,
  onVerifyUtil,
} from "../../common/utils/tile";
import { getImportMap } from "../../common/utils/importmap";
import { getCategory } from "../../common/utils/category";
import { AdminRecord } from "../../common/interface";

const useTableDetail = (
  categories: AdminRecord[],
  importMap: AdminRecord[]
) => {
  const [store] = useContext();
  const { updateTile, verifyTile, createTile, deactivateTile } = useServices();
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
      if (field === "importMap" && typeof value === "string") {
        value = getImportMap(importMap, value);
      }
      if (field === "applicationCategory" && typeof value === "string") {
        value = getCategory(categories, value);
      }
      temp[field] = value;
      setRecord(temp);
    },
    [record, importMap, categories]
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
    [store.entitlementsToken, record, data, importMap]
  );
  const onSave = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    const result = await createTile(store.entitlementsToken, record);
    onSaveData(result);
    setIsLoading(false);
  }, [store.entitlementsToken, record, data, importMap]);
  const onVerify = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    const result = await verifyTile(store.entitlementsToken, record);
    onVerifyUtil(result, data, setData);
    setIsLoading(false);
    onClose();
  }, [store.entitlementsToken, record, data]);
  const onUpdateData = React.useCallback(
    async (result: AdminRecord) => {
      if (result?.length || result?.updatedBy) {
        onUpdateUtil(result, data, setData);
        onClose();
      }
    },
    [store.entitlementsToken, record, data, importMap]
  );
  const onUpdate = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    const result = await updateTile(store.entitlementsToken, record);
    onUpdateData(result);
    setIsLoading(false);
  }, [store.entitlementsToken, record, data, importMap]);
  const onDeactivate = React.useCallback(async () => {
    if (!record) return;
    setIsLoading(true);
    const result = await deactivateTile(store.entitlementsToken, record);
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
