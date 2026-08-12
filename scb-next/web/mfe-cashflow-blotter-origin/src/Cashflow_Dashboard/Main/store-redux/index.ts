import {
  addListener,
  configureStore,
  createAsyncThunk,
  createListenerMiddleware,
  type ListenerEffectAPI,
  type TypedAddListener,
  type TypedStartListening,
} from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { apiErrorHandlingMiddleware } from "src/Root/rtk-query/apiErrorHandlingMiddleware";
import { apiPerfMonitorMiddleware } from "src/Root/rtk-query/apiPerfMonitorMiddleware";
import { apiSessionExtendMiddleware } from "src/Root/rtk-query/apiSessionExtendMiddleware";
import { graphqlApi } from "src/Root/rtk-query/baseGraphQLApi";

import { dashboardDataSlice } from "./slice/dashboard-data";
import { dashboardSearchSlice } from "./slice/dashboard-search";
const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
});

export const createStore = () =>
  configureStore({
    reducer: {
      [dashboardSearchSlice.name]: dashboardSearchSlice.reducer,
      [dashboardDataSlice.name]: dashboardDataSlice.reducer,
      [graphqlApi.reducerPath]: graphqlApi.reducer,
    },
    middleware: (gDM) =>
      gDM({
        serializableCheck: {
          ignoredActions: ["dashboardSearch/setSearchFormInstance"],
          ignoredPaths: ["dashboardSearch.searchFormInstance.resetFields"],
        },
      })
        .prepend(listenerMiddlewareInstance.middleware)
        .concat(graphqlApi.middleware)
        .concat(apiSessionExtendMiddleware.middleware)
        .concat(apiPerfMonitorMiddleware.middleware)
        .concat(apiErrorHandlingMiddleware.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof store.dispatch;

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>;

// @see https://redux-toolkit.js.org/api/createListenerMiddleware#typescript-usage
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppAddListener = TypedAddListener<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddlewareInstance.startListening as AppStartListening;
export const addAppListener = addListener as AppAddListener;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>();
