import { createListenerMiddleware } from "@reduxjs/toolkit";

import { emit, MonitorEventSubType, MonitorEventType } from "../analysis";

export const apiPerfMonitorMiddleware = createListenerMiddleware();

const requestIdMap = new Map<string, number>();

apiPerfMonitorMiddleware.startListening({
  predicate: (action, _currentState, _prevState) => {
    return [
      "graphqlApi/executeQuery/pending",
      "graphqlApi/executeQuery/fulfilled",
    ].includes(action.type);
  },
  effect: async (action, _lisenerApi) => {
    if (action.type === "graphqlApi/executeQuery/pending") {
      const { requestId, startedTimeStamp } = action.meta;
      requestIdMap.set(requestId, startedTimeStamp);
    } else if (action.type === "graphqlApi/executeQuery/fulfilled") {
      const { requestId, arg, fulfilledTimeStamp } = action.meta;
      const startedTimestamp = requestIdMap.get(requestId);
      if (startedTimestamp && emit) {
        const duration = fulfilledTimeStamp - startedTimestamp;
        try {
          emit(
            {
              name: arg.endpointName,
              type: MonitorEventType.PERF,
              subType: MonitorEventSubType.RTT,
            },
            [
              {
                tag: "Response Time (ms)",
                value: duration + "",
              },
              {
                tag: "API Type",
                value: "graphql",
              },
              {
                tag: "Payload",
                value: JSON.stringify(arg.originalArgs),
              },
            ]
          );
        } catch (error) {}
      }
    }
  },
});
