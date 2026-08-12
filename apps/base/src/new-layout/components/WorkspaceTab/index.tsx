import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React, { type ReactElement } from 'react';
import { classes, PREFIX } from '../../../components/TabItem/common/style';
import type { TabProps } from '../../../components/TabItem/common/interface';
import NewLayoutWorkspaceTabRoot from './style';

const NewLayoutWorkspaceTab: React.FC<TabProps> = (props): ReactElement => {
  const {
    item,
    edit,
    remove,
    refreshTab,
    showRemove,
    showRefresh,
    closeOthers,
    closeAll,
    openInSingleView,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const closeMenu = () => setAnchorEl(null);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  return (
    <Tooltip title={item.label} placement="top-start">
      <NewLayoutWorkspaceTabRoot
        data-testid={PREFIX}
        onContextMenu={(event) => {
          event.preventDefault();
          openMenu(event);
        }}
      >
        <div
          className={classes.textBoxOutter}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <TextField
            id={`edit-${item.id}`}
            data-testid={`edit-${item.id}`}
            value={item.label}
            variant="standard"
            onChange={edit(item)}
            fullWidth
            className={classes.textBox}
            onClick={() => document.getElementById(`edit-${item.id}`)?.blur()}
            inputProps={{ 'aria-label': 'Workspace Name' }}
          />
        </div>
        {showRefresh && (
          <IconButton
            aria-label="refresh"
            size="medium"
            className={classes.button}
            onClick={refreshTab(item)}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton
          aria-label="workspace menu"
          size="medium"
          className={classes.button}
          onClick={openMenu}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        {showRemove && (
          <IconButton
            aria-label="delete"
            size="medium"
            className={classes.button}
            onClick={remove(item)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={() => {
              closeMenu();
              void openInSingleView(item);
            }}
            disabled={!item.containers?.length}
          >
            Open in Single View
          </MenuItem>
          <MenuItem
            onClick={(event) => {
              closeMenu();
              remove(item)(event);
            }}
            disabled={!showRemove}
          >
            Close
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              closeOthers(item);
            }}
            disabled={!showRemove}
          >
            Close Others
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              closeAll();
            }}
          >
            Close All
          </MenuItem>
        </Menu>
      </NewLayoutWorkspaceTabRoot>
    </Tooltip>
  );
};

export default React.memo(NewLayoutWorkspaceTab);
