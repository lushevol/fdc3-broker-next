import { MessageInstance } from "antd/es/message/interface";
import { HookAPI } from "antd/es/modal/useModal";
import { Dispatch } from "redux";

import { TileProps } from "../../../Root/routing/common/interface";

export interface MainProps extends TileProps {}

export interface WorkflowActionExtraOptions {
  dispatch?: Dispatch<any>;
  modalApi?: HookAPI;
  messageApi: MessageInstance;
}
