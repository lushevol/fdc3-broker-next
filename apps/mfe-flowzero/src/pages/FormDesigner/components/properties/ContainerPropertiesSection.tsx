import { Form, Select } from "antd";
import React from "react";

import { SectionProps } from "./types";

type ContainerPropertiesSectionProps = Pick<
  SectionProps,
  "selectedNode" | "onPropChange"
>;

const COLUMN_OPTIONS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
];

export const ContainerPropertiesSection = ({
  selectedNode,
  onPropChange,
}: ContainerPropertiesSectionProps) => {
  return (
    <Form layout="vertical">
      <Form.Item label="Column" style={{ marginBottom: 0 }}>
        <Select
          value={selectedNode.props.columns ?? 1}
          options={COLUMN_OPTIONS}
          onChange={(value) => onPropChange("columns", value)}
        />
      </Form.Item>
    </Form>
  );
};
