import { Form, Select } from "antd";
import React from "react";

import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";

const VALIDATION_RULE_OPTIONS = [{ label: "Required", value: "required" }];

type ValidationSectionProps = Pick<
  SectionProps,
  "selectedNode" | "onPropChange"
>;

export const ValidationSection: React.FC<ValidationSectionProps> = ({
  selectedNode,
  onPropChange,
}) => {
  if (selectedNode.props.required === undefined) {
    return null;
  }

  return (
    <SectionCard title="Validation">
      <Form
        layout="vertical"
        className="[&_.ant-form-item-label>label]:!font-medium"
      >
        <Form.Item label="Validation Rule" style={{ marginBottom: 0 }}>
          <Select
            placeholder="Select Rule"
            value={selectedNode.props.required ? "required" : undefined}
            options={VALIDATION_RULE_OPTIONS}
            onChange={(value) => onPropChange("required", value === "required")}
            allowClear
          />
        </Form.Item>
      </Form>
    </SectionCard>
  );
};
