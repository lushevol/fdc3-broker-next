import React, { ReactElement } from "react";
import LoadingButton from "../LoadingButton";
import { AdminRecord } from "../../admin/common/interface";

interface ModalActionProps {
  isLoading?: boolean;
  record: AdminRecord;
  onSave: () => void;
  onUpdate: () => void;
  onVerify: () => void;
  onDeactivate: () => void;
}

const ModalAction = (props: ModalActionProps): ReactElement => {
  const { isLoading, record, onSave, onUpdate, onVerify, onDeactivate } = props;

  switch (record.mode) {
    case "new":
      return (
        <LoadingButton onClick={onSave} color="secondary" loading={isLoading}>
          Create
        </LoadingButton>
      );
    case "edit":
      return (
        <LoadingButton onClick={onUpdate} color="primary" loading={isLoading}>
          Update
        </LoadingButton>
      );
    case "verify":
      return (
        <LoadingButton onClick={onVerify} color="success" loading={isLoading}>
          Verified
        </LoadingButton>
      );
    case "deactivate":
      return (
        <LoadingButton
          onClick={onDeactivate}
          color="warning"
          loading={isLoading}
        >
          Deactivate
        </LoadingButton>
      );
    default:
      return <></>;
  }
};

export default React.memo(ModalAction);
