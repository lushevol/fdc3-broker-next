import cn from "classnames";
import React from "react";
import type { StatisticsInterval } from "src/types/statistics";

interface GranularityToggleProps {
  value: StatisticsInterval;
  onChange: (v: StatisticsInterval) => void;
}

const OPTIONS: { label: string; value: StatisticsInterval }[] = [
  { label: "Daily", value: "Day" },
  { label: "Weekly", value: "Week" },
  { label: "Monthly", value: "Month" },
];

const GranularityToggle: React.FC<GranularityToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <div
      className="flex items-center rounded-full bg-white dark:bg-[#1f1f1f] p-[4px] translate-y-5"
      style={{ border: "1px solid #CCCCCC" }}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 rounded-full text-sm font-medium border-none cursor-pointer transition-colors dark:text-gray-100",
            opt.value === value
              ? "bg-[#E5F1FC] text-[#0250A3]"
              : "bg-white text-[#00172E] hover:bg-transparent hover:text-[#0367D2]"
          )}
          style={{ height: 24, lineHeight: "19px" }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default GranularityToggle;
