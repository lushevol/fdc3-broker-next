import styled from "@emotion/styled";
import { DatePicker } from "antd";
import React from "react";

type RangePickerProps = React.ComponentPropsWithoutRef<
  typeof DatePicker.RangePicker
>;

const PickerWrapper = styled("div")`
  .dark & .ant-picker {
    background: #1f1f1f;
    border-color: #737373;
    color: #b2b2b2;
    .ant-picker-input > input {
      color: #b2b2b2;
      &::placeholder {
        color: #999999;
      }
    }
    .ant-picker-range-separator,
    .ant-picker-suffix,
    .ant-picker-separator,
    .ant-picker-clear {
      color: #737373;
    }
    &:hover {
      border-color: #9ac7f6;
    }
    &.ant-picker-focused {
      border-color: #9ac7f6;
      box-shadow: 0 0 0 2px rgba(154, 199, 246, 0.1);
    }
    .ant-picker-active-bar {
      background: #9ac7f6;
    }
  }
  .dark & .ant-picker-dropdown {
    .ant-picker-panel-container {
      background: #262626;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
    }
    .ant-picker-header {
      color: #e5e7eb;
      border-bottom-color: #737373;
      button {
        color: #b2b2b2;
        &:hover {
          color: #9ac7f6;
        }
      }
    }
    .ant-picker-content th {
      color: #737373;
    }
    .ant-picker-cell {
      color: #4d4d4d;
      &.ant-picker-cell-in-view {
        color: #b2b2b2;
      }
      &:hover:not(.ant-picker-cell-selected):not(
          .ant-picker-cell-range-start
        ):not(.ant-picker-cell-range-end)
        .ant-picker-cell-inner {
        background: #012246;
      }
      &.ant-picker-cell-selected .ant-picker-cell-inner,
      &.ant-picker-cell-range-start .ant-picker-cell-inner,
      &.ant-picker-cell-range-end .ant-picker-cell-inner {
        background: #0473ea;
      }
      &.ant-picker-cell-in-range::before {
        background: #012246;
      }
      &.ant-picker-cell-range-hover::after,
      &.ant-picker-cell-range-hover-start::after,
      &.ant-picker-cell-range-hover-end::after {
        border-color: #9ac7f6;
      }
    }
    .ant-picker-time-panel {
      border-left-color: #737373;
      .ant-picker-time-panel-column {
        border-inline-end-color: #737373;
        .ant-picker-time-panel-cell-inner {
          color: #b2b2b2;
        }
        .ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
          background: #012246;
          color: #9ac7f6;
        }
        .ant-picker-time-panel-cell:hover .ant-picker-time-panel-cell-inner {
          background: #012246;
        }
      }
    }
    .ant-picker-footer {
      border-top-color: #737373;
      background: #262626;
      .ant-picker-today-btn {
        color: #9ac7f6;
      }
      .ant-picker-ok button {
        background: #0473ea;
        border-color: #0473ea;
      }
    }
    .ant-picker-range-arrow::before {
      background: #262626;
    }
  }
`;

const DarkDatePicker: React.FC<RangePickerProps> = (props) => {
  return (
    <PickerWrapper>
      <DatePicker.RangePicker {...props} />
    </PickerWrapper>
  );
};

export default DarkDatePicker;
