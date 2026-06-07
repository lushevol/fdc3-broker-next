import { Typography } from "antd";
import React from "react";

export const TabItemHint: React.FC = () => {
  return (
    <div className="space-y-1">
      <Typography.Text strong className="block">
        This is a Tab Item
      </Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Select the parent Tabs component to manage tab properties.
      </Typography.Text>
    </div>
  );
};
