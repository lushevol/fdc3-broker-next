import type { CellClassParams } from "ag-grid-community";
import cn from "classnames";

const VersionCellRenderer: React.FC<CellClassParams> = (params) => {
  if (params.value == null) return null;
  const isZero = params.value === 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "h-6 px-2 rounded-xl",
        "text-[12px] font-[500]",
        isZero ? "bg-[#D9D9D9] text-[#808080]" : "bg-[#CCE3FA] text-[#035CBB]"
      )}
    >
      <span
        className={cn(
          "w-[4px] h-[4px] rounded-full",
          isZero ? "bg-[#808080]" : "bg-[#035CBB]"
        )}
      />
      V{params.value}
    </span>
  );
};

export default VersionCellRenderer;
