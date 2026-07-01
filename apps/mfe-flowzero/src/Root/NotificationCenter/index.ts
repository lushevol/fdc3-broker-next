import { App } from "antd";
import { useEffect } from "react";

import { EventEmitter } from "./EventEmitter";
import {
  AsyncTaskConfig,
  EET,
  NavigationRefreshPayload,
  WorkflowNavNode,
} from "./type";
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

export const emitNavigation = (workflowName: string) => {
  return NotificationCenter.emit("navigation", { workflowName });
};

export const onNavigation = (
  callback: (payload: NavigationRefreshPayload) => void
): (() => void) => {
  return NotificationCenter.disposableOn("navigation", callback);
};

export const emitWorkflowNavLoaded = (nodes: WorkflowNavNode[]) => {
  return NotificationCenter.emit("workflowNavLoaded", nodes);
};

export const onWorkflowNavLoaded = (
  callback: (nodes: WorkflowNavNode[]) => void
): (() => void) => {
  return NotificationCenter.disposableOn("workflowNavLoaded", callback);
};
