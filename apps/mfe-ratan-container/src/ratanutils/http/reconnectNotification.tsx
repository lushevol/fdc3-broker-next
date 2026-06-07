import { notification, Button } from "antd";
import { randomString } from "../utils";
import rtCreatePortal from "../../ratancomponents/Portal/rtCreatePortal";

export const reconnectNotification = (reconnect: Function) => {
  const key = randomString(5);
  const onClickBtn = () => {
    reconnect();
    notification.destroy(key);
  };

  rtCreatePortal(
    notification.error({
      key,
      message: "Subscription Error",
      description: "The data subscription has been interrupted.",
      duration: 10,
      btn: (
        <Button type="primary" onClick={onClickBtn}>
          Reconnect
        </Button>
      ),
    })
  );
};
