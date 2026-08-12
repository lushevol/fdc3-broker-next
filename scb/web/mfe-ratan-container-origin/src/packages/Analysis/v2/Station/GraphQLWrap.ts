import { emit } from "../Sensor";
import { MonitorEventType, MonitorEventSubType } from "../Event/type";
import { queryGraphql } from "../import";
import { ItemType } from "../Item/type";

export const getWrappedGraphQLQuery =
  (path: string) =>
  (url: string, query: any, setErrorField?: boolean, headers = {}) => {
    const t = performance.now();
    return queryGraphql(url, query, setErrorField, headers).then((resp) => {
      const payload = query?.loc?.source?.body ?? "";
      emit(
        {
          name: url,
          type: MonitorEventType.PERF,
          subType: MonitorEventSubType.RTT,
          ...(path
            ? {
                item: {
                  name: "",
                  path: path,
                  type: ItemType.Page,
                },
              }
            : {}),
        },
        [
          {
            tag: "Response Time (ms)",
            value: Math.round(performance.now() - t) + "",
          },
          {
            tag: "API Type",
            value: "graphql",
          },
          {
            tag: "Payload",
            value: typeof payload === "string" ? payload : "",
          },
        ]
      );
      return resp;
    });
  };
