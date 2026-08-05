export function throttle(
  fn: (...args: any) => any,
  context: any,
  wait: number
) {
  let inThrottle: boolean;
  return function (...args: any) {
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}
