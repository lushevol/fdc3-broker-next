import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import CommentGrid from "../../ratancomponents/DataGrid/CommentGrid";
import { isEmpty } from "../../ratanutils/utils";
import { MuiPortalDialog } from "../../ratancomponents/Dialog/indexMuiV2";

interface CellProps {
  data: any;
}

const CommentsChangeCell: FC<CellProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const content = (
    <>
      {!isEmpty(data.Comments_Change) ? (
        <div className="multiple-grid">
          <CommentGrid data={data.Comments_Change.Old_Value} />
          <CommentGrid data={data.Comments_Change.New_Value} />
        </div>
      ) : null}
    </>
  );

  return !isEmpty(data.Comments_Change) ? (
    <>
      {open && (
        <MuiPortalDialog
          open={open}
          title="Comments Change"
          width="740px"
          height="370px"
          enableResize={true}
          enableMaximize
          onClose={() => setOpen(false)}
          inside={true}
        >
          {content}
        </MuiPortalDialog>
      )}
      <Button
        data-testid={"comments-change-cell-btn"}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Show Detail
      </Button>
    </>
  ) : (
    <div>N/A</div>
  );
};

export default CommentsChangeCell;
