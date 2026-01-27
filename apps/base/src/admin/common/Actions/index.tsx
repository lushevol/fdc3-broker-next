import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import Tooltip from '@mui/material/Tooltip';
import { GridActionsCellItem } from '@mui/x-data-grid';

const Actions = (props) => {
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
      onClick={onOpen(value.row, 'edit')}
      color="primary"
      key={`edit-${value.row.id}`}
      data-testid={`edit-${value.row.id}`}
      sx={{ display: hideEdit }}
    />,
    <GridActionsCellItem
      icon={
        <Tooltip title="Verify record">
          <PublishedWithChangesIcon />
        </Tooltip>
      }
      label="Verify"
      onClick={onOpen(value.row, 'verify')}
      color="success"
      disabled={value.row.active}
      key={`verify-${value.row.id}`}
      data-testid={`verify-${value.row.id}`}
      sx={{ display: hideVerify }}
    />,
    <GridActionsCellItem
      icon={
        <Tooltip title="Deactivate record">
          <UnpublishedIcon />
        </Tooltip>
      }
      label="Deactivate"
      color="warning"
      onClick={onOpen(value.row, 'deactivate')}
      disabled={!value.row.active}
      key={`deactivate-${value.row.id}`}
      data-testid={`deactivate-${value.row.id}`}
    />,
    <GridActionsCellItem
      icon={
        <Tooltip title="Open Audit">
          <HistoryIcon />
        </Tooltip>
      }
      label="Audit"
      onClick={onOpenAudit(value.row)}
      color="secondary"
      key={`audit-${value.row.id}`}
      data-testid={`audit-${value.row.id}`}
      sx={{ display: hideAudit }}
    />,
  ];
};

export default Actions;
