import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React, { type ReactElement } from 'react';
import { useIsNewLayout } from '../../hooks/model/root';
import type { TabProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const TabItem: React.FC<TabProps> = (props: TabProps): ReactElement => {
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
  const menuOpen = Boolean(anchorEl);
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const isNewLayout = useIsNewLayout();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  return (
    <Tooltip title={item.label} placement="top-start">
      <Root
        data-testid={`${PREFIX}`}
        onContextMenu={handleContextMenu}
        className={isNewLayout ? 'tab-item-wrapper' : undefined}
      >
        <div
          className={classes.textBoxOutter}
          style={isNewLayout ? { display: 'flex', alignItems: 'center', gap: '4px' } : {}}
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
            inputProps={{ 'aria-label': 'Workspace Name' }}
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
        <IconButton
          id={`menuWorkspace-${item.id}`}
          data-testid={`menuWorkspace-${item.id}`}
          aria-label="workspace menu"
          size="medium"
          className={classes.button}
          onClick={handleMenuClick}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        {showRemove && (
          <IconButton
            id={`deleteWorkspace-${item.id}`}
            data-testid={`deleteWorkspace-${item.id}`}
            aria-label="delete"
            size="medium"
            onClick={remove(item)}
            className={classes.button}
          >
            {isNewLayout ? <CloseIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              void openInSingleView(item);
            }}
            disabled={!item.containers?.length}
          >
            Open in Single View
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              handleMenuClose();
              remove(item)(e);
            }}
            disabled={!showRemove}
          >
            Close
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              closeOthers(item);
            }}
            disabled={!showRemove}
          >
            Close Others
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              closeAll();
            }}
          >
            Close All
          </MenuItem>
        </Menu>
      </Root>
    </Tooltip>
  );
};

export default React.memo(TabItem);
