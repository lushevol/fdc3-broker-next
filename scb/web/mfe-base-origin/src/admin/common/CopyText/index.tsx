import React, { ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import ErrorBoundry from "../../../components/ErrorBoundry";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

interface CopyTextProps {
  value: string;
  onClickCopy: (value: string) => () => void;
  dataTestid?: string;
}

const CopyText = (props: CopyTextProps): ReactElement => {
  const { value, onClickCopy, dataTestid } = props;
  return (
    <ErrorBoundry>
      <>
        {value}
        <IconButton
          aria-label="copy"
          size="small"
          sx={{ ml: "5px" }}
          onClick={onClickCopy(value)}
          data-testid={dataTestid}
        >
          <ContentPasteIcon fontSize="inherit" />
        </IconButton>
      </>
    </ErrorBoundry>
  );
};

export default React.memo(CopyText);
