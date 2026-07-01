export type NotifyParams<T> = {
  data?: T;
  error?: Error;
  isSuccess: boolean;
};

export type NotifyConfig<T> = (props: NotifyParams<T>) => {
  title: string;
  description?: string;
  type?: string;
  onClick?: (props: NotifyParams<T>) => void;
  onClose?: (props: NotifyParams<T>) => void;
};

export type AsyncTaskConfig<T> = {
  processor: Promise<T>;
  notify: NotifyConfig<T>;
};

export const ASYNC_TASK = "asyncTask";

export type EET<T> = {
  asyncTask: AsyncTaskConfig<T>;
};
