import styled from "@emotion/styled";
import React from "react";

interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
}

const ControlsWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  background: none;
  border: none;
  box-shadow: none;
  gap: 12px;
  position: absolute;
  left: 17px;
  bottom: 28px;
  z-index: 10;

  .workflow__controls-button {
    border-radius: 6px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.2s;
    margin: 0;
    padding: 0;
    &:hover {
      border-color: #4f9df0;
      .workflow__controls-icon {
        color: #4f9df0;
      }
    }
  }

  .workflow__controls-icon {
    font-size: 20px;
  }
`;

const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onClear,
}) => (
  <ControlsWrapper className="react-flow__panel custom-controls">
    <button
      className="workflow__controls-button bg-[#fff] border border-[#e5e7eb] dark:bg-[#262626] dark:border-[#737373]"
      title="Zoom In"
      onClick={onZoomIn}
    >
      <span className="flowzero-iconfont icon-zoom-in-plus-magnify workflow__controls-icon text-[#444] dark:text-[#9AC7F6]"></span>
    </button>
    <button
      className="workflow__controls-button bg-[#fff] border border-[#e5e7eb] dark:bg-[#262626] dark:border-[#737373]"
      title="Zoom Out"
      onClick={onZoomOut}
    >
      <span className="flowzero-iconfont icon-zoom-out-minus-magnify workflow__controls-icon text-[#444] dark:text-[#9AC7F6]"></span>
    </button>
    {/* <button
      className="workflow__controls-button bg-[#fff] border border-[#e5e7eb] dark:bg-[#262626] dark:border-[#737373]"
      title="clean canvas"
      onClick={onClear}
    >
      <span className="flowzero-iconfont icon-arrow-reset workflow__controls-icon text-[#444] dark:text-[#9AC7F6]"></span>
    </button> */}
  </ControlsWrapper>
);

export default CanvasControls;
