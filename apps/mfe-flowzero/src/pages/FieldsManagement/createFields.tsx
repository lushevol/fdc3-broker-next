import { ExclamationCircleOutlined } from "@ant-design/icons";
import { css, styled } from "@mui/material/styles";
import { Button, Checkbox, Form, message, Modal, Select } from "antd";
import cn from "classnames";
import _camelCase from "lodash-es/camelCase";
import { useCallback, useEffect, useState } from "react";
import {
  checkDuplicateField,
  createFields,
  FieldEntity,
  FieldOption,
  updateFields,
} from "src/api";
import DarkInput from "src/components/base/DarkInput";
import DarkSelect from "src/components/base/DarkSelect";
import { DefaultValueField } from "src/pages/FieldsManagement/DefaultValueField";

import { ChoiceConfiguration } from "./ChoiceConfiguration";
const StyleRoot = styled("div")(
  () => css`
    .create-fields {
      border-radius: 6px !important;
      overflow: hidden;
    }
    .ant-modal-header {
      height: 59px;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      margin: 0 24px;
      color: "#0D0D0D";
      .dark & {
        background: #262626 !important;
        color: #f2f2f2;
      }
    }
    .ant-modal-content {
      padding: 0 !important;
      border-radius: 6px !important;
      .dark & {
        background: #262626 !important;
      }
    }
    .ant-modal-title {
      color: #0d0d0d;
      .dark & {
        color: #f2f2f2;
        background: #262626 !important;
      }
    }
    .ant-modal-close {
      color: #0473ea;
      .dark & {
        color: #4f9df0;
      }
      &:hover {
        color: #0367d2;
        .dark & {
          color: #6db0f5;
        }
      }
    }
    .ant-modal-body {
      .dark & {
        background: #262626 !important;
      }
    }

    .ant-select-disabled {
      cursor: not-allowed;
      .ant-select-selector {
        cursor: not-allowed !important;
        background: #e5e5e5 !important;
        border-color: #cccccc !important;
        .dark & {
          background: #0d0d0d !important;
          border-color: #333333 !important;
        }
      }
      .ant-select-selection-item {
        color: #333333 !important;
        .dark & {
          color: #cccccc !important;
        }
      }
      .ant-select-arrow {
        color: #999999 !important;
        .dark & {
          color: #666666 !important;
        }
      }
    }

    .ant-select-selection-item {
      color: #333333 !important;
      .dark & {
        color: #cccccc !important;
      }
    }

    .variable-check {
      .ant-checkbox-wrapper {
        position: relative;
        .ant-checkbox {
          position: absolute;
          top: 7px;
        }
        .ant-checkbox-label {
          margin-left: 15px;
        }
      }
    }
  `
);
// Constants
const FIELD_CONSTANTS = {
  MAX_LABEL_LENGTH: 200,
  DATA_MAX_LENGTH: 100,
  LABEL_VALIDATION_PATTERN: /^[A-Za-z0-9 ]+$/,
} as const;

const FIELD_TYPE_MAPPING = {
  InputBox: "INPUT",
  TextArea: "TEXT_AREA",
  Radio: "RADIO",
  CheckBox: "CHECKBOX",
  SingleChoiceDropdown: "SINGLE_CHOICE_DROPDOWN",
  Switch: "SWITCH",
  InputNumber: "INPUT_NUMBER",
  DatePicker: "DATE_PICKER",
  TimePicker: "TIME_PICKER",
  IMAGE: "IMAGE",
  FileUpload: "File FILE_UPLOAD",
} as const;

const CHOICE_REQUIRED_FIELD_TYPES = [
  "CHECKBOX",
  "SINGLE_CHOICE_DROPDOWN",
  "MULTIPLE_CHOICE_DROPDOWN",
];

// Data type color mapping moved to a separate file
import {
  DATA_TYPE_COLOR,
  DataTypeColorMap,
  FIELD_DATATYPE_MAP,
  FieldDataType,
  isFieldDataType,
} from "./fieldType";

