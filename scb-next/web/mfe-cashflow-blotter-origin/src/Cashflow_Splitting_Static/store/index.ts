import {
  addListener,
  configureStore,
  createListenerMiddleware,
  ListenerEffectAPI,
  TypedAddListener,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { api } from "../services/api";
import { aggridSlice } from "./aggrid.slice";
import { auditSlice } from "./audit.slice";
import { detailSlice } from "./detail.slice";
import { auditTablePaginationSlice, paginationSlice } from "./pagination.slice";
import { searchSlice } from "./search.slice";

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
});

const create = () =>
  configureStore({
    reducer: {
      [searchSlice.name]: searchSlice.reducer,
      [paginationSlice.name]: paginationSlice.reducer,
      [auditTablePaginationSlice.name]: auditTablePaginationSlice.reducer,
      [detailSlice.name]: detailSlice.reducer,
      [aggridSlice.name]: aggridSlice.reducer,
      [auditSlice.name]: auditSlice.reducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (gDM) =>
      gDM()
        .prepend(listenerMiddlewareInstance.middleware)
        .concat(api.middleware),
  });

const store = create();

export default create;

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
