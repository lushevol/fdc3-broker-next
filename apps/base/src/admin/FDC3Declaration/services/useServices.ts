import React from 'react';
import { getHooksBase } from '../../../hooks/HooksBase';
import { ActionType } from '../../../hooks/reducer/util/ActionType';
import { postService } from '../../../hooks/service';

const useServices = () => {
  const { baseDispatch } = getHooksBase();
  const getCategoryRef = React.useRef<AbortController | null>(null);
  const getDeclarationRef = React.useRef<AbortController | null>(null);
  const updateDeclarationRef = React.useRef<AbortController | null>(null);
  const createDeclarationRef = React.useRef<AbortController | null>(null);
  const deleteDeclarationRef = React.useRef<AbortController | null>(null);

  const dispacthErrorMessage = React.useCallback(
    (msg) => {
      baseDispatch({ type: ActionType.SET_ERRORMSG, data: { errorMsg: msg } });
    },
    [baseDispatch],
  );

  const getCategory = React.useCallback(
    async (entitlementsToken) => {
      try {
        dispacthErrorMessage(undefined);
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
      } catch {
        return [];
      }
    },
    [dispacthErrorMessage],
  );

  const getTile = React.useCallback(async (entitlementsToken) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/tile/data', { entitlementsToken });
      return resposnse?.data?.data ?? [];
    } catch {
      return [];
    }
  }, []);

  const getDeclaration = React.useCallback(
    async (entitlementsToken, data) => {
      try {
        dispacthErrorMessage(undefined);
        if (getDeclarationRef?.current) {
          getDeclarationRef?.current?.abort();
        }
        getDeclarationRef.current = new AbortController();
        const resposnse = await postService(
          '/auth/v1/fmo/admin/fdc3/data',
          { entitlementsToken: entitlementsToken, ...data },
          { signal: getDeclarationRef?.current.signal },
        );
        return resposnse?.data?.data ?? [];
      } catch {
        return [];
      }
    },
    [dispacthErrorMessage],
  );

  const updateDeclaration = React.useCallback(
    async (entitlementsToken, data) => {
      try {
        dispacthErrorMessage(undefined);
        if (updateDeclarationRef?.current) {
          updateDeclarationRef?.current?.abort();
        }
        updateDeclarationRef.current = new AbortController();
        const resposnse = await postService(
          '/auth/v1/fmo/admin/fdc3/update',
          { entitlementsToken: entitlementsToken, ...data },
          { signal: updateDeclarationRef?.current.signal },
        );
        return resposnse?.data?.data ?? {};
      } catch {
        return {};
      }
    },
    [dispacthErrorMessage],
  );

  const createDeclaration = React.useCallback(
    async (entitlementsToken, data) => {
      try {
        dispacthErrorMessage(undefined);
        if (createDeclarationRef?.current) {
          createDeclarationRef?.current?.abort();
        }
        createDeclarationRef.current = new AbortController();
        const resposnse = await postService(
          '/auth/v1/fmo/admin/fdc3/create',
          { entitlementsToken: entitlementsToken, ...data },
          { signal: createDeclarationRef?.current.signal },
        );
        return resposnse?.data?.data ?? {};
      } catch {
        return {};
      }
    },
    [dispacthErrorMessage],
  );

  const deleteDeclaration = React.useCallback(
    async (entitlementsToken, data) => {
      try {
        dispacthErrorMessage(undefined);
        if (deleteDeclarationRef?.current) {
          deleteDeclarationRef?.current?.abort();
        }
        deleteDeclarationRef.current = new AbortController();
        const resposnse = await postService(
          '/auth/v1/fmo/admin/fdc3/delete',
          { entitlementsToken: entitlementsToken, ...data },
          { signal: deleteDeclarationRef?.current.signal },
        );
        return resposnse?.data?.data ?? {};
      } catch {
        return {};
      }
    },
    [dispacthErrorMessage],
  );

  const getIntentList = React.useCallback(async (entitlementsToken) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/intent/data', {
        entitlementsToken,
      });
      return resposnse?.data?.data ?? [];
    } catch {
      return [];
    }
  }, []);

  const createIntent = React.useCallback(async (entitlementsToken, data) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/intent/create', {
        entitlementsToken,
        ...data,
      });
      return resposnse?.data?.data ?? {};
    } catch {
      return {};
    }
  }, []);

  const updateIntent = React.useCallback(async (entitlementsToken, data) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/intent/update', {
        entitlementsToken,
        ...data,
      });
      return resposnse?.data?.data ?? {};
    } catch {
      return {};
    }
  }, []);

  const deleteIntent = React.useCallback(async (entitlementsToken, data) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/intent/delete', {
        entitlementsToken,
        ...data,
      });
      return resposnse?.data?.data ?? {};
    } catch {
      return {};
    }
  }, []);

  const getContextList = React.useCallback(async (entitlementsToken) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/context/data', {
        entitlementsToken,
      });
      return (
        resposnse?.data?.data?.map((ctx) => ({
          ...ctx,
          samples: ctx.samples ?? ctx.simples ?? [],
        })) ?? []
      );
    } catch {
      return [];
    }
  }, []);

  const createContext = React.useCallback(async (entitlementsToken, data) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/context/create', {
        entitlementsToken,
        ...data,
      });
      return resposnse?.data?.data ?? {};
    } catch {
      return {};
    }
  }, []);

  const updateContext = React.useCallback(async (entitlementsToken, data) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/context/update', {
        entitlementsToken,
        ...data,
      });
      return resposnse?.data?.data ?? {};
    } catch {
      return {};
    }
  }, []);

  const deleteContext = React.useCallback(async (entitlementsToken, data) => {
    try {
      const resposnse = await postService('/auth/v1/fmo/admin/fdc3/context/delete', {
        entitlementsToken,
        ...data,
      });
      return resposnse?.data?.data ?? {};
    } catch {
      return {};
    }
  }, []);

  return {
    getCategory,
    getDeclaration,
    updateDeclaration,
    createDeclaration,
    deleteDeclaration,
    getIntentList,
    createIntent,
    updateIntent,
    deleteIntent,
    getContextList,
    createContext,
    updateContext,
    deleteContext,
    getTile,
  };
};

export default useServices;
