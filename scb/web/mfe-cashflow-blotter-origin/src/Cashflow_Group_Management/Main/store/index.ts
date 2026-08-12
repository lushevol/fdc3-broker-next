import { configureStore } from "@reduxjs/toolkit";

import groupBlotterReducer from "./slice";

const createStore = () =>
  configureStore({
    reducer: {
      groupBlotter: groupBlotterReducer,
    },
    middleware: (gDM) =>
      gDM({
        serializableCheck: {
          ignoredPaths: [
            "groupBlotter.blotterGridEvent",
            "groupBlotter.blotterQueryStatus",
          ],
        },
      }),
  });

export default createStore;
