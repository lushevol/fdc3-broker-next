import { IPredefinedEvent, MonitorPayload } from "../Event/type";
import { MonitorEventEmitter } from "../Station";
import { EVENT_EMITTER_KEY_EVENT } from "../Station/const";

export const emit = (
  predefinedEvent: IPredefinedEvent,
  payloads?: MonitorPayload[]
) => {
  return MonitorEventEmitter.emit(EVENT_EMITTER_KEY_EVENT, {
    event: predefinedEvent,
    payloads,
  });
};
