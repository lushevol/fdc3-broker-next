import { Button, Flex, Form, Select, Slider, Space, Typography } from "antd";
import React from "react";

import { ComponentType } from "../../types";
import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";
import { COLOR_OPTIONS, FONT_SIZE_OPTIONS, getPxNumber } from "./utils";

interface AppearanceSectionProps extends SectionProps {
  onPaddingChange: (padding: number) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  selectedNode,
  onStyleChange,
  onPaddingChange,
}) => {
  const supportsFontSize =
    selectedNode.type === ComponentType.TITLE ||
    selectedNode.type === ComponentType.TEXT;
  const supportsColor =
    selectedNode.type === ComponentType.BUTTON ||
    selectedNode.type === ComponentType.TITLE ||
    selectedNode.type === ComponentType.TEXT;
  const colorKey =
    selectedNode.type === ComponentType.BUTTON ? "backgroundColor" : "color";
  const colorValue = selectedNode.props.style?.[colorKey] as string | undefined;
  const padding = getPxNumber(selectedNode.props.style?.paddingTop, 0);

  return (
    <SectionCard title="Appearance">
      <Form layout="vertical">
        {supportsFontSize && (
          <Form.Item label="Font Size" style={{ marginBottom: 12 }}>
            <Select
              options={FONT_SIZE_OPTIONS}
              value={(selectedNode.props.style?.fontSize as string) || "14px"}
              onChange={(value) => onStyleChange("fontSize", value)}
            />
          </Form.Item>
        )}
        {supportsColor && (
          <Form.Item
            label={
              selectedNode.type === ComponentType.BUTTON
                ? "Background Color"
                : "Text Color"
            }
            style={{ marginBottom: 12 }}
          >
            <Space wrap size={8}>
              {COLOR_OPTIONS.map((color) => {
                const isSelected = colorValue === color;
                return (
                  <Button
                    key={color}
                    aria-label={`Pick color ${color}`}
                    onClick={() => onStyleChange(colorKey, color)}
                    style={{
                      width: 24,
                      minWidth: 24,
                      height: 24,
                      padding: 0,
                      borderRadius: "9999px",
                      backgroundColor: color,
                      border: isSelected
                        ? "2px solid #1677ff"
                        : "1px solid #d9d9d9",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(22, 119, 255, 0.2)"
                        : undefined,
                    }}
                  />
                );
              })}
            </Space>
          </Form.Item>
        )}
        <Form.Item label="Padding (Y-Axis)" style={{ marginBottom: 0 }}>
          <Slider
            min={0}
            max={64}
            value={padding}
            onChange={(value) =>
              onPaddingChange(Array.isArray(value) ? value[0] : value)
            }
          />
          <Flex justify="end">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {padding}px
            </Typography.Text>
          </Flex>
        </Form.Item>
      </Form>
    </SectionCard>
  );
};
