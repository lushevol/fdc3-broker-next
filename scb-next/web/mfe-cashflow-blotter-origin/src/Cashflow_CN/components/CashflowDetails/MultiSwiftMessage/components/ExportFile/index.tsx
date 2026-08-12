import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { FC } from "react";

import { formattedXml } from "../../../common/utils";

const ExportFile: FC<MultiSwiftMessageProps> = ({
  swiftMessages,
  cashflowId,
}) => {
  const onExportAllMessages = () => {
    const mergeContent = swiftMessages
      .map((item) => formattedXml(item.mxMessage))
      .join("\n\n");
    const blob = new Blob([mergeContent], { type: "text/plain" });
    saveAs(blob, `${cashflowId}.txt`);
  };
  return (
    <Button
      variant="contained"
      color="primary"
      data-testid="ExportMessageBtn"
      onClick={() => onExportAllMessages()}
      size="small"
      style={{ fontSize: "10px" }}
    >
      Export All
    </Button>
  );
};
export default ExportFile;
