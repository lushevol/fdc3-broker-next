import React from "react";
import { twMerge } from "tailwind-merge";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  titleClassName,
  className,
}) => {
  return (
    <div className={twMerge("space-y-3", className)}>
      <span
        className={twMerge(
          "block text-[12px] h-8 leading-8",
          "border-light-divide-base dark:border-dark-divide-base border-b-[1px]",
          "text-[#0367D2] font-bold",
          titleClassName
        )}
      >
        {title}
      </span>
      <div>{children}</div>
    </div>
  );
};