interface CreateFieldsProps {
  visible: boolean;
  onCancel: () => void;
  onSave?: (config: Partial<FieldEntity>) => void;
  editingField?: FieldEntity;
  mode?: "create" | "edit" | "view";
}

// interface FieldConfig {
//   label: string;
//   fieldType: string;
//   dataType: FieldDataType;
//   reporting: boolean;
//   inboxSearch: boolean;
//   workflowVariable: boolean;
//   choices: Choice[];
//   defaultValue?: any;
// }

type FieldFormErrors = {
  labelError: string;
  fieldTypeError: string;
  dataTypeError: string;
};

type ValidationState = {
  hasBlurred: boolean;
};

// Utility functions
// const getDataTypeString = (code: string | number): DataType => {
//   const codeString = code;
//   const typeEntry = Object.entries(DATA_TYPE_CODES).find(
//     ([, value]) => value === codeString
//   );
//   return (typeEntry?.[0] as DataType) || "String";
// };

const mapBackendTypeToFrontend = (
  backendType: string,
  dataType: string
): string => {
  const availableOptions = getFieldTypeOptions(dataType);
  const isDirectlyValid = availableOptions.some(
    (option) => option.value === backendType
  );

  if (isDirectlyValid) {
    return backendType;
  }

  const frontendType =
    FIELD_TYPE_MAPPING[backendType as keyof typeof FIELD_TYPE_MAPPING] ||
    backendType;
  const isValidOption = availableOptions.some(
    (option) => option.value === frontendType
  );
  return isValidOption ? frontendType : "";
};

const requiresOptions = (
  fieldType?: string,
  dataType?: FieldDataType
): boolean => {
  if (fieldType === "RADIO" && dataType === "STRING") return true;
  if (fieldType) {
    return CHOICE_REQUIRED_FIELD_TYPES.includes(fieldType);
  }
  return false;
};

const getFieldTypeOptions = (selectedDataType: string) => {
  const optionsByDataType = {
    STRING: [
      { value: "INPUT", label: "Input Box" },
      { value: "SINGLE_CHOICE_DROPDOWN", label: "SingleSelect" },
      { value: "RADIO", label: "Radio" },
      { value: "TEXT_AREA", label: "Text Area" },
    ],
    BOOLEAN: [
      { value: "SWITCH", label: "Switch" },
      {
        value: "RADIO",
        label: "Radio (Default Two Choices: True or False)",
      },
    ],
    NUMBER: [{ value: "INPUT_NUMBER", label: "Input Number" }],
    DATE: [{ value: "DATE_PICKER", label: "Date Picker" }],
    DATETIME: [{ value: "TIME_PICKER", label: "Time Picker" }],
    ARRAY: [
      { value: "CHECKBOX", label: "Checkbox" },
      { value: "MULTIPLE_CHOICE_DROPDOWN", label: "MultiSelect" },
    ],
  };

  return (
    optionsByDataType[selectedDataType as keyof typeof optionsByDataType] || []
  );
};

// Custom hooks
const useFieldForm = (editingField?: any) => {
  const [formState, setFormState] = useState<Partial<FieldEntity>>({
    id: "",
    label: "",
    uiType: "",
    dataType: "STRING",
    usedInReporting: "N",
    usedInInboxSearching: "N",
    metadata: [],
    defaultValue: undefined,
  });

  const [errors, setErrors] = useState<FieldFormErrors>({
    labelError: "",
    fieldTypeError: "",
    dataTypeError: "",
  });

  const [validationState, setValidationState] = useState<ValidationState>({
    hasBlurred: false,
  });

  const resetForm = useCallback(() => {
    setFormState({
      label: "",
      uiType: "",
      dataType: "STRING",
      usedInReporting: "N",
      usedInInboxSearching: "N",
      metadata: [],
      defaultValue: undefined,
    });
    setErrors({
      labelError: "",
      fieldTypeError: "",
      dataTypeError: "",
    });
    setValidationState({ hasBlurred: false });
  }, []);

  return {
    formState,
    setFormState,
    errors,
    setErrors,
    validationState,
    setValidationState,
    resetForm,
  };
};

