import { SettingOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import React from "react";

export const EmptyProperties: React.FC = () => {
  return (
    <div className="w-80 bg-white border-l border-slate-200 p-6 flex items-center justify-center h-full">
      <Empty
        image={
          <SettingOutlined
            className="text-slate-300"
            style={{ fontSize: 48 }}
          />
        }
        description="Select a component on the canvas to configure its properties."
      />
    </div>
  );
};
