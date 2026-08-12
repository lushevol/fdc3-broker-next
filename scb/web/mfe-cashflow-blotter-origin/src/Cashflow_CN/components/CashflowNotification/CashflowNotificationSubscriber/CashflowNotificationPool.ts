import _get from "lodash/get";
type callbackType<T> = (payload: T[]) => void;

export default class CashflowNotificationPool<T> {
  // SonarQube false positive: holdingTime is assigned in constructor
  private holdingTime = 5000;
  private pool: T[] = [];
  private intervalHandler: number = 0;
  private readonly listeners: callbackType<T>[] = [];
  // SonarQube false positive: RecordKey is assigned in constructor
  private RecordKey = "id";
  constructor(
    {
      holdingTime,
      recordKey,
    }: {
      holdingTime?: number;
      recordKey?: string;
    } = {
      holdingTime: 5000,
      recordKey: "id",
    }
  ) {
    if (holdingTime) this.holdingTime = holdingTime;
    if (recordKey) this.RecordKey = recordKey;
    this.start();
  }

  add(items: T | T[]) {
    if (items instanceof Array) {
      Array.prototype.unshift.apply(this.pool, items);
    } else {
      this.add([items]);
    }
  }

  private getRecordKey(record: T) {
    return _get(record, this.RecordKey);
  }

  private clearOutDateData() {
    const existedKey = new Set<string>();
    this.pool = this.pool.filter((r) => {
      const key = this.getRecordKey(r);
      if (key) {
        if (existedKey.has(key)) return false;
        else {
          existedKey.add(key);
          return true;
        }
      } else return true;
    });
  }

  private publish() {
    if (this.listeners.length && this.pool.length) {
      this.clearOutDateData();
      this.listeners.forEach((f) => f(this.pool));
      this.pool = [];
    }
  }

  subscribe(listener: callbackType<T>) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: callbackType<T>) {
    const index = this.listeners.findIndex((i) => i === listener);
    if (index > -1) this.listeners.splice(index, 1);
  }

  unsubscribeAll() {
    this.listeners.splice(0);
  }

  start() {
    this.stop();
    this.intervalHandler = window.setInterval(() => {
      this.publish();
    }, this.holdingTime);
  }

  stop() {
    clearInterval(this.intervalHandler);
    this.intervalHandler = 0;
  }

  destory() {
    this.stop();
    this.unsubscribeAll();
  }
}
