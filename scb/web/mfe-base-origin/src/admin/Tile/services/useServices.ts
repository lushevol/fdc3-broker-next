import React from "react";
import { postService } from "../../../hooks/service";
import { ActionType } from "../../../hooks/reducer/util/ActionType";
import { getHooksBase } from "../../../hooks/HooksBase";
const useServices = () => {
  const { baseDispatch } = getHooksBase();
  const getCategoryRef = React.useRef<any>();
  const getTileRef = React.useRef<any>();
  const getTileAuditRef = React.useRef<any>();
  const updateTileRef = React.useRef<any>();
  const verifyTileRef = React.useRef<any>();
  const createTileRef = React.useRef<any>();
  const deactivateTileRef = React.useRef<any>();
  const getImportMapRef = React.useRef<any>();
  const dispacthErrorMessage = React.useCallback((msg) => {
    baseDispatch({ type: ActionType.SET_ERRORMSG, data: { errorMsg: msg } });
  }, []);
  const getCategory = React.useCallback(async (entitlementsToken) => {
    try {
      dispacthErrorMessage(undefined);
      if (getCategoryRef?.current) {
        getCategoryRef?.current?.abort();
      }
      getCategoryRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/category/data",
        { entitlementsToken: entitlementsToken },
        { signal: getCategoryRef?.current.signal }
      );
      return resposnse?.data?.data ?? [];
    } catch (e) {}
    return [];
  }, []);
  const getTile = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (getTileRef?.current) {
        getTileRef?.current?.abort();
      }
      getTileRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/tile/data",
        { entitlementsToken: entitlementsToken, ...data },
        { signal: getTileRef?.current.signal }
      );
      return resposnse?.data?.data ?? [];
    } catch (e) {}
    return [];
  }, []);
  const getTileAudit = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (getTileAuditRef?.current) {
        getTileAuditRef?.current?.abort();
      }
      getTileAuditRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/tile/audit",
        { entitlementsToken: entitlementsToken, ...data },
        { signal: getTileAuditRef?.current.signal }
      );
      return resposnse?.data?.data ?? [];
    } catch (e) {}
    return [];
  }, []);
  const updateTile = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (updateTileRef?.current) {
        updateTileRef?.current?.abort();
      }
      updateTileRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/tile/update",
        {
          entitlementsToken: entitlementsToken,
          subtitle: "",
          ...data,
          mode: "maker",
        },
        { signal: updateTileRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
  }, []);
  const verifyTile = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (verifyTileRef?.current) {
        verifyTileRef?.current?.abort();
      }
      verifyTileRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/tile/update",
        {
          entitlementsToken: entitlementsToken,
          subtitle: "",
          ...data,
          mode: "checker",
        },
        { signal: verifyTileRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
  }, []);
  const deactivateTile = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (deactivateTileRef?.current) {
        deactivateTileRef?.current?.abort();
      }
      deactivateTileRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/tile/update",
        { entitlementsToken: entitlementsToken, ...data, mode: "deactivate" },
        { signal: deactivateTileRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
  }, []);
  const createTile = React.useCallback(async (entitlementsToken, data) => {
    try {
      dispacthErrorMessage(undefined);
      if (createTileRef?.current) {
        createTileRef?.current?.abort();
      }
      createTileRef.current = new AbortController();
      const resposnse = await postService(
        "/auth/v1/fmo/admin/tile/create",
        { entitlementsToken: entitlementsToken, ...data },
        { signal: createTileRef?.current.signal }
      );
      return resposnse?.data?.data ?? {};
    } catch (e) {}
    return [];
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
  return {
    getTile,
    updateTile,
    verifyTile,
    createTile,
    deactivateTile,
    getTileAudit,
    getCategory,
    getImportMap,
  };
};

export default useServices;
