import { Alert } from "antd";
import { FC } from "react";

export type AlertType = "error" | "info" | "success" | "warning";

interface AlertWrapperProps {
  message: string;
  type: AlertType;
}

export const AlertWrapper: FC<AlertWrapperProps> = ({ message, type }) => {
  const backgroundColor =
    type === "error" ? "var(--base-color-danger-red)" : "var(--blue)";

  return (
    <Alert
      message={message}
      type={type}
      style={{
        marginBottom: 5,
        background: backgroundColor,
        fontSize: 12,
        color: "#fff",
        borderRadius: "4px",
        padding: "8px 16px",
      }}
    />
  );
};
