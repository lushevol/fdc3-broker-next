import React, { ReactElement } from "react";
import TextField from "@mui/material/TextField";
import { TabProps } from "./common/interface";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import Root, { classes, PREFIX } from "./common/style";
import { useIsNewLayout } from "../../hooks/model/root";

const TabItem: React.FC<TabProps> = (props: TabProps): ReactElement => {
  const { item, edit, remove, refreshTab, showRemove, showRefresh } = props;
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const isNewLayout = useIsNewLayout();
  return (
    <Tooltip title={item.label} placement="top-start">
      <Root
        data-testid={`${PREFIX}`}
        className={isNewLayout ? "tab-item-wrapper" : undefined}
      >
        <div
          className={classes.textBoxOutter}
          style={
            isNewLayout
              ? { display: "flex", alignItems: "center", gap: "4px" }
              : {}
          }
        >
          <TextField
            id={`edit-${item.id}`}
            data-testid={`edit-${item.id}`}
            value={item.label}
            variant="standard"
            onChange={edit(item)}
            fullWidth={true}
            className={classes.textBox}
            onClick={() => {
              document.getElementById(`edit-${item.id}`)?.blur();
            }}
            inputProps={{ "aria-label": "Workspace Name" }}
          />
        </div>
        {showRefresh && (
          <IconButton
            id={`refreshWorkspace-${item.id}`}
            data-testid={`refreshWorkspace-${item.id}`}
            aria-label="refresh"
            size="medium"
            className={classes.button}
            onClick={refreshTab(item)}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
        {showRemove && (
          <IconButton
            id={`deleteWorkspace-${item.id}`}
            data-testid={`deleteWorkspace-${item.id}`}
            aria-label="delete"
            size="medium"
            onClick={remove(item)}
            className={classes.button}
          >
            {isNewLayout ? (
              <CloseIcon fontSize="small" />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Root>
    </Tooltip>
  );
};

export default React.memo(TabItem);
