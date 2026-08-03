const debouncerQueue = new Set<Debouncer>();

export class Debouncer {
  static debounce(debouncer: any, asyncModule: any, callback: () => void) {
    if (debouncer instanceof Debouncer) {
      debouncer._cancelAsync();
    } else {
      // eslint-disable-next-line no-param-reassign
      debouncer = new Debouncer();
    }
    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }
  private _asyncModule: any;
  private _callback: () => void;
  private _timer: number | null;

  constructor() {}

  setConfig(asyncModule: any, callback: () => void) {
    this._asyncModule = asyncModule;
    this._callback = callback;
    this._timer = this._asyncModule.run(() => {
      this._timer = null;
      debouncerQueue.delete(this);
      this._callback();
    });
  }

  cancel() {
    if (this.isActive()) {
      this._cancelAsync();
      debouncerQueue.delete(this);
    }
  }

  _cancelAsync() {
    if (this.isActive()) {
      this._asyncModule.cancel(/** @type {number} */ this._timer);
      this._timer = null;
    }
  }

  flush() {
    if (this.isActive()) {
      this.cancel();
      this._callback();
    }
  }

  isActive() {
    return this._timer !== null;
  }
}

export function enqueueDebouncer(debouncer: Debouncer) {
  debouncerQueue.add(debouncer);
}

export function flushDebouncers() {
  const didFlush = Boolean(debouncerQueue.size);
  debouncerQueue.forEach((debouncer) => {
    try {
      debouncer.flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  });
  return didFlush;
}

export const flush = () => {
  let debouncers;
  do {
    debouncers = flushDebouncers();
  } while (debouncers);
};
