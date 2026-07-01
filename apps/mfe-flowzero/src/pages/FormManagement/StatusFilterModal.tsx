import styled from "@emotion/styled";
import { Checkbox } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import type { FormStatusEnum } from "src/api";

const STATUS_LIST: Array<{ label: string; value: FormStatusEnum }> = [
  { label: "PUBLISHED", value: "PUBLISHED" },
  { label: "DRAFT", value: "DRAFT" },
];

interface StatusFilterModalProps {
  visible: boolean;
  onCancel: () => void;
  selected: FormStatusEnum[];
  onChange: (values: FormStatusEnum[]) => void;
  anchorRect: DOMRect | null;
}

export const StatusFilterModal: React.FC<StatusFilterModalProps> = ({
  visible,
  onCancel,
  selected,
  onChange,
  anchorRect,
}) => {
  if (!visible || !anchorRect) return null;

  const ModalContainer = styled("div")<{ anchorRect: DOMRect }>`
    position: fixed;
    top: ${({ anchorRect }) => anchorRect.bottom + 12 + window.scrollY}px;
    left: ${({ anchorRect }) => anchorRect.left + window.scrollX}px;
    z-index: 1300;
    width: 260px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    background: #fff;
    padding: 8px;
  `;
  const ItemDiv = styled("div")<{ selected: boolean }>`
    font-weight: ${({ selected }) => (selected ? 600 : 400)};
    background: ${({ selected }) => (selected ? "#EAF5FF" : "unset")};
    color: ${({ selected }) => (selected ? "#0473EA" : "unset")};
    border-radius: 6px;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    margin: 3px 0;
    .dark & {
      background: ${({ selected }) =>
        selected ? "#00172e" : "transparent"} !important;
      .ant-checkbox-label {
        color: ${({ selected }) =>
          selected ? "#9AC7F6" : "#CCCCCC"} !important;
      }
      .ant-checkbox {
        .ant-checkbox-inner {
          background-color: transparent !important;
          border-color: #737373 !important;
        }
      }
      .ant-checkbox-checked {
        .ant-checkbox-inner {
          background-color: #0473ea !important;
          border-color: transparent !important;
        }
      }
    }
  `;
  const Overlay = styled("div")`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1299;
  `;

  return ReactDOM.createPortal(
    <>
      <ModalContainer anchorRect={anchorRect} className="dark:bg-[#262626]">
        {STATUS_LIST.map((item) => {
          const isSelected = selected.includes(item.value);
          return (
            <ItemDiv
              key={item.value}
              selected={isSelected}
              className="dark:bg-[#00172e]"
            >
              <Checkbox
                checked={isSelected}
                onChange={() => {
                  if (isSelected) {
                    onChange(selected.filter((v) => v !== item.value));
                  } else {
                    onChange([...selected, item.value]);
                  }
                }}
              >
                {item.label}
              </Checkbox>
              {isSelected && (
                <span
                  className="flowzero-iconfont icon-check-tick text-[#0250A3] dark:text-[#E5F1FC]"
                  style={{ width: 16, height: 16 }}
                />
              )}
            </ItemDiv>
          );
        })}
      </ModalContainer>
      <Overlay onClick={onCancel} />
    </>,
    document.body
  );
};
