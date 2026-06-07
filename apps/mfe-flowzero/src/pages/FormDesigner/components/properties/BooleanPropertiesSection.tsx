import { Form, Input, Radio } from "antd";
import React from "react";

import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";
import { ValidationSection } from "./ValidationSection";

type BooleanPropertiesSectionProps = Pick<
  SectionProps,
  "selectedNode" | "onPropChange"
>;

export const BooleanPropertiesSection: React.FC<
  BooleanPropertiesSectionProps
> = ({ selectedNode, onPropChange }) => {
  const fieldLocked = !!selectedNode.props.fieldLocked;
  // defaultValue may be stored as boolean or string "true"/"false"
  const rawDefault = selectedNode.props.defaultValue;
  const defaultValue =
    rawDefault === true || rawDefault === "true"
      ? "true"
      : rawDefault === false || rawDefault === "false"
      ? "false"
      : undefined;

  return (
    <div className="space-y-4">
      <SectionCard title="Content">
        <Form layout="vertical">
          <Form.Item label="Label" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Enter Value"
              value={selectedNode.props.label ?? ""}
              onChange={(event) => onPropChange("label", event.target.value)}
              disabled
            />
          </Form.Item>
          <Form.Item label="Default Value" style={{ marginBottom: 0 }}>
            <Radio.Group
              value={defaultValue}
              onChange={(e) =>
                onPropChange("defaultValue", e.target.value === "true")
              }
              disabled={fieldLocked}
            >
              <Radio value="true">True</Radio>
              <Radio value="false">False</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </SectionCard>

      <ValidationSection
        selectedNode={selectedNode}
        onPropChange={onPropChange}
      />
    </div>
  );
};
