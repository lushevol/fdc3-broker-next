import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import React from "react";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const DatePickerElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, placeholder, defaultValue, style, className } =
    props;
  const [value, setValue] = React.useState<Dayjs | null>(
    defaultValue ? dayjs(defaultValue as string) : null
  );
  const [panelDate, setPanelDate] = React.useState<Dayjs>(
    defaultValue ? dayjs(defaultValue as string) : dayjs()
  );
  const store = useDesignerStore();

  React.useEffect(() => {
    setValue(defaultValue ? dayjs(defaultValue as string) : null);
  }, [defaultValue]);

  const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
    setValue(date);
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node.props.indexedTerm, dateString);
    }
  };

  const isOutsideCurrentMonth = (date: Dayjs) =>
    date.month() !== panelDate.month() || date.year() !== panelDate.year();

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DatePicker
        placeholder={placeholder || "Select date"}
        style={{ width: "100%" }}
        value={value}
        onChange={handleChange}
        inputReadOnly
        disabledDate={isOutsideCurrentMonth}
        onPanelChange={(date) => setPanelDate(date)}
      />
    </div>
  );
};
