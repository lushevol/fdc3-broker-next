export const promiseQueue = async <T>(promises: (() => Promise<T>)[]) => {
  for (const promiseFn of promises) {
    try {
      await promiseFn();
    } catch (error) {
      console.error(error);
    }
  }
};
