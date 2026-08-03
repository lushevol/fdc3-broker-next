export type NoInfer<T> = [T][T extends any ? 0 : never];

export const memo = <TDeps extends readonly any[], TDepArgs, TResult>(
  getDeps: (depArgs?: TDepArgs) => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
): ((depArgs?: TDepArgs) => TResult) => {
  let deps: any[] = [];
  let result: TResult;

  return (depArgs) => {
    const newDeps = getDeps(depArgs);

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep);

    if (!depsChanged) {
      return result;
    }

    deps = newDeps;

    result = fn(...newDeps);

    return result;
  };
};
