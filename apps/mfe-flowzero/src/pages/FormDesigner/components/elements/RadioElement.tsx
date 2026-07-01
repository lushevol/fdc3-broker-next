import { Radio, RadioChangeEvent } from "antd";
import React from "react";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

const BOOLEAN_OPTIONS = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
];

export const RadioElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, options, defaultValue, style, className, dataType } =
    props;
  const store = useDesignerStore();

  const isBooleanType = dataType === "BOOLEAN";

  const computedOptions = isBooleanType
    ? BOOLEAN_OPTIONS
    : options?.map((opt) => ({ label: opt.label, value: opt.value }));

  const computedDefaultValue = isBooleanType
    ? defaultValue === true || defaultValue === "true"
      ? "true"
      : defaultValue === false || defaultValue === "false"
      ? "false"
      : undefined
    : (typeof defaultValue === "string" ? defaultValue : undefined) ??
      options?.find((opt) => opt.default)?.value;

  const handleChange = (e: RadioChangeEvent) => {
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node.props.indexedTerm, e.target.value);
    }
  };

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Radio.Group
        key={computedDefaultValue}
        className="flex flex-wrap gap-x-4 gap-y-2"
        defaultValue={computedDefaultValue}
        options={computedOptions}
        onChange={handleChange}
      />
    </div>
  );
};
