import React from 'react';
import { getHooksBase } from '../../../hooks/HooksBase';
import { ActionType } from '../../../hooks/reducer/util/ActionType';
import useAdminRequest from '../../common/services/useAdminRequest';

type AdminPayload = Record<string, unknown>;

const useServices = () => {
  const { baseDispatch } = getHooksBase();
  const clearErrorMessage = React.useCallback(() => {
    baseDispatch({
      type: ActionType.SET_ERRORMSG,
      data: { errorMsg: undefined },
    });
  }, [baseDispatch]);
  const request = useAdminRequest(clearErrorMessage);

  const getCategory = React.useCallback(
    (entitlementsToken: string) =>
      request<unknown[]>(
        'getCategory',
        '/auth/v1/fmo/admin/category/data',
        { entitlementsToken },
        [],
      ),
    [request],
  );
  const getTile = React.useCallback(
    (entitlementsToken: string, data: AdminPayload) =>
      request<unknown[]>(
        'getTile',
        '/auth/v1/fmo/admin/tile/data',
        { entitlementsToken, ...data },
        [],
      ),
    [request],
  );
  const getTileAudit = React.useCallback(
    (entitlementsToken: string, data: AdminPayload) =>
      request<unknown[]>(
        'getTileAudit',
        '/auth/v1/fmo/admin/tile/audit',
        { entitlementsToken, ...data },
        [],
      ),
    [request],
  );
  const updateTile = React.useCallback(
    (entitlementsToken: string, data: AdminPayload) =>
      request<AdminPayload>(
        'updateTile',
        '/auth/v1/fmo/admin/tile/update',
        { entitlementsToken, subtitle: '', ...data, mode: 'maker' },
        {},
      ),
    [request],
  );
  const verifyTile = React.useCallback(
    (entitlementsToken: string, data: AdminPayload) =>
      request<AdminPayload>(
        'verifyTile',
        '/auth/v1/fmo/admin/tile/update',
        { entitlementsToken, subtitle: '', ...data, mode: 'checker' },
        {},
      ),
    [request],
  );
  const deactivateTile = React.useCallback(
    (entitlementsToken: string, data: AdminPayload) =>
      request<AdminPayload>(
        'deactivateTile',
        '/auth/v1/fmo/admin/tile/update',
        { entitlementsToken, ...data, mode: 'deactivate' },
        {},
      ),
    [request],
  );
  const createTile = React.useCallback(
    (entitlementsToken: string, data: AdminPayload) =>
      request<AdminPayload>(
        'createTile',
        '/auth/v1/fmo/admin/tile/create',
        { entitlementsToken, ...data },
        {},
      ),
    [request],
  );
  const getImportMap = React.useCallback(
    (entitlementsToken: string) =>
      request<unknown[]>(
        'getImportMap',
        '/auth/v1/fmo/admin/importmap/data',
        { entitlementsToken },
        [],
      ),
    [request],
  );

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
