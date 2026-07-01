import type { CellClassParams } from "ag-grid-community";
import { Tooltip } from "antd";

const CountryCellRenderer: React.FC<CellClassParams> = (params) => {
  const flagMap: Record<string, string> = {
    China: require("src/images/flag/China.svg"),
    "United Kingdom": require("src/images/flag/UK.svg"),
    Singapore: require("src/images/flag/Singapore.svg"),
    "United States": require("src/images/flag/United States.svg"),
    Thailand: require("src/images/flag/Thailand.svg"),
  };
  const value = params.value;
  if (!value) return null;

  // Split by comma if it's a string, or use as array if already an array
  const countries =
    typeof value === "string"
      ? value
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : Array.isArray(value)
      ? value
      : [value];

  const maxVisible = 3;
  const visibleCountries = countries.slice(0, maxVisible);
  const remainingCount = countries.length - maxVisible;

  return (
    <div className="flex items-center">
      {visibleCountries.map((country, index) => {
        const flagSrc = flagMap[country] || null;
        return (
          <Tooltip
            key={index}
            title={country}
            classNames={{
              root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
            }}
          >
            <div
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
              style={{ marginLeft: index > 0 ? "-8px" : "0" }}
            >
              {flagSrc ? (
                <img
                  src={flagSrc}
                  alt={country}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {country.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
          </Tooltip>
        );
      })}
      {remainingCount > 0 && (
        <Tooltip
          title={countries.slice(maxVisible).join(", ")}
          classNames={{
            root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
          }}
        >
          <div
            className="w-8 h-8 rounded-full bg-[#CCE3FA] dark:bg-[#035CBB] flex items-center justify-center text-xs font-medium text-[#035CBB] dark:text-white"
            style={{ marginLeft: "-8px" }}
          >
            +{remainingCount}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default CountryCellRenderer;
