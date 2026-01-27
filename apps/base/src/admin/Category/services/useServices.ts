import React from 'react';
import { postService } from '../../../hooks/service';

const useServices = () => {
  const getCategoryRef = React.useRef<AbortController | null>(null);
  const getCategoryAuditRef = React.useRef<AbortController | null>(null);
  const updateCategoryRef = React.useRef<AbortController | null>(null);
  const verifyCategoryRef = React.useRef<AbortController | null>(null);
  const createCategoryRef = React.useRef<AbortController | null>(null);
  const deactivateCategoryRef = React.useRef<AbortController | null>(null);

  const getCategory = React.useCallback(async (entitlementsToken) => {
    try {
      if (getCategoryRef?.current) {
        getCategoryRef?.current?.abort();
      }
      getCategoryRef.current = new AbortController();
      const resposnse = await postService(
        '/auth/v1/fmo/admin/category/data',
        { entitlementsToken: entitlementsToken },
        { signal: getCategoryRef?.current.signal },
      );
      return resposnse?.data?.data ?? [];
    } catch (_e) {}
    return [];
  }, []);
  const getCategoryAudit = React.useCallback(async (entitlementsToken, data) => {
    try {
      if (getCategoryAuditRef?.current) {
        getCategoryAuditRef?.current?.abort();
      }
      getCategoryAuditRef.current = new AbortController();
      const resposnse = await postService(
        '/auth/v1/fmo/admin/category/audit',
        { entitlementsToken: entitlementsToken, ...data },
        { signal: getCategoryAuditRef?.current.signal },
      );
      return resposnse?.data?.data ?? [];
    } catch (_e) {}
    return [];
  }, []);
  const updateCategory = React.useCallback(async (entitlementsToken, data) => {
    try {
      if (updateCategoryRef?.current) {
        updateCategoryRef?.current?.abort();
      }
      updateCategoryRef.current = new AbortController();
      const resposnse = await postService(
        '/auth/v1/fmo/admin/category/update',
        { entitlementsToken: entitlementsToken, ...data, mode: 'maker' },
        { signal: updateCategoryRef?.current.signal },
      );
      return resposnse?.data?.data ?? {};
    } catch (_e) {}
    return [];
  }, []);
  const verifyCategory = React.useCallback(async (entitlementsToken, data) => {
    try {
      if (verifyCategoryRef?.current) {
        verifyCategoryRef?.current?.abort();
      }
      verifyCategoryRef.current = new AbortController();
      const resposnse = await postService(
        '/auth/v1/fmo/admin/category/update',
        { entitlementsToken: entitlementsToken, ...data, mode: 'checker' },
        { signal: verifyCategoryRef?.current.signal },
      );
      return resposnse?.data?.data ?? {};
    } catch (_e) {}
    return [];
  }, []);
  const deactivateCategory = React.useCallback(async (entitlementsToken, data) => {
    try {
      if (deactivateCategoryRef?.current) {
        deactivateCategoryRef?.current?.abort();
      }
      deactivateCategoryRef.current = new AbortController();
      const resposnse = await postService(
        '/auth/v1/fmo/admin/category/update',
        { entitlementsToken: entitlementsToken, ...data, mode: 'deactivate' },
        { signal: deactivateCategoryRef?.current.signal },
      );
      return resposnse?.data?.data ?? {};
    } catch (_e) {}
    return [];
  }, []);
  const createCategory = React.useCallback(async (entitlementsToken, data) => {
    try {
      if (createCategoryRef?.current) {
        createCategoryRef?.current?.abort();
      }
      createCategoryRef.current = new AbortController();
      const resposnse = await postService(
        '/auth/v1/fmo/admin/category/create',
        { entitlementsToken: entitlementsToken, ...data },
        { signal: createCategoryRef?.current.signal },
      );
      return resposnse?.data?.data ?? {};
    } catch (_e) {}
    return [];
  }, []);
  return {
    getCategory,
    updateCategory,
    verifyCategory,
    createCategory,
    deactivateCategory,
    getCategoryAudit,
  };
};

export default useServices;
