import type { ICellRendererParams } from "ag-grid-community";

import { FIELD_TYPE_MAPPING, FieldTypes } from "../fieldType";

const FieldTypeCellRenderer: React.FC<
  ICellRendererParams<unknown, FieldTypes>
> = (params) => {
  if (!params.value) return null;
  return (
    <span
      className="dataType-cell flex items-center h-[24px] leading-[22px] px-[12px] rounded-[12px] text-[12px]"
      style={{
        backgroundColor: "#D1F6FA",
        color: "#107F89",
        border: "none",
        display: "inline-flex",
      }}
    >
      <span
        className={
          "flowzero-iconfont " + (FIELD_TYPE_MAPPING[params?.value]?.icon || "")
        }
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
        {FIELD_TYPE_MAPPING[params?.value]?.label || ""}
      </span>
    </span>
  );
};

export default FieldTypeCellRenderer;
