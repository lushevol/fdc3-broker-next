import React, { FC } from "react";
import { Popover } from "antd";
import InfoIcon from "@mui/icons-material/Info";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import CommentGrid from "./CommentGrid";

export const CommentCell: FC = (props: any) => {
  let value = props.value;
  if (
    value instanceof Array &&
    value.length > 0 &&
    value[0].hasOwnProperty("FMO_Comment")
  ) {
    value = <CommentGrid data={value} />;
  }
  return value ? (
    <MfeThemeProvider>
      <Popover content={value} title="FMO Comments">
        <InfoIcon fontSize="small" />
      </Popover>
    </MfeThemeProvider>
  ) : null;
};
