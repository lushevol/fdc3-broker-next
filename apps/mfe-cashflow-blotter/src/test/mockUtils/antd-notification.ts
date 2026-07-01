import { NotificationInstance } from "antd/es/notification/interface";

import { fn } from "../test-utils";

export const mockNotificationInstance = jest.fn<NotificationInstance, []>(
  () => {
    return {
      success: fn(),
      error: fn(),
      info: fn(),
      warning: fn(),
      open: fn(),
      destroy: fn(),
    };
  }
);
