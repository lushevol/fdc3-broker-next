import { Form, Input, Switch } from "antd";
import cn from "classnames";
import React from "react";

import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";
import { ValidationSection } from "./ValidationSection";

type SwitchPropertiesSectionProps = Pick<
  SectionProps,
  "selectedNode" | "onPropChange"
>;

export const SwitchPropertiesSection: React.FC<
  SwitchPropertiesSectionProps
> = ({ selectedNode, onPropChange }) => {
  const fieldLocked = !!selectedNode.props.fieldLocked;
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
          <Form.Item style={{ marginBottom: 0 }}>
            <div
              className={cn(
                "flex items-center justify-between",
                "text-light-content-label-text",
                "text-[12px]"
              )}
            >
              <span>Default Value</span>
              <Switch
                checked={Boolean(selectedNode.props.defaultValue)}
                onChange={(checked) => onPropChange("defaultValue", checked)}
                disabled={fieldLocked}
              />
            </div>
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
