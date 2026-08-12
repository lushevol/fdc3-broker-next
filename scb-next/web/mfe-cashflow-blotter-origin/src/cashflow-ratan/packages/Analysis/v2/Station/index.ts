import { MonitorEvent } from "../Event";
import { IPredefinedEvent, MonitorPayload } from "../Event/type";
import { EventEmitter } from "./EventEmitter";
import { MouseEventCapture } from "./FullTrack";
import { smartSender } from "./Sender";
import { EVENT_EMITTER_KEY_EVENT } from "./const";
import { checkIfIdle, readMonitorEvents, saveMonitorEvents } from "./utils";

type EET = {
  event: {
    event: IPredefinedEvent;
    payloads?: MonitorPayload[];
  };
};

export const MonitorEventEmitter = new EventEmitter<EET>();

export class Station {
  isIdle = false;
  monitorDatas: MonitorEvent[] = [];
  sendingAbortController: AbortController | null = null;
  constructor() {
    this.read();
    this.addListener();
  }

  eventHandler(v: EET["event"]) {
    this.monitorDatas.push(new MonitorEvent(v.event, v.payloads));
    this.save();
  }

  addListener() {
    MonitorEventEmitter.on(
      EVENT_EMITTER_KEY_EVENT,
      this.eventHandler.bind(this)
    );
    window.addEventListener("visibilitychange", this.process.bind(this));
    document.body.addEventListener("click", MouseEventCapture);
  }
  removeListener() {
    MonitorEventEmitter.off(EVENT_EMITTER_KEY_EVENT);
    window.removeEventListener("visibilitychange", this.process);
  }

  read() {
    requestIdleCallback(() => {
      const cachedMonitorEvents = readMonitorEvents();
      this.monitorDatas = [...cachedMonitorEvents, ...this.monitorDatas];
    });
  }

  save() {
    requestIdleCallback(() => {
      saveMonitorEvents(this.monitorDatas);
    });
  }

  send() {
    const [sendingStatus, abortController] = smartSender(this.monitorDatas);
    this.sendingAbortController = abortController;
    sendingStatus.then((res) => {
      const succeedEvents = res
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => (r as PromiseFulfilledResult<MonitorEvent[]>).value);
      const succeedEventIds = new Set(succeedEvents.map((i) => i.id));
      this.monitorDatas = this.monitorDatas.filter(
        (d) => !succeedEventIds.has(d.id)
      );
      this.save();
    });
  }

  abortSend() {
    this.sendingAbortController?.abort();
  }

  process(ev: Event) {
    if (this.isIdle !== checkIfIdle(ev)) {
      this.isIdle = !this.isIdle;
      if (this.isIdle) {
        this.send();
      } else {
        this.abortSend();
      }
    }
  }

  destory() {
    this.removeListener();
  }
}
