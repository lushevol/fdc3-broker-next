import React, { FC } from "react";

export const CustomCell: FC = (props: any) => {
  //once props.value equal "ALL" then do not display anything
  if (props?.value === "ALL") {
    return <></>;
  }
  return <>{props.value}</>;
};
