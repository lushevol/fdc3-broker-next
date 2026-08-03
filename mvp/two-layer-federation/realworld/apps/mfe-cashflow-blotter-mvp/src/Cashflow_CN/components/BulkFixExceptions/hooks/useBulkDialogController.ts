import { message, Modal } from "antd";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeBulkFixExceptionDialog } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

import { BulkUserType } from "../type";

export const useBulkDialogController = () => {
  const dispatch = useDispatch<any>();
  const [modalApi, ModalContextHolder] = Modal.useModal();
  const [messageApi, MessageContextHolder] = message.useMessage();
  const { isOpenDialog, userType } = useSelector(
    (state: RootState) => state.bulkFixExceptions
  );

  const closeDialog = useCallback(() => {
    return dispatch(closeBulkFixExceptionDialog());
  }, []);

  const dialogTitle = useMemo(() => {
    return `Bulk ${
      userType === BulkUserType.Maker ? "Fix" : "Verify"
    } Exceptions`;
  }, [userType]);

  return {
    isOpenDialog,
    closeDialog,
    dialogTitle,
    messageApi,
    MessageContextHolder,
    modalApi,
    ModalContextHolder,
    userType,
  };
};
