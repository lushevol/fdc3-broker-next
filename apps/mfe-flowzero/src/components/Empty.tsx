import React from "react";
import EmptyRequest from "src/images/EmptyRequest.png";

interface EmptyProps {
  image?: string;
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Empty: React.FC<EmptyProps> = ({
  image = EmptyRequest,
  title,
  description,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl ${className}`}
      style={{
        height: "328px",
        position: "relative",
        borderRadius: "16px",
        ...style,
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          borderRadius: "16px",
        }}
        width="100%"
        height="100%"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="16"
          ry="16"
          fill="none"
          stroke="#595959"
          strokeWidth="2"
          strokeDasharray="8,8"
        />
      </svg>
      <img
        src={image}
        alt="Empty State"
        className="mb-[8px] w-[280px] h-[152px] object-contain"
      />
      {title && (
        <div
          className="h-[36px] leading-[36px] mb-[4px] text-[22px] font-medium text-light-content-title dark:text-dark-content-title"
          style={{ fontFamily: "'Poppins', 'Helvetica', sans-serif" }}
        >
          {title}
        </div>
      )}
      {description && (
        <div
          className="text-base text-light-content-body dark:text-dark-content-body font-medium"
          style={{ fontFamily: "'Poppins', 'Helvetica', sans-serif" }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default Empty;
