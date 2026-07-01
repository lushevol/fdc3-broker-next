import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

import TaskDetailPage from "./TaskDetailPage";

interface RowDetailDialogProps {
  open: boolean;
  onClose: () => void;
  rowData: any;
}

const RowDetailDialog: React.FC<RowDetailDialogProps> = ({
  open,
  onClose,
  rowData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Row Details</DialogTitle>
      <DialogContent dividers style={{ padding: 0 }}>
        {rowData && rowData.taskId ? (
          <TaskDetailPage id={rowData.taskId} />
        ) : null}
      </DialogContent>
      <DialogActions className="flex justify-center pb-8">
        <MuiButton variant="contained" color="primary" onClick={onClose}>
          cancel
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

export default RowDetailDialog;
