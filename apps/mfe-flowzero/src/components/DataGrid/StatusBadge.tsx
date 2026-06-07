import cn from "classnames";

export type StatusBadgeConfig = {
  label: string;
  bgClass: string;
  textClass: string;
  darkBgclass?: string;
  darkTextClass?: string;
};

type StatusBadgeProps = {
  config: StatusBadgeConfig;
  className?: string;
};

export const StatusBadge = ({ config, className }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center h-6 min-h-[24px] rounded-full px-2",
      "text-xs font-normal leading-6",
      config.bgClass,
      config.textClass,
      config.darkBgclass,
      config.darkTextClass,
      className
    )}
  >
    {config.label}
  </span>
);
