import { DatePicker, Form, Input, InputNumber } from "antd";
const { TextArea } = Input;
import dayjs, { type Dayjs } from "dayjs";
import React from "react";
import { formatWithThousandSeparators } from "src/util/common";

import { ComponentType } from "../../types";
import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";

export const ContentSection: React.FC<SectionProps> = ({
  selectedNode,
  onPropChange,
}) => {
  const fieldLocked = !!selectedNode.props.fieldLocked;
  const [datePickerPanelDate, setDatePickerPanelDate] = React.useState<Dayjs>(
    selectedNode.props.defaultValue
      ? dayjs(selectedNode.props.defaultValue as string)
      : dayjs()
  );
  const [timePickerPanelDate, setTimePickerPanelDate] = React.useState<Dayjs>(
    selectedNode.props.defaultValue
      ? dayjs(selectedNode.props.defaultValue as string)
      : dayjs()
  );
  const isOutsideCurrentMonth = (date: Dayjs) =>
    date.month() !== datePickerPanelDate.month() ||
    date.year() !== datePickerPanelDate.year();
  const isOutsideCurrentMonthForTimePicker = (date: Dayjs) =>
    date.month() !== timePickerPanelDate.month() ||
    date.year() !== timePickerPanelDate.year();
  const hasContentFields =
    selectedNode.props.label !== undefined ||
    selectedNode.props.content !== undefined ||
    selectedNode.props.placeholder !== undefined ||
    selectedNode.props.defaultValue !== undefined;

  const LAYOUT_TYPES = [
    ComponentType.CONTAINER,
    ComponentType.TABS,
    ComponentType.TAB_ITEM,
    ComponentType.TEXT,
    ComponentType.TITLE,
  ];
  const showLabel = !LAYOUT_TYPES.includes(selectedNode.type);

  if (!hasContentFields) {
    return null;
  }
  return (
    <SectionCard title="Content">
      <Form
        layout="vertical"
        className="[&_.ant-form-item-label>label]:!font-medium"
      >
        {showLabel && (
          <Form.Item label="Label" style={{ marginBottom: 12 }}>
            <Input
              value={selectedNode.props.label ?? ""}
              onChange={(event) => onPropChange("label", event.target.value)}
              disabled
            />
          </Form.Item>
        )}
        {selectedNode.props.content !== undefined && (
          <Form.Item
            label={
              selectedNode.type === ComponentType.BUTTON
                ? "Button Text"
                : "Text Content"
            }
            style={{ marginBottom: 12 }}
          >
            <Input
              value={selectedNode.props.content ?? ""}
              onChange={(event) => onPropChange("content", event.target.value)}
              disabled={fieldLocked}
            />
          </Form.Item>
        )}
        {selectedNode.props.placeholder !== undefined && (
          <Form.Item label="Placeholder" style={{ marginBottom: 12 }}>
            <Input
              value={selectedNode.props.placeholder ?? ""}
              onChange={(event) =>
                onPropChange("placeholder", event.target.value)
              }
            />
          </Form.Item>
        )}
        {selectedNode.props.label !== undefined && (
          <Form.Item label="Default Value" style={{ marginBottom: 0 }}>
            {selectedNode.type === ComponentType.DATE_PICKER ? (
              <DatePicker
                style={{ width: "100%" }}
                value={
                  selectedNode.props.defaultValue
                    ? dayjs(selectedNode.props.defaultValue as string)
                    : null
                }
                onChange={(_, dateString) =>
                  onPropChange("defaultValue", dateString as string)
                }
                disabled={fieldLocked}
                inputReadOnly
                disabledDate={isOutsideCurrentMonth}
                onPanelChange={(date) => setDatePickerPanelDate(date)}
              />
            ) : selectedNode.type === ComponentType.TIME_PICKER ? (
              <DatePicker
                showTime={{ use12Hours: true, format: "hh:mm:ss a" }}
                style={{ width: "100%" }}
                format="YYYY-MM-DD hh:mm:ss a"
                value={
                  selectedNode.props.defaultValue
                    ? dayjs(selectedNode.props.defaultValue as string)
                    : null
                }
                onChange={(_, datetimeString) =>
                  onPropChange("defaultValue", datetimeString as string)
                }
                disabled={fieldLocked}
                inputReadOnly
                disabledDate={isOutsideCurrentMonthForTimePicker}
                onPanelChange={(date) => setTimePickerPanelDate(date)}
              />
            ) : selectedNode.type === ComponentType.INPUT_NUMBER ? (
              <InputNumber
                style={{ width: "100%" }}
                stringMode
                value={
                  selectedNode.props.defaultValue !== undefined &&
                  selectedNode.props.defaultValue !== ""
                    ? (selectedNode.props.defaultValue as string)
                    : null
                }
                onChange={(val) => onPropChange("defaultValue", val ?? "")}
                onKeyDown={(e) => {
                  const allowed = /^[0-9.\-]$/;
                  if (e.key.length === 1 && !allowed.test(e.key))
                    e.preventDefault();
                }}
                formatter={(val) => formatWithThousandSeparators(val)}
                parser={(displayValue) =>
                  (displayValue || "").replace(/,/g, "")
                }
                placeholder="Enter default number"
                disabled={fieldLocked}
              />
            ) : selectedNode.type === ComponentType.TEXTAREA ? (
              <TextArea
                value={(selectedNode.props.defaultValue as string) ?? ""}
                onChange={(event) =>
                  onPropChange("defaultValue", event.target.value)
                }
                disabled={fieldLocked}
                rows={3}
              />
            ) : (
              <Input
                value={(selectedNode.props.defaultValue as string) ?? ""}
                onChange={(event) =>
                  onPropChange("defaultValue", event.target.value)
                }
                disabled={fieldLocked}
              />
            )}
          </Form.Item>
        )}
      </Form>
    </SectionCard>
  );
};
