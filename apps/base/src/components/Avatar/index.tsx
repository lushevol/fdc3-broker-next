import React, { type ReactElement } from 'react';
import json from '../../../package.json';
import Profile from '../Profile';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScAvatar } from '../webkit';
import type { AvatarProps } from './common/interface';
import { classes, PREFIX } from './common/style';
import useController from './common/useController';
import prototypeAvatar from '../Profile/assets/prototype-avatar.png';

const Avatar: React.FC<AvatarProps> = (props: AvatarProps): ReactElement => {
  const {
    store,
    anchorElUser,
    openProfile,
    handleOpenUserMenu,
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
      <div data-testid={`${PREFIX}`}>
        <button
          type="button"
          data-testid={`${PREFIX}_IconButton`}
          aria-label="Open user menu"
          aria-expanded={Boolean(anchorElUser)}
          onClick={handleOpenUserMenu}
        >
          {initials}
        </button>
        {anchorElUser && (
          <div role="menu" aria-label="User actions">
            <button type="button" data-testid={`${PREFIX}_Profile`} onClick={handleOpenUserProfile}>
              Profile
            </button>
            <button type="button" data-testid={`${PREFIX}_Logout`} onClick={onBeforeLogout}>
              Logout
            </button>
            <span data-testid={`${PREFIX}_Version`}>Base {json.version}</span>
          </div>
        )}
        {openProfile && <Profile open={openProfile} onClose={handleCloseUserProfile} />}
      </div>
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
