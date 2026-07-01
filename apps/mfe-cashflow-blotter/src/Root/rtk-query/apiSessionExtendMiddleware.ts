import { createListenerMiddleware } from "@reduxjs/toolkit";

import { ExtendTokenService } from "../import";

export const apiSessionExtendMiddleware = createListenerMiddleware();

apiSessionExtendMiddleware.startListening({
  predicate: (action, _currentState, _prevState) => {
    return action.type === "graphqlApi/executeQuery/fulfilled";
  },
  effect: async (_action, _lisenerApi) => {
    ExtendTokenService();
  },
});
