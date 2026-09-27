import React, { ReactElement } from "react";
import { IconButton } from "ratan-design-origin/primitives";
import ErrorBoundry from "../../../components/ErrorBoundry";
import { ContentPaste as ContentPasteIcon } from "ratan-design-origin/icons";

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
