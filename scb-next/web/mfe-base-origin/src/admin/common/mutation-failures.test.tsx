import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hooksBase } from "../../hooks/HooksBase";
import { initialData } from "../../hooks/model/root";
import { ActionType } from "../../hooks/reducer/util/ActionType";
import service from "../../hooks/service/config";
import useCategoryDetail from "../Category/common/useTableDetail";
import useImportMapDetail from "../ImportMap/common/useTableDetail";
import useTileDetail from "../Tile/common/useTableDetail";
import type { AdminRecord } from "./interface";
import * as categoryUtilities from "./utils/category";
import * as importMapUtilities from "./utils/importmap";
import * as tileUtilities from "./utils/tile";

vi.mock("../../hooks/provider", () => ({
  useContext: () => [hooksBase.store, hooksBase.baseDispatch],
}));

type Detail = ReturnType<typeof useCategoryDetail>;
const modules = [
  {
    module: "category",
    idField: "applicationCategoryId",
    labelField: "label",
    useDetail: useCategoryDetail,
    utilities: categoryUtilities,
  },
  {
    module: "tile",
    idField: "applicationTileId",
    labelField: "title",
    useDetail: () => useTileDetail([], []),
    utilities: tileUtilities,
  },
  {
    module: "importmap",
    idField: "importMapId",
    labelField: "keyName",
    useDetail: useImportMapDetail,
    utilities: importMapUtilities,
  },
] as const;
const actions = [
  { callback: "onSave", utility: "onSaveUtil", mode: "new", resultMode: "new" },
  { callback: "onUpdate", utility: "onUpdateUtil", mode: "edit", resultMode: "edit" },
  { callback: "onVerify", utility: "onVerifyUtil", mode: "verify", resultMode: "verify" },
  {
    callback: "onDeactivate",
    utility: "onDeactivateUtil",
    mode: "deactivate",
    resultMode: "deactivate",
  },
] as const;
const scenarios = modules.flatMap((module) => actions.map((action) => ({ ...module, ...action })));
const unavailable = "Admin service temporarily unavailable";
const originalAdapter = service.defaults.adapter;
const originalStore = hooksBase.store;
const originalDispatch = hooksBase.baseDispatch;
const dispatch = vi.fn();
let responseRecord: AdminRecord;
let failRequest: boolean;
let requests: InternalAxiosRequestConfig[];
let requestBarrier: Promise<void> | undefined;

function pendingRequest() {
  let release!: () => void;
  requestBarrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  return release;
}

function seedDetail(detail: Detail, row: AdminRecord, mode: string) {
  detail.setData([row]);
  detail.onOpen(row, mode)();
}

beforeEach(() => {
  dispatch.mockReset();
  hooksBase.setStore({ ...initialData, entitlementsToken: "acceptance", entities: [] });
  hooksBase.setBaseDispatch(dispatch);
  responseRecord = {};
  failRequest = false;
  requests = [];
  requestBarrier = undefined;
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config);
    await requestBarrier;
    if (failRequest) {
      throw new AxiosError(
        "Request failed with status code 503",
        "ERR_BAD_RESPONSE",
        config,
        {},
        {
          config,
          status: 503,
          statusText: "Service Unavailable",
          headers: {},
          data: { message: unavailable },
        },
      );
    }
    return {
      config,
      status: 200,
      statusText: "OK",
      headers: {},
      data: { data: responseRecord },
    };
  };
  service.defaults.adapter = adapter;
});

afterEach(() => {
  cleanup();
  service.defaults.adapter = originalAdapter;
  hooksBase.setStore(originalStore);
  hooksBase.setBaseDispatch(originalDispatch);
  vi.restoreAllMocks();
});

