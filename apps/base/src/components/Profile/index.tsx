import React, { type FC } from 'react';
import type { ProfileProps } from './common/interface';
import LegacyProfile from './LegacyProfile';

export { RoleComp } from './LegacyProfile';

const Profile: FC<ProfileProps> = ({ open, onClose }) => (
  <LegacyProfile open={open} onClose={onClose} />
);

export default Profile;
