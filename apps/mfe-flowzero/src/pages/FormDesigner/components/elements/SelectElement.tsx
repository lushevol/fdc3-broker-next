import { Select } from "antd";
import React from "react";

import { useDesignerStore } from "../../store";
import { ComponentType } from "../../types";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const SelectElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, options, placeholder, style, className } = props;
  const store = useDesignerStore();
  const isMultiSelect = node?.type === ComponentType.MULTI_SELECT;
  const isSingleSelect = node?.type === ComponentType.SELECT;
  let computedDefaultValue: string | string[] | undefined;
  if (isMultiSelect) {
    if (Array.isArray(props.defaultValue)) {
      computedDefaultValue = props.defaultValue;
    } else {
      computedDefaultValue = options
        ?.filter((opt) => opt.default)
        .map((opt) => opt.value);
    }
  } else if (isSingleSelect) {
    if (props.defaultValue != null) {
      computedDefaultValue = props.defaultValue as string;
    } else {
      computedDefaultValue = options?.find((opt) => opt.default)?.value;
    }
  }

  const handleChange = (value: string | string[]) => {
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node.props.indexedTerm, value);
    }
  };

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        key={JSON.stringify(computedDefaultValue)}
        mode={isMultiSelect ? "multiple" : undefined}
        placeholder={placeholder || "Select an option"}
        defaultValue={computedDefaultValue}
        options={options?.map((opt) => ({
          label: opt.label,
          value: opt.value,
        }))}
        onChange={handleChange}
        style={{ width: "100%" }}
      />
    </div>
  );
};
