import { Tag } from "antd";
import { FC, memo } from "react";

export const DisplayAmendment: FC<{ cashflow: CNCashflow["Cashflow"] }> = memo(
  ({ cashflow }) => {
    let color = "";
    const { Booking_System_Event, Cashflow_Event_Reason } = cashflow ?? {};
    if (Booking_System_Event === "Amendment") {
      switch (Cashflow_Event_Reason) {
        case "Reversal":
          color = "warning";
          break;
        case "Rebook":
          color = "success";
          break;
        default:
          break;
      }
      return <Tag color={color}>{Cashflow_Event_Reason}</Tag>;
    }
    return <></>;
  }
);
