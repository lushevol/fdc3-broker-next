import { HookAPI } from "antd/es/modal/useModal";

export const actionConfirmation = async (modal: HookAPI, action: string) => {
  const confirmed = await modal.confirm({
    title: "Warning",
    content: `Are you sure to ${action} this rule ?`,
    okText: "Confirm",
    cancelText: "Dismiss",
    getContainer: false,
    centered: true,
    width: 450,
  });
  return confirmed;
};
