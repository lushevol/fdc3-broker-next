import AvatarMui from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import json from '../../../package.json';
import Profile from '../Profile';
import type { AvatarProps } from './common/interface';
import Root, { classes, MenuStyled, PREFIX } from './common/style';
import useController from './common/useController';

const Avatar: React.FC<AvatarProps> = (props: AvatarProps): ReactElement => {
  const {
    store,
    anchorElUser,
    openProfile,
    handleOpenUserMenu,
    handleCloseUserMenu,
    onBeforeLogout,
    handleOpenUserProfile,
    handleCloseUserProfile,
  } = useController(props);
  let imgUrl = '';
  if (store?.user?.id) {
    imgUrl = `https://axess.sc.net/scb-axess-cms/api/users/${store?.user?.id}/photo`;
  }

  return (
    <>
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <Tooltip title="User Profiles">
          <IconButton
            onClick={handleOpenUserMenu}
            sx={{ p: 0 }}
            data-testid={`${PREFIX}_IconButton`}
          >
            <AvatarMui className={classes.img} alt="Avatar" src={imgUrl} />
          </IconButton>
        </Tooltip>
        <MenuStyled
          sx={{ mt: '35px' }}
          id="menu-appbar-avatar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            data-testid={`${PREFIX}_Profile`}
            onClick={handleOpenUserProfile}
            sx={{ flexDirection: 'column', alignItems: 'start' }}
          >
            <Typography display="block">{store?.user?.fullName ?? store?.user?.userId}</Typography>
            <Typography variant="caption" display="block" color="InactiveCaptionText">
              Click to view user profile details
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={onBeforeLogout} data-testid={`${PREFIX}_Logout`}>
            <Typography display="block">Logout</Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            data-testid={`${PREFIX}_Version`}
            className={classes.disable}
            sx={{ flexDirection: 'column', alignItems: 'start' }}
          >
            <Typography variant="caption" display="block" color="InactiveCaptionText">
              Root Config Version: {store.rootVersion}
            </Typography>
            <Typography variant="caption" display="block" color="InactiveCaptionText">
              Base Container Version: {json.version}
            </Typography>
          </MenuItem>
        </MenuStyled>
      </Root>
      {openProfile && <Profile open={openProfile} onClose={handleCloseUserProfile} />}
    </>
  );
};

export default React.memo(Avatar);
