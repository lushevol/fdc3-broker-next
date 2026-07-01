import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { Button, Popconfirm } from "antd";
import { FC, useContext, useMemo } from "react";
import { UserRoleContext } from "src/Cashflow_Authorization_Limits/Main/App";
import { LimitationActionType } from "src/Cashflow_Authorization_Limits/Main/common/interface";
import { parseIsUpdateByYou } from "src/Cashflow_Authorization_Limits/Main/utils";
import {
  AUTHORIZATION_LIMITS_BLOTTER_DELETE_BTN,
  AUTHORIZATION_LIMITS_BLOTTER_EDIT_BTN,
  AUTHORIZATION_LIMITS_BLOTTER_VERIFY_BTN,
  AUTHORIZATION_LIMITS_BLOTTER_VERIFY_DELETION_BTN,
  AUTHORIZATION_LIMITS_BLOTTER_VERIFY_MODIFICATION_BTN,
} from "src/Root/analysis/const";

import { ActionProps } from "./interface";

const GridActions: FC<ActionProps> = ({ data, onClick }) => {
  const userRole = useContext(UserRoleContext);
  const isUpdateByYou = useMemo(() => {
    return parseIsUpdateByYou(data);
  }, [data]);
  const actions = useMemo(() => {
    const { status } = data;
    const actionDisable = userRole !== "Checker" || isUpdateByYou;
    switch (status) {
      case "ADD_PENDING":
        return (
          <Popconfirm
            title="Confirm to create this record ?"
            onConfirm={() => onClick(LimitationActionType.APPROVE_ADD, data)}
            onCancel={() => onClick(LimitationActionType.REJECT_ADD, data)}
            okText="Create"
            cancelText="Delete"
            disabled={actionDisable}
          >
            <Button
              style={{ height: "20px", padding: "0 10px" }}
              disabled={actionDisable}
              data-testid={AUTHORIZATION_LIMITS_BLOTTER_VERIFY_BTN}
            >
              Verify
            </Button>
          </Popconfirm>
        );
      case "ADD_REJECTED":
        return <></>;

      case "CONFIRMED":
        return (
          <>
            <IconButton
              aria-label="edit"
              data-testid={AUTHORIZATION_LIMITS_BLOTTER_EDIT_BTN}
              onClick={() => onClick(LimitationActionType.EDIT, data)}
              disabled={userRole === "Visitor"}
            >
              <EditIcon color="primary" />
            </IconButton>
            <IconButton
              aria-label="delete"
              data-testid={AUTHORIZATION_LIMITS_BLOTTER_DELETE_BTN}
              onClick={() => onClick(LimitationActionType.DELETE, data)}
              disabled={userRole === "Visitor"}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </>
        );

      case "EDIT_PENDING":
        return (
          <Popconfirm
            title="Proceed to verify this modification ?"
            onConfirm={() => onClick(LimitationActionType.APPROVE_EDIT, data)}
            onCancel={() => onClick(LimitationActionType.REJECT_EDIT, data)}
            okText="Approve"
            cancelText="Reject"
            disabled={actionDisable}
          >
            <Button
              style={{ height: "20px", padding: "0 10px" }}
              disabled={actionDisable}
              data-testid={AUTHORIZATION_LIMITS_BLOTTER_VERIFY_MODIFICATION_BTN}
            >
              Verify Modification
            </Button>
          </Popconfirm>
        );

      case "DELETE_PENDING":
        return (
          <Popconfirm
            title="Proceed to delete this limitation ?"
            onConfirm={() => onClick(LimitationActionType.APPROVE_DELETE, data)}
            onCancel={() => onClick(LimitationActionType.REJECT_DELETE, data)}
            okText="Delete"
            cancelText="cancel"
            disabled={actionDisable}
          >
            <Button
              style={{ height: "20px", padding: "0 10px" }}
              disabled={actionDisable}
              data-testid={AUTHORIZATION_LIMITS_BLOTTER_VERIFY_DELETION_BTN}
            >
              Verify Deletion
            </Button>
          </Popconfirm>
        );

      default:
        break;
    }
  }, [userRole, data, onClick]);
  return <Stack direction="row">{actions}</Stack>;
};

export default GridActions;
