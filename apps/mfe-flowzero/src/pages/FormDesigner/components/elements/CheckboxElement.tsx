import { Checkbox } from "antd";
import React from "react";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const CheckboxElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, options, defaultValue, style, className } = props;
  const store = useDesignerStore();

  const computedDefaultValue =
    (Array.isArray(defaultValue) ? defaultValue : undefined) ??
    (typeof defaultValue === "string" && defaultValue
      ? [defaultValue]
      : undefined) ??
    options?.filter((opt) => opt.default).map((opt) => opt.value) ??
    [];

  const handleChange = (checkedValues: string[]) => {
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node.props.indexedTerm, checkedValues);
    }
  };

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Checkbox.Group
        key={computedDefaultValue.join(",")}
        className="flex flex-wrap gap-x-4 gap-y-2"
        defaultValue={computedDefaultValue}
        options={options?.map((opt) => ({
          label: opt.label,
          value: opt.value,
        }))}
        onChange={handleChange}
      />
    </div>
  );
};
