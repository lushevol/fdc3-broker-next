import React from "react";
import { Edit as EditIcon, PublishedWithChanges as PublishedWithChangesIcon, Unpublished as UnpublishedIcon, History as HistoryIcon } from "ratan-design-origin/icons";
import { Tooltip } from "ratan-design-origin/primitives";
import { GridActionsCellItem } from "ratan-design-origin/data-grid";
import { AdminRecord } from "../interface";

interface ActionsProps {
  value: { row: AdminRecord };
  onOpen: (row: AdminRecord, mode: string) => () => void;
  onOpenAudit: (row: AdminRecord) => () => void;
  hideEdit?: string;
  hideVerify?: string;
  hideAudit?: string;
}

const Actions = (props: ActionsProps) => {
  const { value, onOpen, onOpenAudit, hideEdit, hideVerify, hideAudit } = props;
  return [
    <GridActionsCellItem
      icon={
        <Tooltip title="Edit record">
          <EditIcon />
        </Tooltip>
      }
      label="Edit"
      className="textPrimary"
      onClick={onOpen(value.row, "edit")}
      color="primary"
      key={`edit-${value.row.id}`}
      data-testid={`edit-${value.row.id}`}
      style={{ display: hideEdit }}
    />,
    <GridActionsCellItem
      icon={
        <Tooltip title="Verify record">
          <PublishedWithChangesIcon color="success" />
        </Tooltip>
      }
      label="Verify"
      onClick={onOpen(value.row, "verify")}
      disabled={value.row.active}
      key={`verify-${value.row.id}`}
      data-testid={`verify-${value.row.id}`}
      style={{ display: hideVerify }}
    />,
    <GridActionsCellItem
      icon={
        <Tooltip title="Deactivate record">
          <UnpublishedIcon color="warning" />
        </Tooltip>
      }
      label="Deactivate"
      onClick={onOpen(value.row, "deactivate")}
      disabled={!value.row.active}
      key={`deactivate-${value.row.id}`}
      data-testid={`deactivate-${value.row.id}`}
    />,
    <GridActionsCellItem
      icon={
        <Tooltip title="Open Audit">
          <HistoryIcon color="secondary" />
        </Tooltip>
      }
      label="Audit"
      onClick={onOpenAudit(value.row)}
      key={`audit-${value.row.id}`}
      data-testid={`audit-${value.row.id}`}
      style={{ display: hideAudit }}
    />,
  ];
};

export default Actions;
