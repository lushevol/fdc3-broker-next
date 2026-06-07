import { Tooltip } from "antd";
import React from "react";
import AvatarImg from "src/images/Avatar.png";
import AvatarDark from "src/images/AvatarDark.png";

interface AvatarTooltipProps {
  value: string;
  img?: string;
  darkImg?: string;
  alt?: string;
}

const AvatarTooltip: React.FC<AvatarTooltipProps> = ({
  value,
  img,
  darkImg,
  alt = "avatar",
}) => {
  if (!value) return null;
  const lightImg = img || AvatarImg;
  const darkImgSrc = darkImg || AvatarDark;
  return (
    <Tooltip
      title={value}
      placement="top"
      classNames={{
        root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
      }}
    >
      <>
        <img
          src={lightImg}
          alt={alt}
          className="w-8 h-8 rounded-full object-cover inline-block align-middle border-2 border-[#ccc]"
        />
      </>
    </Tooltip>
  );
};

export default AvatarTooltip;
