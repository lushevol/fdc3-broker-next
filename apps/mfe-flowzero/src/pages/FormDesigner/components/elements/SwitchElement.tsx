import { Switch } from "antd";
import React from "react";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const SwitchElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, defaultValue, style, className } = props;
  const store = useDesignerStore();
  const [checked, setChecked] = React.useState<boolean>(Boolean(defaultValue));

  React.useEffect(() => {
    setChecked(Boolean(defaultValue));
  }, [defaultValue]);

  const handleChange = (value: boolean) => {
    setChecked(value);
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
      <Switch checked={checked} onChange={handleChange} />
    </div>
  );
};
