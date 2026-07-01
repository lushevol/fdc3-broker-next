import { Input } from "antd";
import React from "react";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const InputElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, placeholder, defaultValue, style, className } =
    props;
  const [value, setValue] = React.useState<string | undefined>(
    (defaultValue as string) || undefined
  );
  const store = useDesignerStore();

  React.useEffect(() => {
    setValue((defaultValue as string) || undefined);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node?.props?.indexedTerm, e.target.value);
    }
  };

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input placeholder={placeholder} value={value} onChange={handleChange} />
    </div>
  );
};
