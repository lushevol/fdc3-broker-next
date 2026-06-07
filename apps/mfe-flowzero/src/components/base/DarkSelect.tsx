import { Select, SelectProps } from "antd";
import cn from "classnames";
import React, { useEffect, useState } from "react";
interface DarkSelectProps extends SelectProps {
  popupContainer?: HTMLElement;
  scrollContainer?: HTMLElement | null;
  autoCloseOutOfView?: boolean;
}

function getDropdownTopClass(height: string | number | undefined) {
  const defaultTop = 32;
  if (height === undefined)
    return `[&_.ant-select-dropdown]:!top-[${defaultTop}px]`;
  if (typeof height === "number")
    return `[&_.ant-select-dropdown]:!top-[${height}px]`;
  const parsed = parseInt(height as string, 10);
  return `[&_.ant-select-dropdown]:!top-[${
    isNaN(parsed) ? defaultTop : parsed
  }px]`;
}

const DarkSelect: React.FC<DarkSelectProps> = ({
  popupContainer,
  scrollContainer,
  autoCloseOutOfView,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !autoCloseOutOfView) return;
    const checkVisible = () => {
      if (!triggerRef.current || !scrollContainer) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const inView =
        rect.bottom > containerRect.top &&
        rect.top < containerRect.bottom &&
        rect.right > containerRect.left &&
        rect.left < containerRect.right;
      if (!inView) setOpen(false);
    };

    scrollContainer?.addEventListener("scroll", checkVisible, true);
    window.addEventListener("resize", checkVisible);

    return () => {
      scrollContainer?.removeEventListener("scroll", checkVisible, true);
      window.removeEventListener("resize", checkVisible);
    };
  }, [open, autoCloseOutOfView, scrollContainer]);
  return (
    <div ref={triggerRef}>
      <Select
        {...props}
        open={open}
        onOpenChange={(nextOpen) => setOpen(nextOpen)}
        getPopupContainer={(trigger) => popupContainer || trigger.parentElement}
        className={cn(
          "[&_.ant-select-selector]:bg-light-container-layer",
          "dark:[&_.ant-select-selector]:bg-dark-container-layer",
          "[&_.ant-select-selector]:border-light-secondary-default",
          "dark:[&_.ant-select-selector]:border-dark-secondary-default",
          "[&_.ant-select-arrow]:text-light-divide-base",
          "dark:[&_.ant-select-arrow]:text-dark-divide-base",
          "dark:[&_.ant-select-selection-placeholder]:text-light-placeholder-text",
          "dark:[&_.ant-select-selection-placeholder]:text-dark-placeholder-text",
          "dark:[&_.ant-select-selection-item]:text-dark-input-text",
          "[&_.ant-select-selection-item]:text-light-input-text",
          "dark:[&_.ant-select-selection-item]:text-light-placeholder-text",
          getDropdownTopClass(props.style?.height),
          "[&_.ant-select-dropdown]:!z-99999",
          "[&_.ant-select-dropdown]:bg-light-container-layer",
          "dark:[&_.ant-select-dropdown]:bg-dark-container-layer",
          "[&_.ant-select-dropdown_.ant-space-item]:text-light-link-secondary-default",
          "dark:[&_.ant-select-dropdown_.ant-space-item]:text-dark-link-secondary-default",
          "dark:[&_.ant-select-dropdown_.ant-select-item-option-selected]:!bg-dark-zero-selected",
          "dark:[&_.ant-select-dropdown_.ant-select-item]:!text-dark-link-secondary-default",
          props.className
        )}
      />
    </div>
  );
};

export default DarkSelect;
