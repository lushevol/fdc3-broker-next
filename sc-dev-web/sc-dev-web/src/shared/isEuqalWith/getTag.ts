export function getTag<T>(value: T) {
  // eslint-disable-next-line eqeqeq
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}
