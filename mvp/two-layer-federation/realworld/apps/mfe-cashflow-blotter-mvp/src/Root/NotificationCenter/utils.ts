import { NotificationInstance } from "antd/es/notification/interface";

import { NotifyConfig, NotifyParams } from "./type";

export const notificationGenerator = <T>(
  notifyConfig: NotifyConfig<T>,
  notifyParam: NotifyParams<T>,
  notificationInstance: NotificationInstance
) => {
  const finalNotifyConfig = notifyConfig(notifyParam);
  const type =
    finalNotifyConfig.type || notifyParam.isSuccess ? "success" : "error";
  return notificationInstance[type]({
    message: finalNotifyConfig.title,
    description: finalNotifyConfig.description,
    onClick: () => finalNotifyConfig.onClick?.(notifyParam),
    onClose: () => finalNotifyConfig.onClose?.(notifyParam),
    placement: "bottomRight",
  });
};
