type Func = (...args: any[]) => any

let timeoutId: ReturnType<typeof setTimeout> | number;
export const debounce = (func: Func, delay = 300) => {
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  };