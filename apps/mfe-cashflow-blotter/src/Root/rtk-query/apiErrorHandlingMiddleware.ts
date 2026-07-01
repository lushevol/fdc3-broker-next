import { createListenerMiddleware } from "@reduxjs/toolkit";

import { CommonUtil } from "../import";
import { logger } from "../import/ratanutils";

const { showErrorMsg } = CommonUtil;

export const apiErrorHandlingMiddleware = createListenerMiddleware();

apiErrorHandlingMiddleware.startListening({
  predicate: (action, _currentState, _prevState) => {
    return <string>action.type === "graphqlApi/executeQuery/rejected";
  },
  effect: async (action, _lisenerApi) => {
    const errorMessage = action?.payload?.stack;
    if (errorMessage) {
      showErrorMsg(errorMessage);
      logger.error(errorMessage);
    }
  },
});
