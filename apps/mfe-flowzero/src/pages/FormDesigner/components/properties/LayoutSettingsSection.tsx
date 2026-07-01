import { Form, InputNumber, Slider } from "antd";
import React from "react";

import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";

export const LayoutSettingsSection: React.FC<SectionProps> = ({
  selectedNode,
  onPropChange,
}) => {
  const columns = selectedNode.props.columns ?? 1;
  const gap = selectedNode.props.gap ?? 16;

  return (
    <SectionCard title="Layout Settings">
      <Form layout="vertical">
        <Form.Item
          label={`Grid Columns: ${columns}`}
          style={{ marginBottom: 12 }}
        >
          <Slider
            min={1}
            max={4}
            step={1}
            marks={{ 1: "1", 2: "2", 3: "3", 4: "4" }}
            value={columns}
            onChange={(value) =>
              onPropChange("columns", Array.isArray(value) ? value[0] : value)
            }
          />
        </Form.Item>
        <Form.Item label="Grid Gap (px)" style={{ marginBottom: 0 }}>
          <InputNumber
            min={0}
            max={64}
            value={gap}
            onChange={(value) => onPropChange("gap", Number(value ?? 0))}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </SectionCard>
  );
};
