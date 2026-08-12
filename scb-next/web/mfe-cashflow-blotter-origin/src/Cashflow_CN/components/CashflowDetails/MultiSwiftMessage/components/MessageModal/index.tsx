import { FC } from "react";
import { atomOneDark, CodeBlock } from "react-code-blocks";

import { formattedXml } from "../../../common/utils";
import StyledRoot, { classes } from "./style";

declare interface MessageModalProps {
  message: string | null;
}

export const codeBlockComponent = (data: string) => {
  return (
    <CodeBlock
      text={data}
      language={"text"}
      showLineNumbers={true}
      customStyle={{
        ...atomOneDark,
        backgroundColor: "var(--theme-color-collapse-bg)",
        color: "var(--theme-color-font-color)",
        frontFamily: '"Poppins", Helvetica',
      }}
    />
  );
};

const MessageModal: FC<MessageModalProps> = ({ message }) => {
  let getSwiftMessageBody;
  if (!message) {
    getSwiftMessageBody = "No Swift Message";
  } else {
    getSwiftMessageBody = codeBlockComponent(formattedXml(message));
  }

  return (
    <StyledRoot className={classes.root}>
      <div>
        {message ? (
          <pre className={classes.pre}>{getSwiftMessageBody}</pre>
        ) : (
          <div className={classes.noSwiftMessage}>{getSwiftMessageBody}</div>
        )}
      </div>
    </StyledRoot>
  );
};

export default MessageModal;
