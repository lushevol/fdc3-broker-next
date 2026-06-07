import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, InputNumber, Space, Typography } from "antd";
import React from "react";

import { ComponentType } from "../../types";
import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";

const createDefaultOptions = (count: number) =>
  Array.from({ length: count }, () => ({
    label: "",
    value: "",
  }));

const resizeOptions = (
  options: { label: string; value: string }[],
  count: number
): { label: string; value: string }[] => {
  const normalized = options.length > 0 ? options : createDefaultOptions(1);
  return Array.from({ length: count }, (_, index) => {
    const current = normalized[index];
    if (current) {
      return { ...current };
    }
    return { label: "", value: "" };
  });
};

export const SelectOptionsSection: React.FC<SectionProps> = ({
  selectedNode,
  onPropChange,
}) => {
  const isSelect = selectedNode.type === ComponentType.SELECT;
  const isCheckboxOrRadio =
    selectedNode.type === ComponentType.CHECKBOX ||
    selectedNode.type === ComponentType.RADIO;

  if (!isSelect && !isCheckboxOrRadio) {
    return null;
  }

  const options = selectedNode.props.options || [];

  const handleLabelChange = (index: number, label: string) => {
    const nextOptions = [...options];
    nextOptions[index] = { ...nextOptions[index], label };
    onPropChange("options", nextOptions);
  };

  const handleValueChange = (index: number, value: string) => {
    const nextOptions = [...options];
    nextOptions[index] = { ...nextOptions[index], value };
    onPropChange("options", nextOptions);
  };

  const handleCountChange = (value: number | null) => {
    if (value === null || Number.isNaN(value)) {
      return;
    }
    const count = Math.max(1, Math.min(20, Math.floor(value)));
    onPropChange("options", resizeOptions(options, count));
  };

  const optionCount = Math.max(1, options.length || 1);

  return (
    <SectionCard title="Options">
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        {isCheckboxOrRadio ? (
          <Flex justify="space-between" align="center" gap={8}>
            <Typography.Text>Option Count</Typography.Text>
            <InputNumber
              min={1}
              max={20}
              value={optionCount}
              onChange={handleCountChange}
            />
          </Flex>
        ) : null}

        {options.map((option, index) => (
          <Flex key={index} gap={8}>
            <Input
              value={option.label}
              placeholder="Enter Option"
              onChange={(event) => handleLabelChange(index, event.target.value)}
            />
            <Input
              value={option.value}
              placeholder="Enter Option"
              style={{ width: 92 }}
              onChange={(event) => handleValueChange(index, event.target.value)}
            />
          </Flex>
        ))}

        {isSelect ? (
          <Button
            type="dashed"
            block
            icon={<PlusOutlined style={{ fontSize: 16 }} />}
            onClick={() =>
              onPropChange("options", [...options, { label: "", value: "" }])
            }
          >
            Add Option
          </Button>
        ) : null}
      </Space>
    </SectionCard>
  );
};
