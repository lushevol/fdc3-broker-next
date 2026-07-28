import { Button } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import { useCallback } from "react";
import { NOTIFICATION_RECONNECT_BTN } from "src/Root/analysis/const";

export const useReconnectNotification = (
  notificationApi: NotificationInstance
) => {
  const popReconnectNotification = useCallback(
    (reconnect: () => void, id: string) => {
      const onClickBtn = () => {
        reconnect();
        notificationApi?.destroy(id);
      };

      notificationApi?.error({
        key: id,
        message: "Notification Error",
        description:
          "The cashflow notification has been interrupted. Please retry when network is stable.",
        duration: 0,
        placement: "bottomRight",
        btn: (
          <Button
            type="primary"
            onClick={onClickBtn}
            data-testid={NOTIFICATION_RECONNECT_BTN}
          >
            Reconnect
          </Button>
        ),
      });
    },
    []
  );

  return {
    popReconnectNotification,
  };
};
