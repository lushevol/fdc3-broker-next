import { MonitorEvent } from "../Event";
import { ServiceConfig } from "../Config/type";
import { defaultServiceConfig } from "../Config";
import { Service, featureScopedEnabled } from "../import";
import {
  RatanAnalysis2SingleUIBffAnalyze,
  v2EventTov1Event,
} from "../../convertor";
import { encode } from "../Storage/crypto";

export const sender = async (
  events: MonitorEvent[],
  serviceConfig: ServiceConfig = defaultServiceConfig,
  signal?: AbortSignal
): Promise<MonitorEvent[]> => {
  const singleUIAuthorization = sessionStorage.getItem("SET_TOKEN");
  if (featureScopedEnabled("PM_Client_SDK_V2_Sender_v2")) {
    try {
      await fetch(serviceConfig.url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Single-Ui-Authorization": sessionStorage.getItem("SET_TOKEN") + "",
        },
        body: JSON.stringify({
          events: events.map((e) => encode(JSON.stringify(e))),
        }),
        keepalive: true,
        signal,
      });
      return events;
    } catch (error) {
      return [];
    }
  } else {
    const res = await Promise.allSettled(
      events.map((e) =>
        Service.service.post(
          serviceConfig.url,
          {
            ...RatanAnalysis2SingleUIBffAnalyze(v2EventTov1Event(e)),
            singleUIAuthorization,
          },
          {
            signal,
          }
        )
      )
    );
    return events.filter((r, i) => res[i].status === "fulfilled");
  }
};

export const smartSender = (
  events: MonitorEvent[],
  serviceConfig: ServiceConfig = defaultServiceConfig
): [Promise<PromiseSettledResult<MonitorEvent[]>[]>, AbortController] => {
  const controller = new AbortController();
  const groupEvents: MonitorEvent[][] = [];
  for (let i = 0; i < events.length; i += serviceConfig.maxGroupCount) {
    groupEvents.push(events.slice(i, i + serviceConfig.maxGroupCount));
  }
  const res = Promise.allSettled(
    groupEvents.map((group) => sender(group, serviceConfig, controller.signal))
  );
  return [res, controller];
};
