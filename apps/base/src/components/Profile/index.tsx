import React, { type FC, useEffect, useMemo, useRef, useState } from 'react';
import useAnalytics from '../../analytics';
import type { Entity } from '../../hooks/model/root';
import { useContext } from '../../hooks/provider';
import { useIsNewLayout } from '../../hooks/model/root';
import useDispatcher from '../../hooks/dispathcer';
import { DateTimeFormat } from '../../utils/locale';
import { ScBadge, ScButton, ScModal, setScModalWidth } from '../webkit';
import type { ProfileProps } from './common/interface';
import { PREFIX } from './common/style';
import prototypeAvatar from './assets/prototype-avatar.png';
import LegacyProfile from './LegacyProfile';

export { RoleComp } from './LegacyProfile';

const PROFILE_ANALYTICS = { container: 'Base', tile: 'profile' } as const;

const timestamp = (value?: number) => (value ? value * 1000 : 0);
const displayTime = (timeType: string) => new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: timeType === 'UTC' ? 'UTC' : undefined,
}).format(new Date());

const Profile: FC<ProfileProps> = ({ open, onClose, onLogout }) => {
  const [store] = useContext();
  const { dispacthTimeType } = useDispatcher();
  const { ButtonEvent } = useAnalytics();
  const [timeType, setTimeType] = useState((store.timeType ?? 'local').toUpperCase());
  const user = store.user;
  const fullName = user?.fullName ?? user?.name ?? user?.userId ?? 'User';
  const bankId = user?.oud?.userId ?? user?.userId ?? '—';
  const email = user?.oud?.emailId ?? user?.emailId ?? '—';
  const country = user?.oud?.country ?? user?.country ?? '—';
  const roles = useMemo(() => store.entities ?? [], [store.entities]);
  const isNewLayout = useIsNewLayout();
  const expiryTime = DateTimeFormat(timeType, timestamp(store.expiredIn));
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isNewLayout && open) setScModalWidth(modalRef.current, '24rem');
  }, [isNewLayout, open]);

  const selectTimeType = (next: 'LOCAL' | 'UTC') => {
    setTimeType(next);
    dispacthTimeType(next.toLowerCase());
    ButtonEvent('click', { name: 'profile timezone', value: next, ...PROFILE_ANALYTICS });
  };

  if (!isNewLayout) {
    return <LegacyProfile open={open} onClose={onClose} />;
  }

  return (
    <div className="base-webkit-scope">
        <ScModal
          ref={modalRef}
        open={open}
        size="sm"
        no-header
        no-padding
        aria-label="User profile"
        onScHide={onClose}
      >
        <div className="profile-modal" data-testid={`${PREFIX}`}>
          <ScButton
            type="text"
            size="xs"
            role="button"
            aria-label="Close User Profile"
            title="Close User Profile"
            className="profile-modal-close"
            onClick={onClose}
          >
            <span className="webkit-close-glyph" aria-hidden="true">x</span>
          </ScButton>
          <div className="profile-header">
            <div className="profile-identity">
              <div className="profile-avatar">
                <img src={prototypeAvatar} alt={`${fullName} avatar`} />
              </div>
              <div className="profile-name-block">
                <h2>{fullName}</h2>
                <p>{user?.oud?.title ?? 'Account details and access for this session'}</p>
              </div>
            </div>
          </div>
          <dl className="profile-details">
            <div>
              <dt>Bank ID</dt>
              <dd>{bankId}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{email}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{country}</dd>
            </div>
            <div>
              <dt>Session expiry</dt>
              <dd>{expiryTime}</dd>
            </div>
          </dl>
          <div className="profile-role-section">
            <h3>Permissions &amp; roles</h3>
            {roles.length ? (
              <div className="profile-roles">
                {roles.map((entity: Entity) => (
                  <ScBadge key={entity.id} type="text" color="blue" label={entity.roleName || entity.name} />
                ))}
              </div>
            ) : <p>No permissions are assigned to this account.</p>}
          </div>
          <div className="profile-preference">
            <div className="profile-time-copy">
              <strong>{displayTime(timeType)}</strong>
              <span>Timezone preference</span>
            </div>
            <div className="profile-time-toggle" role="group" aria-label="Timezone preference">
              {(['LOCAL', 'UTC'] as const).map((option) => (
                <ScButton
                  key={option}
                  type={timeType === option ? 'primary' : 'text'}
                  role="button"
                size="xs"
                  noPill
                  selectable="toggle"
                  selected={timeType === option}
                  onClick={() => selectTimeType(option)}
                >
                  {option === 'LOCAL' ? 'Local' : 'UTC'}
                </ScButton>
              ))}
            </div>
          </div>
          <ScButton
            type="text"
            noPill
            state="error"
            width="100%"
            role="button"
            className="profile-logout"
            onClick={onLogout ?? onClose}
          >
            Logout
          </ScButton>
        </div>
      </ScModal>
    </div>
  );
};

export default Profile;
