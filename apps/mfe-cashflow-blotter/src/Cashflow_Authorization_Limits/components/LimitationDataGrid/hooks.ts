import {
  LimitationActionType,
  LimitationRecord,
} from "src/Cashflow_Authorization_Limits/Main/common/interface";

export const useActionHandler = ({
  onOpenDetailsDialog,
  onDeleteLimitation,
  onApproveAddLimitation,
  onRejectAddLimitation,
  onApproveEditLimitation,
  onRejectEditLimitation,
  onApproveDeleteLimitation,
  onRejectDeleteLimitation,
  modalApi,
  messageApi,
}) => {
  const handleAction = async (
    type: LimitationActionType,
    data: LimitationRecord
  ) => {
    switch (type) {
      case LimitationActionType.DELETE:
        modalApi.confirm({
          title: "Delete",
          content: "Are you sure to delete this limitation record?",
          okText: "Delete",
          okType: "danger",
          async onOk() {
            await onDeleteLimitation(data);
            messageApi.success("Submit Deleting Limitation");
          },
        });
        break;
      case LimitationActionType.EDIT:
        onOpenDetailsDialog(true, data, type);
        break;
      case LimitationActionType.APPROVE_ADD:
        await onApproveAddLimitation(data);
        messageApi.success("Approved Adding New Limitation");
        break;

      case LimitationActionType.REJECT_ADD:
        await onRejectAddLimitation(data);
        messageApi.success("Rejected Adding New Limitation");
        break;

      case LimitationActionType.APPROVE_EDIT:
        await onApproveEditLimitation(data);
        messageApi.success("Approved Editing Limitation");
        break;

      case LimitationActionType.REJECT_EDIT:
        await onRejectEditLimitation(data);
        messageApi.success("Rejected Editing Limitation");
        break;

      case LimitationActionType.APPROVE_DELETE:
        await onApproveDeleteLimitation(data);
        messageApi.success("Approved Deleting Limitation");
        break;

      case LimitationActionType.REJECT_DELETE:
        await onRejectDeleteLimitation(data);
        messageApi.success("Rejected Deleting Limitation");
        break;

      default:
        break;
    }
  };

  return {
    handleAction,
  };
};
