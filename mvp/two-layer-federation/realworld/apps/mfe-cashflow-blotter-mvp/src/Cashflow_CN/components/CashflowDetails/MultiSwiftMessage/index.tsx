import FileCopyIcon from "@mui/icons-material/FileCopy";
import ListIcon from "@mui/icons-material/List";
import { IconButton, Stack, Tooltip } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { message } from "antd";
import React, { FC, useEffect, useState } from "react";

import { formattedXml } from "./../common/utils";
import ExportFile from "./components/ExportFile";
import MessageModal from "./components/MessageModal";
import StyledRoot, { classes, MenuStyled } from "./style";

const MultiSwiftMessage: FC<MultiSwiftMessageProps> = ({
  swiftMessages,
  cashflowId,
}) => {
  const [num, setNum] = useState(0);
  const [totalNum, setTotalNum] = useState(0);
  const [anchorElType, setAnchorElType] = React.useState<null | HTMLElement>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<swiftmessageList>({
    mxType: "",
    mxMessage: "",
    sequence: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const totalMessages = swiftMessages.length;
    if (totalMessages) {
      setNum(1);
      setTotalNum(totalMessages);
      setSelectedItem(swiftMessages[0]);
    }
  }, [swiftMessages]);

  const handleOpenMessageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElType(event.currentTarget);
  };

  const handleCloseMessageMenu = () => {
    setAnchorElType(null);
  };

  const handleMemuItemClick = (item) => {
    setNum(item.sequence);
    setSelectedItem(item);
    handleCloseMessageMenu();
  };

  const handleCopy = async () => {
    const copyText = selectedItem.mxMessage
      ? formattedXml(selectedItem.mxMessage)
      : "";
    try {
      await navigator.clipboard.writeText(copyText);
      messageApi.success("Copy success!");
    } catch (err: any) {
      messageApi.info(`Failed to copy: ${err?.message},please try again!`);
    }
  };

  return (
    <StyledRoot>
      {totalNum ? (
        <>
          {contextHolder}
          <Stack
            className={classes.messagePanel}
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <IconButton
              color={"primary"}
              onClick={handleOpenMessageMenu}
              data-testid={`menu-icon_btn`}
            >
              <ListIcon style={{ fontSize: "25px" }} />
            </IconButton>
            <MenuStyled
              sx={{ mt: "35px" }}
              id="menu-swift-message"
              anchorEl={anchorElType}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElType)}
              onClose={handleCloseMessageMenu}
            >
              {swiftMessages.map((item) => {
                return (
                  <MenuItem
                    key={item.mxType}
                    className={classes.menuItem}
                    data-testid={`swift-menu-${item.mxType}`}
                    onClick={() => handleMemuItemClick(item)}
                  >
                    {item.mxType ? item.mxType : "NA"}
                  </MenuItem>
                );
              })}
            </MenuStyled>
            <span data-testid="message-total-hits">
              {num}/{totalNum}
            </span>
            <span>{selectedItem.mxType ? selectedItem.mxType : "NA"}</span>
            <Tooltip title="Copy the single swift message ">
              <IconButton
                color={"primary"}
                onClick={handleCopy}
                data-testid={`copy-message`}
              >
                <FileCopyIcon style={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
            <ExportFile swiftMessages={swiftMessages} cashflowId={cashflowId} />
          </Stack>
          <MessageModal message={selectedItem.mxMessage} />
        </>
      ) : (
        <div className={classes.noSwiftMessage}>No Swift Message</div>
      )}
    </StyledRoot>
  );
};
export default MultiSwiftMessage;
