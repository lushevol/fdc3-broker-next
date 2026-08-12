import AvatarMui from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import json from '../../../package.json';
import Profile from '../Profile';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScAvatar } from '../webkit';
import type { AvatarProps } from './common/interface';
import Root, { classes, MenuStyled, PREFIX } from './common/style';
import useController from './common/useController';
import prototypeAvatar from '../Profile/assets/prototype-avatar.png';

const Avatar: React.FC<AvatarProps> = (props: AvatarProps): ReactElement => {
  const {
    store,
    anchorElUser,
    openProfile,
    handleOpenUserMenu,
    handleCloseUserMenu,
    onBeforeLogout,
    logoutFromProfile,
    handleOpenUserProfile,
    handleCloseUserProfile,
  } = useController(props);
  const isNewLayout = useIsNewLayout();
  const displayName = store?.user?.fullName ?? store?.user?.userId ?? 'User';
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!isNewLayout) {
    return (
      <>
        <Root className={classes.root} data-testid={`${PREFIX}`}>
          <Tooltip title="User Profiles">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              data-testid={`${PREFIX}_IconButton`}
            >
              <AvatarMui className={classes.img} alt={displayName}>
                {store?.user?.userId ?? <></>}
              </AvatarMui>
            </IconButton>
          </Tooltip>
          <MenuStyled
            sx={{ mt: '35px' }}
            id="menu-appbar-avatar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
  }

  return (
    <div className="base-webkit-scope avatar-menu" data-testid={`${PREFIX}`}>
      <ScAvatar
        id={displayName}
        size="md"
        src={prototypeAvatar}
        clickable
        role="button"
        aria-label="Open user profile"
        title="Open user profile"
        className={classes.root}
        onClick={handleOpenUserProfile}
      >
        {initials}
      </ScAvatar>
      {openProfile && (
        <Profile
          open={openProfile}
          onClose={handleCloseUserProfile}
          onLogout={logoutFromProfile}
        />
      )}
    </div>
  );
};

export default React.memo(Avatar);
