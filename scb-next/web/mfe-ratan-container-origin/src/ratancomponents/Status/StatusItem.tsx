import React, { ReactElement } from "react";
import { StatusItemProps } from "./common/interface";
import AdjustIcon from "@mui/icons-material/Adjust";
const StatusItem: React.FC<StatusItemProps> = (
  props: StatusItemProps
): ReactElement => {
  return (
    <section>
      <div className={props.status?.toLocaleLowerCase()}>
        <AdjustIcon style={{ fontSize: "14px" }} />
      </div>
      <div>{props.name.split("_").join(" ")}</div>
    </section>
  );
};

export default React.memo(StatusItem);
