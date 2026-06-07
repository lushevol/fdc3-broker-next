import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, Modal, TimePicker, Tooltip } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { FieldOption } from "src/api";

interface ChoiceConfigurationProps {
  choices?: FieldOption[];
  onChange: (choices: FieldOption[]) => void;
  dataType?: string;
  fieldType?: string;
  readonly?: boolean;
}

export function ChoiceConfiguration({
  choices = [],
  onChange,
  dataType,
  fieldType,
  readonly = false,
}: ChoiceConfigurationProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addChoice = () => {
    if (readonly) return;
    const newChoice: FieldOption = {
      id: Date.now().toString(),
      label: "",
      value: "",
      default: false,
    };
    setEditingId(newChoice.id);
    onChange([...choices, newChoice]);
  };

  const removeChoice = (id: string) => {
    Modal.confirm({
      title: "Delete Option",
      content: "Are you sure you want to remove this option?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        onChange(choices.filter((c) => c.id !== id));
      },
    });
  };

  const startEdit = (choice: FieldOption) => {
    if (readonly) return;
    setEditingId(choice.id);
  };

  const updateChoice = (
    id: string,
    field: "label" | "value",
    newValue: string
  ) => {
    if (readonly) return;
    onChange(
      choices.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]: newValue,
            }
          : c
      )
    );
  };

  const stopEdit = () => {
    setEditingId(null);
  };

  const toggleDefault = (id: string) => {
    if (readonly) return;
    // Only one default for SINGLE_CHOICE_DROPDOWN or RADIO.
    // CHECKBOX allows multiple defaults.
    if (fieldType === "SINGLE_CHOICE_DROPDOWN" || fieldType === "RADIO") {
      onChange(
        choices.map((c) => ({
          ...c,
          default: c.id === id ? !c.default : false,
        }))
      );
      return;
    }

    onChange(
      choices.map((c) => ({
        ...c,
        default: c.id === id ? !c.default : c.default,
      }))
    );
  };

  return (
    <div className="space-y-4 ">
      {/* Display message when no options exist */}
      {choices.length === 0 ? (
        <div className="text-[#666666] bg-[#f9f9f9] border-[#CCCCCC] dark:border-[#737373] dark:bg-[#333333] dark:text-[#999999] text-center py-8 text-gray-500  rounded-lg border-2 border-dashed">
          No options added yet. Click "Add New Option" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              className="border border-gray-200 dark:border-dark-divide-base rounded-lg p-4 bg-[#f2f2f2] dark:bg-[#333333]"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm text-light-content-label-text dark:text-dark-content-label-text font-medium">
                  Option {index + 1}
                </span>
              </div>

              {editingId === choice.id ? (
                <div className="space-y-3">
                  <div className="flex items-end gap-4">
                    <div className="flex-1 flex gap-4 min-w-0">
                      <div className="w-[104px] flex-shrink-0 min-w-0">
                        <label
                          htmlFor={`edit-label-${choice.id}`}
                          className="flex items-center gap-2 text-sm font-medium text-light-content-label-text dark:text-dark-content-label-text mb-1"
                        >
                          Label <span className="text-red-500">*</span>
                          <Tooltip title="Enter display label (shown to users)">
                            <InfoCircleOutlined className="text-light-link-primary-default dark:text-dark-link-primary-default hover:text-gray-600 cursor-pointer" />
                          </Tooltip>
                        </label>
                        <Input
                          id={`edit-label-${choice.id}`}
                          type="text"
                          value={choice.label}
                          onChange={(e) => {
                            updateChoice(choice.id, "label", e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              stopEdit();
                            }
                          }}
                          className={cn(
                            "w-full px-3 rounded-md text-sm h-8",
                            "border border-gray-300 dark:border-dark-secondary-default",
                            "dark:bg-dark-container-layer dark:text-dark-input-text",
                            "placeholder-light-placeholder-text dark:placeholder-dark-placeholder-text",
                            "[&.ant-input-disabled]:cursor-not-allowed",
                            "[&.ant-input-disabled]:text-light-input-text dark:[&.ant-input-disabled]:text-dark-input-text",
                            "[&.ant-input-disabled]:bg-light-solid-disabled dark:[&.ant-input-disabled]:bg-dark-solid-disabled",
                            "[&.ant-input-disabled]:border-light-secondary-disabled dark:[&.ant-input-disabled]:border-dark-secondary-disabled"
                          )}
                          placeholder="Enter Option"
                          autoFocus
                          disabled={readonly}
                        />
                      </div>
                      <div className="w-[330px] flex-shrink-0 min-w-0">
                        <label
                          htmlFor={`edit-value-${choice.id}`}
                          className="flex items-center gap-2 text-sm font-medium text-light-content-label-text dark:text-dark-content-label-text mb-1"
                        >
                          Value <span className="text-red-500">*</span>
                          <Tooltip title="Enter internal identifier(for consistent system usage)">
                            <InfoCircleOutlined className="text-light-link-primary-default dark:text-dark-link-primary-default hover:text-gray-600 cursor-pointer" />
                          </Tooltip>
                        </label>
                        {dataType === "Date" ? (
                          <DatePicker
                            value={
                              choice.value ? dayjs(choice.value) : undefined
                            }
                            onChange={(date, dateString) => {
                              const value =
                                typeof dateString === "string"
                                  ? dateString
                                  : Array.isArray(dateString)
                                  ? dateString[0] || ""
                                  : "";
                              updateChoice(choice.id, "value", value);
                            }}
                            className="w-full h-8"
                            format="YYYY-MM-DD"
                            placeholder="Select date"
                            disabled={readonly}
                          />
                        ) : dataType === "Time" ? (
                          <TimePicker
                            value={
                              choice.value
                                ? dayjs(choice.value, "HH:mm:ss")
                                : undefined
                            }
                            onChange={(time, timeString) => {
                              const value =
                                typeof timeString === "string"
                                  ? timeString
                                  : Array.isArray(timeString)
                                  ? timeString[0] || ""
                                  : "";
                              updateChoice(choice.id, "value", value);
                            }}
                            className="w-full h-8"
                            format="HH:mm:ss"
                            placeholder="Select time"
                            disabled={readonly}
                          />
                        ) : (
                          <Input
                            id={`edit-value-${choice.id}`}
                            type="text"
                            value={choice.value}
                            onChange={(e) => {
                              updateChoice(choice.id, "value", e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                stopEdit();
                              }
                            }}
                            className={cn(
                              "w-full px-3 rounded-md text-sm h-8",
                              "border border-gray-300 dark:border-dark-secondary-default",
                              "dark:bg-dark-container-layer dark:text-dark-input-text",
                              "placeholder-light-placeholder-text dark:placeholder-dark-placeholder-text",
                              "[&.ant-input-disabled]:cursor-not-allowed",
                              "[&.ant-input-disabled]:text-light-input-text dark:[&.ant-input-disabled]:text-dark-input-text",
                              "[&.ant-input-disabled]:bg-light-solid-disabled dark:[&.ant-input-disabled]:bg-dark-solid-disabled",
                              "[&.ant-input-disabled]:border-light-secondary-disabled dark:[&.ant-input-disabled]:border-dark-secondary-disabled"
                            )}
                            placeholder="Enter Option"
                            disabled={readonly}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 h-8">
                      <button
                        type="button"
                        onClick={() => toggleDefault(choice.id)}
                        className="transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ color: "#0473EA" }}
                        title={
                          choice.default ? "Remove Default" : "Set Default"
                        }
                        disabled={readonly}
                      >
                        {choice.default ? (
                          <StarFilled
                            className="text-base"
                            style={{ color: "#0473EA" }}
                          />
                        ) : (
                          <StarOutlined
                            className="text-base"
                            style={{ color: "#0473EA" }}
                          />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeChoice(choice.id)}
                        className="transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ color: "#0473EA" }}
                        title="Delete Option"
                        disabled={readonly}
                      >
                        <span
                          className="flowzero-iconfont icon-trash-bin-delete text-base"
                          style={{ color: "#0473EA" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-4">
                  <div
                    className="flex-1 flex gap-4 min-w-0 cursor-pointer p-2 -m-2 rounded"
                    role="button"
                    tabIndex={0}
                    aria-label="Edit option"
                    onClick={() => !readonly && startEdit(choice)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") startEdit(choice);
                    }}
                  >
                    <div className="w-[104px] flex-shrink-0 min-w-0">
                      <label
                        htmlFor={`view-label-${choice.id}`}
                        className="flex items-center gap-2 text-sm font-medium text-light-content-label-text dark:text-dark-content-label-text mb-1"
                      >
                        Label <span className="text-red-500">*</span>
                        <Tooltip title="Enter display label (shown to users)">
                          <InfoCircleOutlined className="text-light-link-primary-default dark:text-dark-link-primary-default hover:text-gray-600 cursor-pointer" />
                        </Tooltip>
                      </label>
                      <input
                        className={cn(
                          "h-8 w-full",
                          "focus:outline-none",
                          "px-3 rounded border border-gray-300 dark:border-dark-secondary-default",
                          "text-sm",
                          "truncate whitespace-nowrap",
                          "dark:bg-dark-container-layer dark:text-dark-input-text",
                          choice.label
                            ? "text-light-input-text dark:text-dark-input-text"
                            : "text-light-placeholder-text dark:text-dark-placeholder-text",
                          "disabled:cursor-not-allowed",
                          "disabled:bg-light-solid-disabled dark:disabled:bg-dark-solid-disabled",
                          "disabled:border-light-secondary-disabled dark:disabled:border-dark-secondary-disabled",
                          "disabled:text-light-input-text dark:disabled:text-dark-input-text"
                        )}
                        disabled={readonly}
                        value={choice.label || "Enter Option"}
                      />
                    </div>
                    <div className="w-[330px] flex-shrink-0 min-w-0">
                      <label
                        htmlFor={`view-value-${choice.id}`}
                        className="flex items-center gap-2 text-sm font-medium text-light-content-label-text dark:text-dark-content-label-text mb-1"
                      >
                        Value <span className="text-red-500">*</span>
                        <Tooltip title="Enter internal identifier(for consistent system usage)">
                          <InfoCircleOutlined className="text-light-link-primary-default dark:text-dark-link-primary-default hover:text-gray-600 cursor-pointer" />
                        </Tooltip>
                      </label>
                      <input
                        className={cn(
                          "h-8 w-full",
                          "focus:outline-none",
                          "px-3 rounded border border-gray-300 dark:border-dark-secondary-default",
                          "text-sm",
                          "truncate whitespace-nowrap",
                          "dark:bg-dark-container-layer dark:text-dark-input-text",
                          choice.value
                            ? "text-light-input-text dark:text-dark-input-text"
                            : "text-light-placeholder-text dark:text-dark-placeholder-text",
                          "disabled:cursor-not-allowed",
                          "disabled:bg-light-solid-disabled dark:disabled:bg-dark-solid-disabled",
                          "disabled:border-light-secondary-disabled dark:disabled:border-dark-secondary-disabled",
                          "disabled:text-light-input-text dark:disabled:text-dark-input-text"
                        )}
                        value={choice.value || "Enter Option"}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 h-8">
                    <button
                      type="button"
                      onClick={() => toggleDefault(choice.id)}
                      className="transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: "#0473EA" }}
                      title={choice.default ? "Remove Default" : "Set Default"}
                      disabled={readonly}
                    >
                      {choice.default ? (
                        <StarFilled
                          className="text-base"
                          style={{ color: "#0473EA" }}
                        />
                      ) : (
                        <StarOutlined
                          className="text-base"
                          style={{ color: "#0473EA" }}
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChoice(choice.id)}
                      className="transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: "#0473EA" }}
                      title="Delete Option"
                      disabled={readonly}
                    >
                      <span
                        className="flowzero-iconfont icon-trash-bin-delete text-base"
                        style={{ color: "#0473EA" }}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addChoice}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:border-blue-500 enabled:hover:text-blue-600"
        disabled={readonly}
      >
        <PlusOutlined className="w-4 h-4" />
        Add New Option
      </button>
    </div>
  );
}
