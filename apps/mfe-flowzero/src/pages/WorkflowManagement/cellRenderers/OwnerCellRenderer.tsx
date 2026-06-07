import type { CellClassParams } from "ag-grid-community";
import { Tooltip } from "antd";
import cn from "classnames";
import AvatarTooltip from "src/components/AvatarTooltip";

const OwnerCellRenderer: React.FC<CellClassParams> = (params) => {
  const value = params.value;
  if (!value) return null;

  // Split by comma if it's a string, or use as array if already an array
  const users =
    typeof value === "string"
      ? value
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      : Array.isArray(value)
      ? value
      : [value];

  const maxVisible = 3;
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className={cn("flex items-center")}>
      {visibleUsers.map((userId, index) => {
        const imgUrl = `https://axess.sc.net/scb-axess-cms/api/users/${userId}/photo`;
        return (
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
            )}
            style={{ marginLeft: index > 0 ? "-8px" : "0" }}
          >
            <AvatarTooltip value={userId} img={imgUrl} darkImg={imgUrl} />
          </div>
        );
      })}
      {remainingCount > 0 && (
        <Tooltip
          title={users.slice(maxVisible).join(", ")}
          classNames={{
            root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
          }}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full bg-[#CCE3FA] dark:bg-[#035CBB] flex items-center justify-center text-xs font-medium text-[#035CBB] dark:text-white"
            )}
            style={{ marginLeft: "-8px" }}
          >
            +{remainingCount}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default OwnerCellRenderer;
