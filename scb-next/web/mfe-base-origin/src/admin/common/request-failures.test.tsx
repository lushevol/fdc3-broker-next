import { AxiosError, type AxiosAdapter } from 'axios';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hooksBase } from '../../hooks/HooksBase';
import { initialData } from '../../hooks/model/root';
import { ActionType } from '../../hooks/reducer/util/ActionType';
import service from '../../hooks/service/config';
import useCategoryController from '../Category/common/useController';
import useImportMapController from '../ImportMap/common/useController';
import useTileController from '../Tile/common/useController';
import useCategoryAudit from '../Category/common/useAudit';
import useImportMapAudit from '../ImportMap/common/useAudit';
import useTileAudit from '../Tile/common/useAudit';
import useCategoryServices from '../Category/services/useServices';
import type { AdminRecord } from './interface';

vi.mock('../../hooks/provider', () => ({
  useContext: () => [hooksBase.store, hooksBase.baseDispatch],
}));
vi.mock('../../hooks/dispathcer', () => ({
  default: () => ({ registerRefreshTab: vi.fn() }),
}));
vi.mock('./Actions', () => ({ default: () => null }));
vi.mock('./Status', () => ({ default: () => null }));
vi.mock('./DateTime', () => ({ default: () => null }));

type ModuleName = 'category' | 'tile' | 'importmap';
type Controller =
  | ReturnType<typeof useCategoryController>
  | ReturnType<typeof useImportMapController>
  | ReturnType<typeof useTileController>;

const controllers = [
  { module: 'category', useController: useCategoryController },
  { module: 'tile', useController: useTileController },
  { module: 'importmap', useController: useImportMapController },
] as const;
const audits = [
  { module: 'category', useAudit: useCategoryAudit },
  { module: 'tile', useAudit: useTileAudit },
  { module: 'importmap', useAudit: useImportMapAudit },
] as const;
const props = { module: '/category', tile: '/category', panelId: 'panel', tabId: 'tab' };
const unavailable = 'Admin service temporarily unavailable';
const originalAdapter = service.defaults.adapter;
const originalStore = hooksBase.store;
const originalDispatch = hooksBase.baseDispatch;
const dispatch = vi.fn();
let records: Record<ModuleName, AdminRecord[]>;
let failures: Set<ModuleName>;

function refresh(controller: Controller) {
  if ('refreshTab' in controller) controller.refreshTab();
  else controller.refresh();
}

