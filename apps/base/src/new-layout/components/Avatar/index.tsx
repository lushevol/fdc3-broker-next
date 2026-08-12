import React, { type ReactElement } from 'react';
import type { AvatarProps } from '../../../components/Avatar/common/interface';
import { classes, PREFIX } from '../../../components/Avatar/common/style';
import useController from '../../../components/Avatar/common/useController';
import prototypeAvatar from '../../assets/profile/prototype-avatar.png';
import { ScAvatar } from '../../webkit/components';
import NewLayoutProfile from '../Profile';

const NewLayoutAvatar: React.FC<AvatarProps> = (props): ReactElement => {
  const {
    store,
    openProfile,
    logoutFromProfile,
    handleOpenUserProfile,
    handleCloseUserProfile,
  } = useController(props);
  const displayName = store.user?.fullName ?? store.user?.userId ?? 'User';
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="base-webkit-scope avatar-menu" data-testid={PREFIX}>
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
        <NewLayoutProfile
          open={openProfile}
          onClose={handleCloseUserProfile}
          onLogout={logoutFromProfile}
        />
      )}
    </div>
  );
};

export default React.memo(NewLayoutAvatar);
