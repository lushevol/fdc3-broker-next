import { Modal } from "antd";
import { useCallback } from "react";

export const useFilterOperationController = () => {
  const [modalApi, ModalContext] = Modal.useModal();

  const confirmProcessing = useCallback(
    async (action: string, callback: () => Promise<void>) => {
      const confirmed = await modalApi.confirm({
        title: action,
        centered: true,
        content: `Are you sure to ${action.toLowerCase()} this filter ?`,
      });
      if (confirmed) await callback();
    },
    [modalApi]
  );

  return {
    ModalContext,
    confirmProcessing,
  };
};
