import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";

import { useDesignerStore } from "../../store";
import { baseLabelClass, mergeCn } from "./common";
import { ElementRendererProps } from "./types";

dayjs.extend(customParseFormat);

const DATETIME_FORMAT = "YYYY-MM-DD hh:mm:ss a";

const parseDatetime = (val: unknown): Dayjs | null => {
  if (!val || (val as string).trim() === "") return null;
  const parsed = dayjs(val as string, DATETIME_FORMAT);
  return parsed.isValid() ? parsed : null;
};

export const TimePickerElement: React.FC<ElementRendererProps> = ({
  props,
  node,
  isPreview,
}) => {
  const { label, required, placeholder, defaultValue, style, className } =
    props;
  const [value, setValue] = React.useState<Dayjs | null>(
    parseDatetime(defaultValue)
  );
  const [panelDate, setPanelDate] = React.useState<Dayjs>(dayjs());
  const store = useDesignerStore();

  React.useEffect(() => {
    setValue(parseDatetime(defaultValue));
  }, [defaultValue]);

  const handleChange = (
    datetime: Dayjs | null,
    datetimeString: string | string[]
  ) => {
    setValue(datetime);
    if (isPreview && node?.props?.indexedTerm) {
      store.setFormValue(node.props.indexedTerm, datetimeString);
    }
  };

  return (
    <div style={style} className={mergeCn(className)}>
      {label && (
        <label className={baseLabelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DatePicker
        showTime={{ use12Hours: true, format: "hh:mm:ss a" }}
        placeholder={placeholder || "Select date & time"}
        style={{ width: "100%" }}
        format={DATETIME_FORMAT}
        value={value}
        onChange={handleChange}
        onPanelChange={(date) => setPanelDate(date)}
        disabledDate={(date) =>
          date.month() !== panelDate.month() || date.year() !== panelDate.year()
        }
        inputReadOnly
      />
    </div>
  );
};
