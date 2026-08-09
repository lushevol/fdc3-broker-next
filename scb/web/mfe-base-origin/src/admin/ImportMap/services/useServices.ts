import React from "react";
import { postService } from "../../../hooks/service";
import { ActionType } from "../../../hooks/reducer/util/ActionType";
import { getHooksBase } from "../../../hooks/HooksBase";
const useServices = () => {
  const { baseDispatch } = getHooksBase();
  const getImportMapRef = React.useRef<any>();
  const getImportMapAuditRef = React.useRef<any>();
  const updateImportMapRef = React.useRef<any>();
  const verifyImportMapRef = React.useRef<any>();
  const createImportMapRef = React.useRef<any>();
  const deactivateImportMapRef = React.useRef<any>();
  const dispacthErrorMessage = React.useCallback((msg) => {
    baseDispatch({ type: ActionType.SET_ERRORMSG, data: { errorMsg: msg } });
  }, []);
  const getImportMap = React.useCallback(async (entitlementsToken) => {
    try {
      dispacthErrorMessage(undefined);
      if (getImportMapRef?.current) {
        getImportMapRef?.current?.abort();
      }
      getImportMapRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/importmap/data",
        { entitlementsToken: entitlementsToken },
        { signal: getImportMapRef?.current.signal }
      );
      return resposnse?.data?.data ?? [];
    } catch (e) {}
    return [];
  }, []);
  const getImportMapAudit = React.useCallback(
    async (entitlementsToken, data) => {
      try {
        dispacthErrorMessage(undefined);
        if (getImportMapAuditRef?.current) {
          getImportMapAuditRef?.current?.abort();
        }
        getImportMapAuditRef.current = new AbortController();
        const resposnse = await postService(
          "/auth/v1/fmo/admin/importmap/audit",
          { entitlementsToken: entitlementsToken, ...data },
          { signal: getImportMapAuditRef?.current.signal }
        );
        return resposnse?.data?.data ?? [];
      } catch (e) {}
      return [];
    },
    []
  );
  const updateImportMap = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (updateImportMapRef?.current) {
        updateImportMapRef?.current?.abort();
      }
      updateImportMapRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/importmap/update",
        { entitlementsToken: entitlementsToken, ...data, mode: "maker" },
        { signal: updateImportMapRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
  }, []);
  const verifyImportMap = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (verifyImportMapRef?.current) {
        verifyImportMapRef?.current?.abort();
      }
      verifyImportMapRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/importmap/update",
        { entitlementsToken: entitlementsToken, ...data, mode: "checker" },
        { signal: verifyImportMapRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
  }, []);
  const deactivateImportMap = React.useCallback(
    async (entitlementsToken, data) => {
      try {
        dispacthErrorMessage(undefined);
        if (deactivateImportMapRef?.current) {
          deactivateImportMapRef?.current?.abort();
        }
        deactivateImportMapRef.current = new AbortController();
        const resposnse = await postService(
          "/auth/v1/fmo/admin/importmap/update",
          { entitlementsToken: entitlementsToken, ...data, mode: "deactivate" },
          { signal: deactivateImportMapRef?.current.signal }
        );
        return resposnse?.data?.data ?? {};
      } catch (e) {}
      return [];
    },
    []
  );
  const createImportMap = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (createImportMapRef?.current) {
        createImportMapRef?.current?.abort();
      }
      createImportMapRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/importmap/create",
        { entitlementsToken: entitlementsToken, ...data },
        { signal: createImportMapRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
  }, []);
  return {
    getImportMap,
    updateImportMap,
    verifyImportMap,
    createImportMap,
    deactivateImportMap,
    getImportMapAudit,
  };
};

export default useServices;
