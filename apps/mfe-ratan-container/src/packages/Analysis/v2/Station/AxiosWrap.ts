import { MonitorEventSubType, MonitorEventType } from "../Event/type";
import { ItemType } from "../Item/type";
import { emit } from "../Sensor";
import { Service } from "../import";

const { service } = Service;

export const getWrappedAxiosService = (path: string) =>
  new Proxy(service, {
    get(target, key, receiver) {
      return TrackWrap(Reflect.get(target, key, receiver), path);
    },
  });

const TrackWrap = (fn: (a, b, c) => Promise<any>, path?: string) => {
  return function (url: string, param1, param2): Promise<any> {
    const t = performance.now();
    return fn(url, param1, param2).then((resp) => {
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
            value: "restful",
          },
        ]
      );
      return resp;
    });
  };
};
