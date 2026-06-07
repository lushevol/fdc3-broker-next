import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Space, Tooltip, Typography } from "antd";
import React from "react";

import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";
import { ValidationSection } from "./ValidationSection";

type DropdownPropertiesSectionProps = Pick<
  SectionProps,
  "selectedNode" | "onPropChange"
> & {
  showPlaceholder?: boolean;
  isCheckbox?: boolean;
  isMultiSelect?: boolean;
};

export const DropdownPropertiesSection: React.FC<
  DropdownPropertiesSectionProps
> = ({
  selectedNode,
  onPropChange,
  showPlaceholder = false,
  isCheckbox = false,
  isMultiSelect = false,
}) => {
  const fieldLocked = !!selectedNode.props.fieldLocked;
  const options = selectedNode.props.options || [];

  const handleSetDefault = (index: number) => {
    const allowMultiple = isCheckbox || isMultiSelect;
    const nextOptions = options.map((opt, i) => ({
      ...opt,
      default: i === index ? !opt.default : allowMultiple ? opt.default : false,
    }));
    onPropChange("options", nextOptions);
  };

  const handleOptionLabelChange = (index: number, label: string) => {
    const nextOptions = [...options];
    nextOptions[index] = { ...nextOptions[index], label };
    onPropChange("options", nextOptions);
  };

  const handleOptionValueChange = (index: number, value: string) => {
    const nextOptions = [...options];
    nextOptions[index] = { ...nextOptions[index], value };
    onPropChange("options", nextOptions);
  };

  const handleDeleteOption = (index: number) => {
    const nextOptions = options.filter((_, i) => i !== index);
    onPropChange("options", nextOptions);
  };

  const handleAddOption = () => {
    onPropChange("options", [
      ...options,
      { label: "", value: "", default: false },
    ]);
  };

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
          {showPlaceholder && (
            <Form.Item label="Placeholder" style={{ marginBottom: 0 }}>
              <Input
                placeholder="Enter Value"
                value={selectedNode.props.placeholder ?? ""}
                onChange={(event) =>
                  onPropChange("placeholder", event.target.value)
                }
              />
            </Form.Item>
          )}
        </Form>
      </SectionCard>

      <SectionCard title="Choice Configuration">
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {options.map((option, index) => {
            const isDefault = !!option.default;
            return (
              <div key={index}>
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ marginBottom: 8 }}
                >
                  <Typography.Text>{`Option ${index + 1}`}</Typography.Text>
                  <Space size={2}>
                    <Button
                      type="text"
                      icon={
                        isDefault ? (
                          <StarFilled
                            style={{ color: "#1677ff", fontSize: 14 }}
                          />
                        ) : (
                          <StarOutlined style={{ fontSize: 14 }} />
                        )
                      }
                      onClick={() => handleSetDefault(index)}
                      disabled={fieldLocked}
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined style={{ fontSize: 14 }} />}
                      onClick={() => handleDeleteOption(index)}
                      disabled={fieldLocked}
                    />
                  </Space>
                </Flex>

                <Form layout="vertical">
                  <Form.Item
                    label={
                      <span>
                        Label <span className="text-red-500">*</span>{" "}
                        <Tooltip title="Enter display label (shown to users)">
                          <InfoCircleOutlined style={{ color: "#1677ff" }} />
                        </Tooltip>
                      </span>
                    }
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      placeholder="Enter Option"
                      value={option.label}
                      onChange={(event) =>
                        handleOptionLabelChange(index, event.target.value)
                      }
                      disabled={fieldLocked}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Value <span className="text-red-500">*</span>{" "}
                        <Tooltip title="Enter internal identifier (for consistent system usage)">
                          <InfoCircleOutlined style={{ color: "#1677ff" }} />
                        </Tooltip>
                      </span>
                    }
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="Enter Option"
                      value={option.value}
                      onChange={(event) =>
                        handleOptionValueChange(index, event.target.value)
                      }
                      disabled={fieldLocked}
                    />
                  </Form.Item>
                </Form>
              </div>
            );
          })}

          {options.length === 0 && (
            <Typography.Text type="danger" style={{ fontSize: 12 }}>
              At least one option is required.
            </Typography.Text>
          )}

          <Button
            type="text"
            icon={<PlusOutlined style={{ fontSize: 14 }} />}
            onClick={handleAddOption}
            style={{ paddingInline: 0, width: "fit-content" }}
            disabled={fieldLocked}
          >
            Add New Option
          </Button>
        </Space>
      </SectionCard>

      <ValidationSection
        selectedNode={selectedNode}
        onPropChange={onPropChange}
      />
    </div>
  );
};
