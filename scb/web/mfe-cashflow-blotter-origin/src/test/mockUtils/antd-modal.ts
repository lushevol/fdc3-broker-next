import { HookAPI } from "antd/es/modal/useModal";

import { fn } from "../test-utils";

export const mockAntdModal: () => HookAPI = () => {
  return {
    info: fn(),
    success: fn(),
    error: fn(),
    warn: fn(),
    warning: fn(),
    confirm: fn(),
  };
};
