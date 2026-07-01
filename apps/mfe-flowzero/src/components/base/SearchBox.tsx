import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, type InputRef } from "antd";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface SearchBoxProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search",
  onChange,
  className = "",
  defaultValue = "",
}) => {
  const [expanded, setExpanded] = useState(() => !!defaultValue);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapseIfEmpty = () => {
    if (!value.trim()) {
      setExpanded(false);
      setValue("");
      onChange?.("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          "overflow-hidden",
          expanded ? "w-[316px]" : "w-[110px]"
        )}
      >
        {expanded ? (
          <Input
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            allowClear
            onChange={handleChange}
            onBlur={handleCollapseIfEmpty}
            prefix={
              <SearchOutlined className="text-[#035CBB] dark:text-link-primary-selected group-hover:text-[#0367d2]" />
            }
            className={cn(
              "group",
              "h-8",
              "w-full",
              "rounded-full",
              "bg-[#E5F1FC] dark:bg-dark-zero-selected",
              "border border-light-divide-base dark:border-dark-link-primary-pressed",
              "hover:bg-light-zero-selected hover:border-light-link-primary-pressed",
              "hover:bg-dark-zero-selected hover:border-dark-link-primary-pressed",
              "transition-all duration-200",
              "[&_input]:text-light-content-title dark:[&_input]:text-dark-content-title",
              "[&_input::placeholder]:text-light-content-body dark:[&_input::placeholder]:text-dark-content-body",
              "[&_.ant-input-clear-icon]:text-gray-400",
              "[&_.ant-input-clear-icon:hover]:text-gray-600",
              "focus-within:border-light-link-primary-pressed dark:focus-within:!border-dark-link-primary-pressed",
              "focus-within:!bg-light-zero-selected dark:focus-within:!bg-dark-zero-selected",
              value &&
                "!border-light-link-primary-pressed dark:!border-dark-link-primary-pressed"
            )}
          />
        ) : (
          <Button
            onClick={handleExpand}
            className={cn(
              "h-8",
              "w-full",
              "rounded-full",
              "px-4",
              "flex items-center gap-2",
              "bg-white dark:!bg-dark-container-layer",
              "border border-light-divide-base dark:border-dark-divide-base",
              "text-light-content-title dark:text-dark-content-title",
              "transition-all duration-200",
              "border-light-divide-base text-light-text-secondary-default dark:border-dark-secondary-default dark:text-dark-link-primary-default dark:bg-dark-container-layer",
              "hover:bg-light-container-layer hover:border-light-border-secondary-hover hover:!text-light-text-secondary-hover",
              "dark:hover:bg-dark-container-layer dark:hover:border-dark-border-secondary-hover dark:hover:text-dark-border-secondary-hover"
            )}
          >
            <SearchOutlined />
            <span className={cn("text-[14px]", "font-[500]")}>Search</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
