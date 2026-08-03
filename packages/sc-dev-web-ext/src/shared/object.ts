
export type PartialDeepObject<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? PartialDeepObject<T[P]>
    : T[P];
};

export function isObject(item: any): item is object {
  return (item && Object.prototype.toString.call(item) === '[object Object]');
}

/** Deep merge two or more objects. */
export function deepMerge<T = object>(target: PartialDeepObject<T>, ...sources: PartialDeepObject<T>[]): T {
  if (!sources.length) return target as T;
  const source = sources.shift();

  if (isObject(target) && source && isObject(source)) {
    (Object.keys(source) as Array<keyof T>).forEach(key => {
      const value = source[key];
      if (isObject(value)) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        const o = target[key];
        if (o) deepMerge<PartialDeepObject<T[typeof key]>>(o, value);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
}