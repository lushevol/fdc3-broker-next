import type { ICellRendererParams } from "ag-grid-community";

import {
  DATA_TYPE_COLOR,
  FIELD_DATATYPE_MAP,
  FieldDataType,
} from "../fieldType";

const DataTypeCellRenderer: React.FC<
  ICellRendererParams<unknown, FieldDataType>
> = (params) => {
  if (!params.value) return null;
  const fieldDataTypeName = FIELD_DATATYPE_MAP[params.value];
  const map = DATA_TYPE_COLOR[params.value];

  if (!map) {
    return <>--</>;
  }

  return (
    <span
      className="dataType-cell flex items-center h-[24px] leading-[22px] px-[12px] rounded-[12px] text-[12px]"
      style={{
        backgroundColor: map.bg,
        color: map.color,
        border: "none",
        display: "inline-flex",
      }}
    >
      <span
        className={"flowzero-iconfont " + map.icon}
        style={{
          width: "16px",
          height: "24px",
          fontSize: "12px",
          lineHeight: "24px",
          marginRight: "2px",
          display: "inline-block",
        }}
      ></span>
      <span style={{ height: "24px", lineHeight: "24px" }}>
        {fieldDataTypeName}
      </span>
    </span>
  );
};

export default DataTypeCellRenderer;
