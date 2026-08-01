let microtaskCurrHandle = 0;
let microtaskLastHandle = 0;
const microtaskCallbacks: Array<() => void> = [];
let microtaskScheduled = false;

function microtaskFlush() {
  microtaskScheduled = false;
  const len = microtaskCallbacks.length;
  for (let i = 0; i < len; i++) {
    const cb = microtaskCallbacks[i];
    if (cb) {
      try {
        cb();
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
    }
  }
  microtaskCallbacks.splice(0, len);
  microtaskLastHandle += len;
}

const timeOut = {
  after(delay: number) {
    return {
      run(fn: () => void) {
        return window.setTimeout(fn, delay);
      },
      cancel(handle: number) {
        window.clearTimeout(handle);
      },
    };
  },
  run(fn: () => void, delay: number) {
    return window.setTimeout(fn, delay);
  },
  cancel(handle: number) {
    window.clearTimeout(handle);
  },
};
export { timeOut };
const animationFrame = {
  run(fn: () => void) {
    return window.requestAnimationFrame(fn);
  },
  cancel(handle: number) {
    window.cancelAnimationFrame(handle);
  },
};
export { animationFrame };

const idlePeriod = {
  run(fn: () => void) {
    return window.requestIdleCallback ? window.requestIdleCallback(fn) : window.setTimeout(fn, 16);
  },
  cancel(handle: number) {
    if (window.cancelIdleCallback) {
      window.cancelIdleCallback(handle);
    } else {
      window.clearTimeout(handle);
    }
  },
};
export { idlePeriod };

const microTask = {
  run(callback: () => void) {
    if (!microtaskScheduled) {
      microtaskScheduled = true;
      queueMicrotask(() => microtaskFlush());
    }
    microtaskCallbacks.push(callback);
    const result = microtaskCurrHandle;
    microtaskCurrHandle += 1;
    return result;
  },

  cancel(handle: number) {
    const idx = handle - microtaskLastHandle;
    if (idx >= 0) {
      if (!microtaskCallbacks[idx]) {
        throw new Error(`invalid async handle: ${handle}`);
      }
      // @ts-ignore
      microtaskCallbacks[idx] = null;
    }
  },
};
export { microTask };
