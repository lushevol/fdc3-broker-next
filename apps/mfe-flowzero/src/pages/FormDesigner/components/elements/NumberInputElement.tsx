import { InputNumber } from "antd";
import React from "react";
import { formatWithThousandSeparators } from "src/util/common";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const NumberInputElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, placeholder, defaultValue, style, className } =
    props;
  const [value, setValue] = React.useState<string | null>(
    defaultValue !== undefined && defaultValue !== ""
      ? (defaultValue as string)
      : null
  );
  const store = useDesignerStore();

  React.useEffect(() => {
    setValue(
      defaultValue !== undefined && defaultValue !== ""
        ? (defaultValue as string)
        : null
    );
  }, [defaultValue]);

  const handleChange = (val: string | null) => {
    setValue(val);
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node.props.indexedTerm, val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[0-9.\-]$/;
    const isControlKey = e.key.length > 1; // e.g. Backspace, Tab, ArrowLeft, Delete
    if (!isControlKey && !allowed.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <InputNumber
        style={{ width: "100%" }}
        placeholder={placeholder || "Enter number"}
        value={value}
        stringMode
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        formatter={(val) => formatWithThousandSeparators(val)}
        parser={(displayValue) => (displayValue || "").replace(/,/g, "")}
      />
    </div>
  );
};