beforeEach(() => {
  dispatch.mockReset();
  hooksBase.setStore({ ...initialData, entitlementsToken: 'acceptance', entities: [] });
  hooksBase.setBaseDispatch(dispatch);
  records = {
    category: [{ applicationCategoryId: 101, label: 'Existing category' }],
    tile: [{ applicationTileId: 201, title: 'Existing tile' }],
    importmap: [{ importMapId: 301, keyName: 'Existing container' }],
  };
  failures = new Set();
  const adapter: AxiosAdapter = async (config) => {
    const module = config.url?.split('/').at(-2) as ModuleName;
    if (failures.has(module)) {
      throw new AxiosError(
        'Request failed with status code 503',
        'ERR_BAD_RESPONSE',
        config,
        {},
        {
          config,
          status: 503,
          statusText: 'Service Unavailable',
          headers: {},
          data: { message: unavailable },
        },
      );
    }
    return { config, status: 200, statusText: 'OK', headers: {}, data: { data: records[module] } };
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

describe('admin list request failures', () => {
  it.each(controllers)(
    'retains $module rows on 503, reports the existing alert and recovers on retry',
    async ({ module, useController }) => {
      const { result } = renderHook(() => useController(props));
      await waitFor(() => expect(result.current.rows).toHaveLength(1));
      const previousRows = result.current.rows;
      dispatch.mockClear();
      failures.add(module);

      await act(async () => refresh(result.current));
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({
          type: ActionType.SET_ERRORMSG,
          data: { errorMsg: unavailable },
        }),
      );
      expect(dispatch).toHaveBeenLastCalledWith({
        type: ActionType.SET_IS_LOADING,
        data: { isLoading: false },
      });
      expect(result.current.rows).toEqual(previousRows);

      failures.clear();
      records[module] = [
        { ...records[module][0], label: 'Recovered', title: 'Recovered', keyName: 'Recovered' },
      ];
      await act(async () => refresh(result.current));
      await waitFor(() => expect(result.current.rows[0]).toMatchObject({ label: 'Recovered' }));
    },
  );

  it.each(['category', 'importmap'] as const)(
    "retains Tile's %s options on failure and refreshes them after recovery",
    async (module) => {
      const { result } = renderHook(() => useTileController(props));
      await waitFor(() => expect(result.current.categories).toHaveLength(1));
      const field = module === 'category' ? 'applicationCategory' : 'importMap';
      const previousOptions = result.current.columns.find(
        (column) => column.field === field,
      )?.valueOptions;
      const previousCategories = result.current.categories;
      dispatch.mockClear();
      failures.add(module);

      await act(async () => result.current.refresh());
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({
          type: ActionType.SET_ERRORMSG,
          data: { errorMsg: unavailable },
        }),
      );
      expect(result.current.columns.find((column) => column.field === field)?.valueOptions).toEqual(
        previousOptions,
      );
      expect(result.current.categories).toEqual(previousCategories);

      failures.clear();
      records[module] = [
        { ...records[module][0], label: 'Recovered category', keyName: 'Recovered container' },
      ];
      await act(async () => result.current.refresh());
      await waitFor(() =>
        expect(
          result.current.columns.find((column) => column.field === field)?.valueOptions,
        ).toEqual([module === 'category' ? 'Recovered category' : 'Recovered container']),
      );
    },
  );

  it('still rejects the public service request after the interceptor reports an error', async () => {
    failures.add('category');
    const { result } = renderHook(() => useCategoryServices());
    await expect(result.current.getCategory('acceptance')).rejects.toMatchObject({
      response: { status: 503, data: { message: unavailable } },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.SET_ERRORMSG,
      data: { errorMsg: unavailable },
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: ActionType.SET_IS_LOADING,
      data: { isLoading: false },
    });
  });
});

describe('admin audit request failures', () => {
  it.each(audits)(
    'retains $module audit rows and dialog state on failure, then recovers',
    async ({ module, useAudit }) => {
      const { result } = renderHook(() => useAudit());
      const record = records[module][0];
      act(() => result.current.onOpenAudit(record)());
      await waitFor(() => expect(result.current.auditRows).toHaveLength(1));
      const previousRows = result.current.auditRows;
      const previousOpen = result.current.openAudit;
      dispatch.mockClear();
      failures.add(module);

      await act(async () => result.current.getAuditData(record));
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({
          type: ActionType.SET_ERRORMSG,
          data: { errorMsg: unavailable },
        }),
      );
      expect(result.current.auditRows).toEqual(previousRows);
      expect(result.current.openAudit).toBe(previousOpen);
      expect(dispatch).toHaveBeenLastCalledWith({
        type: ActionType.SET_IS_LOADING,
        data: { isLoading: false },
      });

      failures.clear();
      records[module] = [{ ...record, label: 'Recovered audit' }];
      await act(async () => result.current.getAuditData(record));
      await waitFor(() =>
        expect(result.current.auditRows[0]).toMatchObject({ label: 'Recovered audit' }),
      );
      expect(result.current.openAudit).toBe(true);

      act(() => result.current.onCloseAudit());
      dispatch.mockClear();
      failures.add(module);
      await act(async () => result.current.getAuditData(record));
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({
          type: ActionType.SET_ERRORMSG,
          data: { errorMsg: unavailable },
        }),
      );
      expect(result.current.auditRows).toEqual([]);
      expect(result.current.openAudit).toBe(false);
    },
  );
});
