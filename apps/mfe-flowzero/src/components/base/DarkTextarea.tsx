import { Input } from "antd";
import type { TextAreaProps } from "antd/es/input";
import cn from "classnames";
import React from "react";
const { TextArea } = Input;

const DarkTextarea: React.FC<TextAreaProps> = (props) => {
  return (
    <TextArea
      {...props}
      className={cn(
        "border-light-divide-base dark:border-dark-divide-base",
        "bg-light-container-layer dark:bg-dark-container-layer",
        "text-light-input-text dark:text-dark-input-text",
        "placeholder:text-light-placeholder-text dark:placeholder:text-dark-placeholder-text",
        "[&.ant-input-status-error]:bg-light-container-layer dark:[&.ant-input-status-error]:bg-dark-container-layer",
        "hover:bg-light-container-layer dark:hover:bg-dark-container-layer",
        "focus:bg-light-container-layer dark:focus:bg-dark-container-layer",
        "[&.ant-input-status-error:hover]:bg-light-container-layer dark:[&.ant-input-status-error:hover]:bg-dark-container-layer",
        "[&.ant-input-status-error:focus]:bg-light-container-layer dark:[&.ant-input-status-error:focus]:bg-dark-container-layer",
        "[&.ant-input-disabled]:cursor-not-allowed",
        "[&.ant-input-disabled]:text-light-input-text dark:[&.ant-input-disabled]:text-dark-input-text",
        "[&.ant-input-disabled]:bg-light-solid-disabled dark:[&.ant-input-disabled]:bg-dark-solid-disabled",
        "[&.ant-input-disabled]:border-light-secondary-disabled dark:[&.ant-input-disabled]:border-dark-secondary-disabled",
        props.className
      )}
    />
  );
};

export default DarkTextarea;
