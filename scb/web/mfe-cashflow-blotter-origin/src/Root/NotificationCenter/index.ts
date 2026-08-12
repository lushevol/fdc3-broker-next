import { App } from "antd";
import { useEffect } from "react";

import { EventEmitter } from "./EventEmitter";
import { AsyncTaskConfig, EET } from "./type";
import { notificationGenerator } from "./utils";

const NotificationCenter = new EventEmitter<EET<any>>();

export const useNotificationCenter = () => {
  const { notification } = App.useApp();
  useEffect(() => {
    NotificationCenter.on("asyncTask", (asyncTaskConfig) => {
      (async () => {
        try {
          const res = await asyncTaskConfig.processor;
          const notifyParams = { data: res, error: undefined, isSuccess: true };
          notificationGenerator(
            asyncTaskConfig.notify,
            notifyParams,
            notification
          );
        } catch (error) {
          const notifyParams = {
            data: undefined,
            error: error as Error,
            isSuccess: true,
          };
          notificationGenerator(
            asyncTaskConfig.notify,
            notifyParams,
            notification
          );
        }
      })();
    });
  }, []);
};

export const submitAsyncTask = <T>(asyncTaskConfig: AsyncTaskConfig<T>) => {
  return NotificationCenter.emit("asyncTask", asyncTaskConfig);
};
