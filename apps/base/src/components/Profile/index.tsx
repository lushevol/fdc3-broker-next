import React, { type FC, useMemo, useState } from 'react';
import useAnalytics from '../../analytics';
import type { Entity } from '../../hooks/model/root';
import { useContext } from '../../hooks/provider';
import { useIsNewLayout } from '../../hooks/model/root';
import useDispatcher from '../../hooks/dispathcer';
import { DateTimeFormat } from '../../utils/locale';
import { ScAvatar, ScBadge, ScButton, ScCard, ScDivider, ScModal, ScParagraph, ScTitle } from '../webkit';
import type { ProfileProps } from './common/interface';
import { PREFIX } from './common/style';

const PROFILE_ANALYTICS = { container: 'Base', tile: 'profile' } as const;

const timestamp = (value?: number) => (value ? value * 1000 : 0);

const Profile: FC<ProfileProps> = ({ open, onClose }) => {
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
  const loginTime = DateTimeFormat(timeType, timestamp(user?.auth_time));
  const expiryTime = DateTimeFormat(timeType, timestamp(store.expiredIn));

  const selectTimeType = (next: 'LOCAL' | 'UTC') => {
    setTimeType(next);
    dispacthTimeType(next.toLowerCase());
    ButtonEvent('click', { name: 'profile timezone', value: next, ...PROFILE_ANALYTICS });
  };

  if (!isNewLayout) {
    return open ? (
      <div role="dialog" aria-label="User Profile" data-testid={`${PREFIX}`}>
        <h2>User Profile</h2>
        <p>{fullName}</p>
        <dl>
          <div><dt>Bank ID</dt><dd>{bankId}</dd></div>
          <div><dt>Email</dt><dd>{email}</dd></div>
          <div><dt>Country</dt><dd>{country}</dd></div>
          <div><dt>Session expiry</dt><dd>{expiryTime}</dd></div>
        </dl>
        <p>Time display</p>
        <button type="button" onClick={() => selectTimeType('LOCAL')}>Local time</button>
        <button type="button" onClick={() => selectTimeType('UTC')}>UTC</button>
        <h3>Permissions and roles</h3>
        {roles.map((entity: Entity) => <span key={entity.id}>{entity.roleName || entity.name}</span>)}
        <button type="button" onClick={onClose}>Close</button>
      </div>
    ) : <></>;
  }

  return (
    <div className="base-webkit-scope">
      <ScModal
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
            role="button"
            aria-label="Close User Profile"
            title="Close User Profile"
            className="profile-modal-close"
            onClick={onClose}
          >
            <span className="profile-close-icon" aria-hidden="true" />
          </ScButton>
          <div className="profile-header">
            <div className="profile-identity">
              <ScAvatar
                id={fullName}
                size="lg"
                src={`https://leap.standardchartered.com/tsp-profile/pics/${user?.userId}/photo_lg.jpg`}
                aria-label={fullName}
                className="profile-avatar"
              >
                {fullName.slice(0, 1).toUpperCase()}
              </ScAvatar>
              <div>
                <ScTitle level={2}>{fullName}</ScTitle>
                <ScParagraph>{user?.oud?.title ?? 'Account details and access for this session'}</ScParagraph>
              </div>
            </div>
          </div>
          <ScDivider />
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
            <div>
              <dt>Signed in</dt>
              <dd>{loginTime}</dd>
            </div>
          </dl>
          <div className="profile-preference">
            <div>
              <ScTitle level={3}>Time display</ScTitle>
              <ScParagraph>Choose how session times are shown.</ScParagraph>
            </div>
            <div role="group" aria-label="Timezone preference">
              {(['LOCAL', 'UTC'] as const).map((option) => (
                <ScButton
                  key={option}
                  type={timeType === option ? 'primary' : 'text'}
                  role="button"
                  selectable="toggle"
                  selected={timeType === option}
                  onClick={() => selectTimeType(option)}
                >
                  {option === 'LOCAL' ? 'Local time' : 'UTC'}
                </ScButton>
              ))}
            </div>
          </div>
          <ScCard className="profile-card">
            <div className="profile-card-content">
              <ScTitle level={3}>Permissions and roles</ScTitle>
              {roles.length ? (
                <div className="profile-roles">
                  {roles.map((entity: Entity) => (
                    <ScBadge key={entity.id} type="text" color="blue" label={entity.roleName || entity.name} />
                  ))}
                </div>
              ) : (
                <ScParagraph>No permissions are assigned to this account.</ScParagraph>
              )}
            </div>
          </ScCard>
        </div>
      </ScModal>
    </div>
  );
};

export default Profile;