export function CreateFields({
  visible,
  onCancel,
  onSave,
  editingField,
  mode,
}: CreateFieldsProps) {
  const isReferredByOtherForms =
    editingField?.formNames && editingField.formNames.length > 0;
  const readonly = mode === "view";
  const {
    formState,
    setFormState,
    errors,
    setErrors,
    validationState,
    setValidationState,
    resetForm,
  } = useFieldForm(editingField);
  // Parse metadata utility function
  const parseMetaData = useCallback((apiMetaData: string): FieldOption[] => {
    let parsedMetaData = apiMetaData;

    if (typeof apiMetaData === "string") {
      try {
        parsedMetaData = JSON.parse(apiMetaData);
      } catch (e) {
        console.error("Failed to parse metaData:", e);
        return [];
      }
    }

    return Array.isArray(parsedMetaData)
      ? parsedMetaData.map((item: FieldOption, index: number) => ({
          id: item.id || (index + 1).toString(),
          label: item.label || item.value || "",
          value: item.value || "",
          default: item.default,
        }))
      : [];
  }, []);

  // Initialize form with editing data
  useEffect(() => {
    if (editingField && visible) {
      setFormState({
        id: editingField.id,
        label: editingField.label || "",
        dataType: editingField.dataType,
        uiType: mapBackendTypeToFrontend(
          editingField.uiType || "",
          editingField.dataType
        ),
        usedInReporting: editingField.usedInReporting,
        usedInInboxSearching: editingField.usedInInboxSearching,
        metadata: editingField.metadata,
        defaultValue: editingField.defaultValue,
      });

      setErrors({
        labelError: "",
        fieldTypeError: "",
        dataTypeError: "",
      });

      setValidationState({ hasBlurred: false });
    } else if (visible) {
      resetForm();
    }
  }, [
    editingField,
    visible,
    resetForm,
    parseMetaData,
    setFormState,
    setErrors,
    setValidationState,
  ]);

  // Validation functions
  const validateFieldLabel = useCallback((label: string = ""): string => {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) {
      return "Please input field label!";
    }

    if (!FIELD_CONSTANTS.LABEL_VALIDATION_PATTERN.test(trimmedLabel)) {
      return "Field label can only contain English letters, numbers, and spaces.";
    }

    if (trimmedLabel.length > FIELD_CONSTANTS.MAX_LABEL_LENGTH) {
      return "Field label cannot exceed 200 characters.";
    }

    return "";
  }, []);

  const validateForm = useCallback((): boolean => {
    const labelValidationError = validateFieldLabel(formState.label);
    const dataTypeValidationError = !formState.dataType
      ? "Data type cannot be empty."
      : "";
    const fieldTypeValidationError = !formState.uiType
      ? "Please select a field type!"
      : "";

    setErrors({
      labelError: labelValidationError,
      dataTypeError: dataTypeValidationError,
      fieldTypeError: fieldTypeValidationError,
    });

    setValidationState({ hasBlurred: true });

    return (
      !labelValidationError &&
      !dataTypeValidationError &&
      !fieldTypeValidationError
    );
  }, [
    formState.label,
    formState.dataType,
    formState.uiType,
    validateFieldLabel,
    setErrors,
    setValidationState,
  ]);

  // Check for duplicate field labels on blur and input change
  useEffect(() => {
    if (validationState.hasBlurred) {
      const labelError = validateFieldLabel(formState.label);
      setErrors((prev) => ({ ...prev, labelError }));
    }
  }, [
    formState.label,
    validationState.hasBlurred,
    validateFieldLabel,
    setErrors,
  ]);

  // Field update handlers
  const updateFormField = useCallback(
    <K extends keyof FieldEntity>(field: K, value: FieldEntity[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [setFormState]
  );

  const handleLabelBlur = useCallback(() => {
    setValidationState({ hasBlurred: true });

    const trimmedLabel = formState?.label?.trim() ?? "";
    if (trimmedLabel !== formState?.label) {
      updateFormField("label", trimmedLabel);
    }

    // Run synchronous validation first; skip API call if it fails
    const basicError = validateFieldLabel(trimmedLabel);
    if (basicError) {
      setErrors((prev) => ({ ...prev, labelError: basicError }));
      return;
    }

    (async () => {
      if (!trimmedLabel) return;
      try {
        const isDuplicate = !(await checkDuplicateField({
          id: formState.id ?? "",
          label: trimmedLabel,
        }));
        setErrors((prev) => ({
          ...prev,
          labelError: isDuplicate ? "Field label already exists!" : "",
        }));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [
    formState.label,
    formState.id,
    updateFormField,
    validateFieldLabel,
    setValidationState,
    setErrors,
  ]);

  const handleDataTypeChange = useCallback(
    (newDataType: FieldDataType) => {
      console.log("Data type changed to:", newDataType);
      updateFormField("dataType", newDataType);

      // Always reset these fields when switching data type
      updateFormField("metadata", []);
      updateFormField("defaultValue", undefined);
      updateFormField("usedInReporting", "N");
      updateFormField("usedInInboxSearching", "N");

      // Set fieldType based on new data type
      if (newDataType === "DATETIME") {
        updateFormField("uiType", "TIME_PICKER");
      } else if (newDataType === "DATE") {
        updateFormField("uiType", "DATE_PICKER");
      } else if (newDataType === "NUMBER") {
        updateFormField("uiType", "INPUT_NUMBER");
      } else if (newDataType === "BOOLEAN") {
        updateFormField("uiType", "SWITCH");
      } else {
        updateFormField("uiType", "");
      }

      // Clear data type error if it exists
      if (errors.dataTypeError) {
        setErrors((prev) => ({ ...prev, dataTypeError: "" }));
      }
    },
    [errors.dataTypeError, updateFormField, setErrors]
  );

  const handleFieldTypeChange = useCallback(
    (newFieldType: string) => {
      console.log({ newFieldType, dataType: formState.dataType });
      updateFormField("uiType", newFieldType);
      // Reset default value for new fields
      updateFormField("defaultValue", undefined);
      // Set default choices for boolean radio
      if (newFieldType === "RADIO" && formState.dataType === "BOOLEAN") {
        updateFormField("metadata", [
          { id: "1", label: "True", value: "true", default: false },
          { id: "2", label: "False", value: "false", default: false },
        ]);
      } else if (requiresOptions(newFieldType, formState.dataType)) {
        updateFormField("metadata", []);
      }

      // Clear field type error if it exists
      if (errors.fieldTypeError) {
        setErrors((prev) => ({ ...prev, fieldTypeError: "" }));
      }
    },
    [formState.dataType, errors.fieldTypeError, updateFormField, setErrors]
  );

  const submitField = useCallback(
    async (config: Partial<FieldEntity>) => {
      if (editingField) {
        return await updateFields({ ...config, id: editingField.id });
      } else {
        return await createFields([config]);
      }
    },
    [editingField]
  );

  const validateChoicesIfRequired = useCallback((): boolean => {
    if (requiresOptions(formState.uiType, formState.dataType)) {
      if (formState.metadata && formState.metadata.length > 0) {
        const labels = formState.metadata.map((c) => c.label.trim());
        const values = formState.metadata.map((c) => c.value.trim());
        if (labels.some((l) => !l) || values.some((v) => !v)) {
          message.error("Option label and value cannot be empty.");
          return false;
        }
      } else {
        message.error("At least one option is required for this field type.");
        return false;
      }
    }
    return true;
  }, [formState.uiType, formState.dataType, formState.metadata]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();

    if (!validateForm() || !validateChoicesIfRequired()) {
      return;
    }

    const config: Partial<FieldEntity> = {
      label: formState.label,
      uiType: formState.uiType,
      dataType: formState.dataType,
      usedInReporting: formState.usedInReporting,
      usedInInboxSearching: formState.usedInInboxSearching,
      metadata: requiresOptions(formState.uiType, formState.dataType)
        ? formState.metadata
        : [],
      defaultValue: formState.defaultValue,
      status: "ACTIVE",
    };

    try {
      const response = await submitField(config);
      console.log("API Response:", response);

      message.success(
        editingField ? "Save Successfully " : "Create Successfully"
      );

      onSave?.(config);
      resetForm();
      onCancel();
    } catch (error) {
      // console.error("Error saving field:", error);
      // message.error(
      //   error?.response?.data || "Failed to save field configuration"
      // );
    }
  };

  const handleCancel = useCallback(() => {
    resetForm();
    onCancel();
  }, [resetForm, onCancel]);

  // Computed values for conditional rendering
  const showChoiceConfiguration = requiresOptions(
    formState.uiType ?? "",
    formState.dataType
  );

  const shouldShowDefaultValueField = () => {
    if (formState.dataType == "STRING" && formState.uiType == "RADIO")
      return false;

    return formState.uiType && !requiresOptions(formState.uiType);
  };

  return (
    <StyleRoot>
      <Modal
        title={
          mode === "edit"
            ? "Edit Field"
            : mode === "view"
            ? "View Field"
            : "Create Field"
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={628}
        styles={{
          body: {
            background: "#fff",
            padding: 0,
          },
        }}
        className="create-fields bg-light-container-layer dark:bg-dark-container-layer"
        centered
        maskClosable={false}
        getContainer={false}
      >
        <div className="border-b border-light-divide-base dark:border-dark-divide-base mb-6"></div>

        {/* Scrollable Content Area */}
        <div
          style={{
            height: mode === "view" ? "380px" : "316px",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "0 24px 24px 24px",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Field Information */}
            <section>
              <span className="block mb-2 text-light-content-label-text dark:text-dark-content-label-text">
                Field Label <span className="text-red-500">*</span>
              </span>
              <Form.Item
                validateStatus={errors.labelError ? "error" : ""}
                help={errors.labelError}
                className="mb-0"
              >
                <DarkInput
                  id="fieldLabel"
                  value={formState.label}
                  onChange={(e) => {
                    if (
                      e.target.value.length <= FIELD_CONSTANTS.MAX_LABEL_LENGTH
                    ) {
                      updateFormField("label", e.target.value);
                    }
                  }}
                  onBlur={handleLabelBlur}
                  maxLength={FIELD_CONSTANTS.MAX_LABEL_LENGTH}
                  placeholder="Enter field name"
                  className="w-full"
                  disabled={isReferredByOtherForms || readonly}
                />
              </Form.Item>
            </section>

            {/* Data Type Selection */}
            <section>
              <div>
                <span
                  id="dataTypeLabel"
                  className="block mb-2 text-light-content-label-text dark:text-dark-content-label-text"
                >
                  Data Type <span className="text-red-500">*</span>
                </span>
                <div
                  className="flex flex-wrap gap-2 mb-4"
                  role="group"
                  aria-labelledby="dataTypeLabel"
                >
                  {Object.entries(DATA_TYPE_COLOR).map(([key, colorMap]) => {
                    if (!isFieldDataType(key)) return null;
                    const map = colorMap as DataTypeColorMap;
                    const isSelected = formState.dataType === key;
                    const bg = isSelected ? map.selectedBg || map.bg : map.bg;
                    const text = isSelected
                      ? map.selectedColor || map.color
                      : map.color;
                    const hoverBg = map.hoverBg || map.bg;
                    const hoverText = map.hoverColor || map.color;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleDataTypeChange(key)}
                        className={cn(
                          "flex items-center justify-center h-[22px] px-[8px] rounded-[6px] text-[12px] transition-all duration-200 gap-1 border-none",
                          isSelected ? "" : ""
                        )}
                        style={{
                          backgroundColor: bg,
                          color: text,
                          border: "none",
                          cursor:
                            isReferredByOtherForms || readonly
                              ? "not-allowed"
                              : "pointer",
                        }}
                        onMouseOver={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = hoverBg;
                            e.currentTarget.style.color = hoverText;
                          }
                        }}
                        onFocus={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = hoverBg;
                            e.currentTarget.style.color = hoverText;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = bg;
                            e.currentTarget.style.color = text;
                          }
                        }}
                        onBlur={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = bg;
                            e.currentTarget.style.color = text;
                          }
                        }}
                        disabled={isReferredByOtherForms || readonly}
                      >
                        <span
                          className={cn(
                            "flowzero-iconfont",
                            map.icon,
                            "flex items-center justify-center w-[12px] text-[12px] mr-1"
                          )}
                          style={{
                            height: "22px",
                            lineHeight: "23px",
                          }}
                          aria-hidden="true"
                        ></span>
                        <span className="flex items-center h-[22px] leading-[22px]">
                          {map?.label ? map.label : FIELD_DATATYPE_MAP[key]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.dataTypeError && (
                  <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
                    <ExclamationCircleOutlined className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{errors.dataTypeError}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Field UI Type + Default/Option + Arrow/Divider Layout */}
            {formState.dataType && (
              <div className="flex flex-row items-stretch w-full">
                {/* Left: Arrow and divider line */}
                <div className="flex flex-col items-center pr-4 relative">
                  {/* Arrow icon, can be replaced with svg or flowzero-iconfont */}
                  <span className="rotate-180 flowzero-iconfont icon-arrow-chevron-nav-left-backward text-[#A6A6A6] dark:text-[#595959] text-xl mb-1" />
                  {/* Divider line, height is dynamic, h-full ensures same height as right content */}
                  <div
                    className="w-px  bg-light-secondary-default dark:bg-dark-secondary-default flex-1"
                    style={{ minHeight: 40 }}
                  />
                </div>
                {/* Right: main content */}
                <div className="flex-1">
                  {/* Field UI Type Selection */}
                  <section>
                    <span
                      id="fieldTypeLabel"
                      className={cn(
                        "block mb-2",
                        "text-light-content-label-text dark:text-dark-content-label-text",
                        "[&.ant-input-disabled]:text-light-input-text dark:[&.ant-input-disabled]:text-dark-input-text",
                        "[&.ant-input-disabled]:bg-light-solid-disabled dark:[&.ant-input-disabled]:bg-dark-solid-disabled",
                        "[&.ant-input-disabled]:border-light-secondary-disabled dark:[&.ant-input-disabled]:border-dark-secondary-disabled"
                      )}
                    >
                      Field Type <span className="text-red-500">*</span>
                    </span>
                    <Form.Item
                      validateStatus={errors.fieldTypeError ? "error" : ""}
                      help={errors.fieldTypeError}
                      className="mb-0"
                      required
                      label={false}
                    >
                      <DarkSelect
                        id="fieldType"
                        aria-labelledby="fieldTypeLabel"
                        value={formState.uiType || undefined}
                        onChange={handleFieldTypeChange}
                        // disabled={
                        //   formState.dataType == "IMAGE" ||
                        //   formState.dataType == "FILE"
                        // }
                        disabled={isReferredByOtherForms || readonly}
                        placeholder="Select field type"
                        className={`w-full  ${
                          formState.dataType !== "STRING"
                            ? " border-light-secondary-disabled dark:border-dark-secondary-disabled"
                            : ""
                        }`}
                      >
                        <>
                          {getFieldTypeOptions(formState.dataType).map(
                            (option) => {
                              const mapping =
                                require("./fieldType").FIELD_TYPE_MAPPING;
                              const icon = mapping[option.value]?.icon;

                              return (
                                <Select.Option
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div className="flex">
                                    {icon && (
                                      <span
                                        className={
                                          "flowzero-iconfont " +
                                          icon +
                                          " mr-2 text-base self-center"
                                        }
                                      />
                                    )}
                                    <span>{option.label}</span>
                                  </div>
                                </Select.Option>
                              );
                            }
                          )}
                        </>
                      </DarkSelect>
                    </Form.Item>
                  </section>

                  {/* Default Value Configuration */}
                  {shouldShowDefaultValueField() && (
                    <section className="mt-[16px]">
                      <DefaultValueField
                        fieldType={formState.uiType || ""}
                        dataType={formState.dataType}
                        value={formState.defaultValue}
                        onChange={(val) => {
                          updateFormField("defaultValue", val);
                        }}
                        readonly={readonly || !!isReferredByOtherForms}
                      />
                    </section>
                  )}

                  {/* Option Configuration */}
                  {showChoiceConfiguration && (
                    <section className="pb-4 mt-[16px]">
                      <ChoiceConfiguration
                        choices={formState.metadata}
                        onChange={(newChoices) =>
                          updateFormField("metadata", newChoices)
                        }
                        dataType={formState.dataType}
                        fieldType={formState.uiType}
                        readonly={readonly || !!isReferredByOtherForms}
                      />
                    </section>
                  )}
                </div>
              </div>
            )}

            {/* Field Usage Options */}
            <section>
              <div className="space-y-3 variable-check">
                {[
                  {
                    key: "usedInReporting",
                    checked: formState.usedInReporting === "Y",
                    label: "Report",
                    desc: "Make this field available in reports.",
                  },
                  {
                    key: "usedInInboxSearching",
                    checked: formState.usedInInboxSearching === "Y",
                    label: "Inbox Search",
                    desc: "Make this field searchable in the inbox.",
                  },
                  // {
                  //   key: "workflowVariable" as keyof FieldFormState,
                  //   checked: formState.workflowVariable,
                  //   label: "Workflow Variable",
                  //   desc: "Make this field available for workflow logic (routing rules, conditional validation)",
                  // },
                ].map((item) => (
                  <Form.Item className="mb-0" key={item.key as string}>
                    <Checkbox
                      checked={item.checked}
                      onChange={(e) =>
                        updateFormField(
                          item.key as keyof FieldEntity,
                          e.target.checked ? "Y" : "N"
                        )
                      }
                      disabled={readonly}
                      className={cn(
                        "dark:[&_.ant-checkbox-inner]:bg-dark-solid-disabled",
                        "dark:[&_.ant-checkbox-inner]:border-dark-secondary-disabled",
                        "dark:[&_.ant-checkbox-inner::after]:border-dark-link-primary-default",

                        "[&.ant-checkbox-wrapper-disabled]:cursor-not-allowed",
                        "[&.ant-checkbox-wrapper-disabled_.ant-checkbox-inner]:bg-light-solid-disabled",
                        "dark:[&.ant-checkbox-wrapper-disabled_.ant-checkbox-inner]:bg-dark-solid-disabled",
                        "[&.ant-checkbox-wrapper-disabled_.ant-checkbox-inner]:border-light-secondary-disabled",
                        "dark:[&.ant-checkbox-wrapper-disabled_.ant-checkbox-inner]:border-dark-secondary-disabled",
                        "[&.ant-checkbox-wrapper-disabled_.ant-checkbox-inner::after]:border-light-link-primary-default",
                        "dark:[&.ant-checkbox-wrapper-disabled_.ant-checkbox-inner::after]:border-dark-link-primary-default"
                      )}
                    >
                      <span className="text-light-input-text dark:text-dark-input-text">
                        {item.label}
                        <span className="block text-sm text-[#595959] dark:text-[#A6A6A6]">
                          {item.desc}
                        </span>
                      </span>
                    </Checkbox>
                  </Form.Item>
                ))}
              </div>
            </section>
          </form>
        </div>

        {/* Fixed Footer */}
        {mode !== "view" && (
          <div className="border-t border-light-divide-base dark:border-dark-divide-base dark:bg-dark-container-layer px-6 py-4 bg-white">
            <div className="flex justify-end items-center gap-2">
              <Button
                type="default"
                onClick={handleCancel}
                disabled={readonly}
                className="flex items-center h-[32px] leading-[32px] px-6 rounded-[32px] text-[#00172E] dark:text-[#9AC7F6] hover:bg-gray-200 "
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={!!errors.labelError || readonly}
                className="flex items-center h-[32px] leading-[32px] px-6 rounded-[32px] text-[#FFF] bg-[#0473EA] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </StyleRoot>
  );
}