describe("admin detail mutation request failures", () => {
  it.each(scenarios)(
    "$module $callback keeps edits and rows after 503, then succeeds on retry",
    async ({ useDetail, idField, labelField, callback, mode, resultMode }) => {
      const row = { [idField]: 101, id: 101, [labelField]: "Existing record", updatedBy: "maker" };
      const { result } = renderHook(useDetail);
      act(() => seedDetail(result.current, row, mode));
      act(() => result.current.onChange("Unsaved change", labelField));
      const previousRecord = result.current.record;
      const previousRows = result.current.data;
      failRequest = true;
      const release = pendingRequest();
      let settlement!: Promise<{ status: "resolved" } | { status: "rejected"; reason: unknown }>;
      act(() => {
        settlement = result.current[callback]().then(
          () => ({ status: "resolved" as const }),
          (reason: unknown) => ({ status: "rejected" as const, reason }),
        );
      });
      await waitFor(() => expect(requests).toHaveLength(1));
      expect(result.current.isLoading).toBe(true);
      expect(result.current.openDetail).toBe(true);
      let outcome: Awaited<typeof settlement> | undefined;
      await act(async () => {
        release();
        outcome = await settlement;
      });

      expect(outcome).toEqual({ status: "resolved" });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.openDetail).toBe(true);
      expect(result.current.record).toBe(previousRecord);
      expect(result.current.data).toBe(previousRows);
      expect(
        dispatch.mock.calls.filter(
          ([action]) => action.type === ActionType.SET_ERRORMSG && action.data?.errorMsg === unavailable,
        ),
      ).toHaveLength(1);
      expect(dispatch).toHaveBeenLastCalledWith({
        type: ActionType.SET_IS_LOADING,
        data: { isLoading: false },
      });

      failRequest = false;
      requestBarrier = undefined;
      const savedId = mode === "new" ? 202 : 101;
      responseRecord = {
        [idField]: savedId,
        [labelField]: "Saved change",
        updatedBy: "maker",
      };
      await act(async () => {
        await result.current[callback]();
      });
      expect(requests).toHaveLength(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.openDetail).toBe(false);
      expect(result.current.record).toBeUndefined();
      expect(result.current.data).toHaveLength(mode === "new" ? 2 : 1);
      expect(result.current.data[0]).toMatchObject({
        [idField]: savedId,
        id: savedId,
        [labelField]: "Saved change",
        mode: resultMode,
      });
      if (mode === "new") expect(result.current.data[1]).toEqual(row);
    },
  );

  it.each(scenarios)(
    "$module $callback preserves its existing empty response behavior",
    async ({ module, useDetail, idField, labelField, callback, mode }) => {
      const row = { [idField]: 101, id: 101, [labelField]: "Existing record" };
      const { result } = renderHook(useDetail);
      act(() => seedDetail(result.current, row, mode));
      const previousRecord = result.current.record;
      const previousRows = result.current.data;

      await act(async () => {
        await result.current[callback]();
      });

      const keepsDetailOpen = module !== "category" && (mode === "new" || mode === "edit");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(previousRows);
      expect(result.current.openDetail).toBe(keepsDetailOpen);
      expect(result.current.record).toBe(keepsDetailOpen ? previousRecord : undefined);
      expect(requests).toHaveLength(1);
    },
  );

  it.each(scenarios)(
    "$module $callback does not request or load without a record",
    async ({ useDetail, callback }) => {
      const { result } = renderHook(useDetail);
      await act(async () => {
        await result.current[callback]();
      });
      expect(requests).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.openDetail).toBe(false);
      expect(result.current.record).toBeUndefined();
    },
  );

  it.each(scenarios)(
    "$module $callback propagates successful response processing errors and resets loading",
    async ({ useDetail, utilities, utility, idField, labelField, callback, mode }) => {
      const row = { [idField]: 101, id: 101, [labelField]: "Existing record", updatedBy: "maker" };
      const { result } = renderHook(useDetail);
      act(() => seedDetail(result.current, row, mode));
      const previousRecord = result.current.record;
      const previousRows = result.current.data;
      const processingError = new Error("Cannot process successful mutation response");
      vi.spyOn(utilities, utility).mockImplementationOnce(() => {
        throw processingError;
      });
      responseRecord = { ...row };

      await act(async () => {
        await expect(result.current[callback]()).rejects.toBe(processingError);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.openDetail).toBe(true);
      expect(result.current.record).toBe(previousRecord);
      expect(result.current.data).toBe(previousRows);
      expect(
        dispatch.mock.calls.filter(
          ([action]) => action.type === ActionType.SET_ERRORMSG && action.data?.errorMsg === unavailable,
        ),
      ).toHaveLength(0);
    },
  );
});
