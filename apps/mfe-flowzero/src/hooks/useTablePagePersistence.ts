import { useCallback, useEffect } from "react";
import { ReactRouterDom } from "src/Root/import";

const { useLocation } = ReactRouterDom;

/**
 * Shape of the object stored in sessionStorage for each table page.
 * All fields are optional — `saveTableState` does a partial merge, so you can
 * update just one field at a time without clobbering the others.
 */
export interface TablePersistedState {
  page?: number;
  pageSize?: number;
  [key: string]: unknown; // allows each page to store custom filter fields
}

/**
 * Persists ag-Grid table state (page, pageSize, filters, …) as a single
 * JSON object in sessionStorage, keyed by `sessionKey`.
 *
 * - On **fresh entry** (no `fromDetail` in location state): clears stored state.
 * - On **return from detail page** (`fromDetail: true`): keeps stored state so
 *   the list can restore exactly where the user left off.
 *
 * **List page usage:**
 * 1. Call `useTableStatePersistence("my-page-state")`.
 * 2. Use `isFromDetail` + `readTableState()` in lazy `useState` initialisers to
 *    restore page, pageSize, and any filter fields.
 * 3. In `onPaginationChanged`, call `saveTableState({ page })` (guarded by
 *    `initialPageJumpedRef`) and `saveTableState({ pageSize })` when it changes.
 * 4. Before navigating to a detail page, call `saveTableState({ searchLabel, … })`
 *    so filters survive the round-trip.
 * 5. On manual refresh (claim/assign/delete), call `clearTableState()` before
 *    `gridApi.refreshInfiniteCache()`.
 * 6. When URL params that change the dataset change, call `clearTableState()` and
 *    reset `initialPageJumpedRef.current = false`.
 *
 * **Detail page usage:**
 * - Navigate back with `{ state: { fromDetail: true } }`.
 * - Pass `returnTo = location.pathname + location.search` in navigate state
 *   so the detail page knows where to return.
 */
export function useTableStatePersistence(sessionKey: string) {
  const location = useLocation();
  const isFromDetail = !!(location.state as { fromDetail?: boolean })
    ?.fromDetail;

  // Clear stored state on fresh entry; keep it when returning from a detail page.
  useEffect(() => {
    if (!isFromDetail) {
      sessionStorage.removeItem(sessionKey);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const readTableState = useCallback((): TablePersistedState | null => {
    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (!raw) return null;
      return JSON.parse(raw) as TablePersistedState;
    } catch {
      return null;
    }
  }, [sessionKey]);

  const saveTableState = useCallback(
    (partial: Partial<TablePersistedState>) => {
      try {
        const existing = sessionStorage.getItem(sessionKey);
        const current: TablePersistedState = existing
          ? JSON.parse(existing)
          : {};
        sessionStorage.setItem(
          sessionKey,
          JSON.stringify({ ...current, ...partial })
        );
      } catch {}
    },
    [sessionKey]
  );

  const clearTableState = useCallback(
    () => sessionStorage.removeItem(sessionKey),
    [sessionKey]
  );

  return { readTableState, saveTableState, clearTableState, isFromDetail };
}
