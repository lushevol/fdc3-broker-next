import React, { FC } from "react";
import { Popover } from "antd";

interface CellProps {
  data: any;
}

const CommentsCell: FC<CellProps> = ({ data }) => {
  const content = (
    <>
      {data.FMO_Comments instanceof Array ? (
        <div className="multiple-grid">
          {data.FMO_Comments.map((m) => (
            <div>{m.FMO_Comment}</div>
          ))}
        </div>
      ) : null}
    </>
  );

  return data.FMO_Comments instanceof Array ? (
    <Popover
      content={content}
      title="Comments"
      overlayClassName="value-change-grid"
      placement="left"
    >
      <span>{data.FMO_Comments?.map((com) => com.FMO_Comment).join("\n")}</span>
    </Popover>
  ) : (
    <div>N/A</div>
  );
};

export default CommentsCell;
