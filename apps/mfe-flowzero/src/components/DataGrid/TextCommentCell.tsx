import { Button } from "@mui/material";
import { Popover } from "antd";

import { classes } from "./style";

export const TextCommentCell = (props: any) => {
  if (props.value) {
    return (
      <Popover title="MO Comment" content={props.value} trigger="click">
        <Button className={classes.viewComment} variant="contained">
          View Comment
        </Button>
      </Popover>
    );
  }
  return "No Comment";
};
