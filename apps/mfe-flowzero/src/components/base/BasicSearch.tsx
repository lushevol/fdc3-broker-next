import { SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Input, type InputRef } from "antd";
import cn from "classnames";
import React, { useRef, useState } from "react";

interface BasicSearchProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const INputWrapper = styled("div")`
  overflow: hidden;
  width: 400px;
  .ant-input-affix-wrapper {
    height: 38px;
    padding: 8px 24px;
    border: none;
    svg {
      height: 20px;
      width: 20px;
    }
  }
  .ant-input-affix-wrapper: hover {
    background: #f2f2f2;
    border: 1px solid #4f9df0;
    .dark & {
      background: #333333;
    }
  }
  .ant-input-affix-wrapper: focus-within {
    background: #e5f1fc;
    border: 1px solid #0250a3;
    .dark & {
      background: #00172e;
    }
  }
`;

const BasicSearch: React.FC<BasicSearchProps> = ({
  placeholder = "Search",
  onChange,
  className = "",
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <INputWrapper>
        <Input
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          allowClear
          onChange={handleChange}
          suffix={
            <SearchOutlined className="text-[#035CBB] dark:text-[#368FEE]" />
          }
          className={cn(
            "group",
            "h-8",
            "w-full",
            "rounded-full",
            "bg-[#FFFFFF] dark:bg-[#262626]",
            "[&_input]:text-light-content-title dark:[&_input]:text-dark-content-title",
            "[&_input::placeholder]:text-light-content-body dark:[&_input::placeholder]:text-dark-content-body",
            "[&_.ant-input-clear-icon]:text-gray-400",
            "[&_.ant-input-clear-icon:hover]:text-gray-600"
          )}
        />
      </INputWrapper>
    </div>
  );
};

export default BasicSearch;
