import { FC } from "react";

import "./style.less";

interface SwiftMessageDialogProp {
  details: any;
}

export const SwiftMessageDialog: FC<SwiftMessageDialogProp> = ({ details }) => {
  const formatSwiftMessage = () => {
    if (details) {
      const displayMessage = details.replace(/\r\n/g, "<br>");

      return (
        <div
          className="swift-message-dialog"
          dangerouslySetInnerHTML={{ __html: displayMessage as string }}
        />
      );
    }

    return (
      <div
        className="no-swift-message"
        dangerouslySetInnerHTML={{ __html: "No Swift Message" }}
      />
    );
  };

  return formatSwiftMessage();
};
