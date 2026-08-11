import React, { type ReactElement } from 'react';
import json from '../../../package.json';
import Profile from '../Profile';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScAvatar, ScDivider, ScMenu, ScMenuItem, ScParagraph } from '../webkit';
import type { AvatarProps } from './common/interface';
import { classes, PREFIX } from './common/style';
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
        size="sm"
        clickable
        role="button"
        aria-label="Open user menu"
        aria-expanded={Boolean(anchorElUser)}
        className={classes.root}
        onClick={handleOpenUserMenu}
      >
        {initials}
      </ScAvatar>
      {anchorElUser ? (
        <ScMenu
          aria-label="User actions"
          onScSelect={(event: CustomEvent<{ item: { value: string } }>) => {
            const action = event.detail.item.value;
            if (action === 'profile') handleOpenUserProfile();
            if (action === 'logout') onBeforeLogout();
          }}
          onBlur={handleCloseUserMenu}
        >
          <ScMenuItem value="profile" role="menuitem" data-testid={`${PREFIX}_Profile`}>
            Profile
            <span slot="description">View account details and permissions</span>
          </ScMenuItem>
          <ScMenuItem value="logout" role="menuitem" data-testid={`${PREFIX}_Logout`}>
            Logout
          </ScMenuItem>
          <ScDivider />
          <ScMenuItem value="version" role="menuitem" disabled data-testid={`${PREFIX}_Version`}>
            <ScParagraph>
              Root Config {store.rootVersion ?? '—'} · Base {json.version}
            </ScParagraph>
          </ScMenuItem>
        </ScMenu>
      ) : null}
      {openProfile && <Profile open={openProfile} onClose={handleCloseUserProfile} />}
    </div>
  );
};

export default React.memo(Avatar);
