import React from 'react';
import { Dialog } from 'ratan-design-origin';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Chip,
  IconButton,
  Typography,
} from 'ratan-design-origin/primitives';
import {
  BadgeOutlined,
  Close,
  ExpandMore,
  MailOutline,
  PersonOutlined,
  VerifiedUserOutlined,
} from 'ratan-design-origin/icons';
import type { Entity, User } from '../hooks/model/root';
import { DateTimeFormat } from '../utils/locale';
import { getProfileStyles, profileLayout } from './profile-styles';
import { useProfileReducedMotion } from './profile-motion';
import { portalTokens } from './portal-tokens';
import lightLower from './assets/profile-banner-light-lower-right.png';
import darkLower from './assets/profile-banner-dark-lower-right.png';

export interface PrototypeProfileProps {
  open: boolean;
  mode: 'light' | 'dark';
  user?: User;
  entities?: Entity[];
  expiredIn?: number;
  timeType?: string;
  onClose: () => void;
  onExpansion?: (event: { name: string; value: string }) => void;
}

type ProfileStyles = ReturnType<typeof getProfileStyles>;

const metadataIcons = { identity: BadgeOutlined, email: MailOutline };

const formatSession = (value: number | undefined, timeType: string | undefined) =>
  value !== undefined && Number.isFinite(value)
    ? DateTimeFormat(timeType?.toUpperCase(), value * 1000)
    : 'Not available';

const ProfileRole = ({
  entity,
  expanded,
  onChange,
  onExpansion,
  entitlements,
  styles,
  striped,
  transitionMs,
}: {
  entity: Entity;
  expanded: boolean;
  onChange: (isExpanded: boolean) => void;
  onExpansion: PrototypeProfileProps['onExpansion'];
  entitlements: User['entitlements'];
  styles: ProfileStyles;
  striped: boolean;
  transitionMs: number;
}) => {
  const [subjectExpanded, setSubjectExpanded] = React.useState<number | false>(false);
  const id = React.useId();
  const name = `${entity.applicationName ?? '*'}::${entity.name}::${entity.roleName}`;
  return (
    <Accordion
      expanded={expanded}
      onChange={(_event, next) => onChange(next)}
      TransitionProps={{ unmountOnExit: true, timeout: transitionMs }}
      elevation={0}
      sx={styles.accordion}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`${id}-role`}
        aria-controls={`${id}-subjects`}
        sx={{
          ...styles.summary,
          ...styles.roleSummary,
          ...(striped ? styles.stripe : {}),
          ...(expanded && subjectExpanded === false ? styles.selected : {}),
        }}
      >
        <Typography sx={styles.rowText}>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails
        id={`${id}-subjects`}
        aria-hidden={!expanded}
        sx={{ ...styles.roleDetails, visibility: expanded ? 'visible' : 'hidden' }}
      >
        {entity.subjects.length === 0 && (
          <Typography sx={styles.empty}>No subjects available.</Typography>
        )}
        {entity.subjects.map((subject, index) => {
          const actions = entitlements?.[`${entity.name}:${entity.roleName}`]?.[subject.name] ?? [];
          const selected = subjectExpanded === index;
          return (
            <Accordion
              key={`${subject.id}-${index}`}
              expanded={selected}
              elevation={0}
              sx={styles.accordion}
              onChange={(_event, next) => {
                setSubjectExpanded(next ? index : false);
                onExpansion?.({ name: subject.name, value: String(next) });
              }}
              TransitionProps={{ unmountOnExit: true, timeout: transitionMs }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                id={`${id}-subject-${index}`}
                aria-controls={`${id}-actions-${index}`}
                sx={{
                  ...styles.summary,
                  ...styles.subjectSummary,
                  ...(selected ? styles.selected : {}),
                }}
              >
                <Typography sx={styles.rowText}>{subject.name}</Typography>
              </AccordionSummary>
              <AccordionDetails
                id={`${id}-actions-${index}`}
                aria-hidden={!selected}
                sx={{ ...styles.actionDetails, visibility: selected ? 'visible' : 'hidden' }}
              >
                <Typography sx={styles.rowText}>Action:</Typography>
                {actions.length ? (
                  actions.map((action, actionIndex) => (
                    <Chip key={`${action}-${actionIndex}`} label={action} />
                  ))
                ) : (
                  <Typography sx={styles.rowText}>No permitted actions available.</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

const ProfilePortrait = ({
  userId,
  name,
  styles,
}: {
  userId?: string;
  name: string;
  styles: ProfileStyles;
}) => {
  const [failedSource, setFailedSource] = React.useState<string>();
  const source = userId
    ? `https://leap.standardchartered.com/tsp-profile/pics/${encodeURIComponent(userId)}/photo_lg.jpg`
    : undefined;
  const unavailable = !source || source === failedSource;
  return (
    <Avatar
      sx={styles.portrait}
      alt={`${name} profile photo`}
      src={unavailable ? undefined : source}
      role={unavailable ? 'img' : undefined}
      aria-label={unavailable ? `${name} profile photo unavailable` : undefined}
      imgProps={{ onError: () => setFailedSource(source) }}
    >
      <PersonOutlined />
    </Avatar>
  );
};

/** Private Base presentation; the existing Profile boundary retains store and analytics policy. */
export const PrototypeProfile = ({
  open,
  mode,
  user,
  entities = [],
  expiredIn,
  timeType,
  onClose,
  onExpansion,
}: PrototypeProfileProps) => {
  const titleId = React.useId();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const reducedMotion = useProfileReducedMotion();
  const transitionMs = reducedMotion ? 0 : profileLayout.transitionMs;
  const styles = getProfileStyles(mode, expanded !== false);
  const functional = entities.filter((entity) => entity.name !== 'RATAN_DATA_ENTITLEMENT');
  const data = entities.filter((entity) => entity.name === 'RATAN_DATA_ENTITLEMENT');
  const name = user?.fullName ?? user?.oud?.fullName ?? user?.userId ?? 'User';
  const metadata = [
    { value: user?.oud?.userId ?? user?.userId, icon: 'identity' as const },
    { value: user?.oud?.emailId ?? user?.emailId, icon: 'email' as const },
    { value: user?.oud?.country ?? user?.country },
    { value: user?.oud?.title },
  ].filter((item) => item.value);
  const roles = (group: Entity[], groupName: string) =>
    group.map((entity, index) => {
      const key = `${groupName}-${entity.id}-${entity.roleId}-${index}`;
      return (
        <ProfileRole
          key={key}
          entity={entity}
          expanded={expanded === key}
          entitlements={user?.entitlements}
          onExpansion={onExpansion}
          styles={styles}
          striped={index % 2 === 0}
          transitionMs={transitionMs}
          onChange={(next) => {
            setExpanded(next ? key : false);
            onExpansion?.({
              name: `${entity.applicationName ?? '*'} :: ${entity.name} :: ${entity.roleName}`,
              value: String(next),
            });
          }}
        />
      );
    });
  const section = (label: string) => (
    <Box sx={styles.section}>
      <Box
        sx={{
          width: profileLayout.sectionGlyphWidth,
          height: profileLayout.sectionGlyphHeight,
          flexShrink: 0,
        }}
      >
        <VerifiedUserOutlined />
      </Box>
      <Typography component="h3">{label}</Typography>
    </Box>
  );
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      maxWidth={false}
      transitionDuration={transitionMs}
      BackdropProps={{ sx: { backgroundColor: portalTokens.color.backdrop } }}
      PaperProps={{ sx: styles.paper, 'data-testid': 'prototype-profile-paper' }}
      contentProps={{
        sx: styles.content,
        onScroll: ({ currentTarget }) => {
          currentTarget.style.setProperty(
            profileLayout.portraitScrollVariable,
            `${Math.max(0, currentTarget.scrollTop)}px`,
          );
        },
      }}
      header={
        <Box sx={styles.banner} data-testid="prototype-profile-banner">
          <Box
            component="img"
            src={mode === 'light' ? lightLower : darkLower}
            alt=""
            sx={styles.bannerArtwork}
          />
          <Typography component="h2" id={titleId} sx={styles.title}>
            User Profile
          </Typography>
          <IconButton aria-label="Close User Profile" onClick={onClose} sx={styles.close}>
            <Close />
          </IconButton>
        </Box>
      }
    >
      <Box sx={styles.identity} data-testid="prototype-profile-identity">
        <ProfilePortrait userId={user?.userId} name={name} styles={styles} />
        <Typography component="h3" sx={styles.name}>
          {name}
        </Typography>
        {!!metadata.length && (
          <Box sx={styles.metadata}>
            {metadata.map((item, index) => (
              <span key={index}>
                {item.icon && React.createElement(metadataIcons[item.icon])}
                {item.value}
              </span>
            ))}
          </Box>
        )}
        <Typography sx={styles.session}>
          Login time: {formatSession(user?.auth_time, timeType)}
        </Typography>
        <Typography sx={styles.session}>
          Session Expired time: {formatSession(expiredIn, timeType)}
        </Typography>
      </Box>
      <Box sx={styles.hierarchy} role="region" aria-label="Profile entitlements" tabIndex={0}>
        {section('Functional User Profile')}
        {functional.length ? (
          roles(functional, 'functional')
        ) : (
          <Typography sx={styles.empty}>No functional profiles available.</Typography>
        )}
        {!!data.length && (
          <>
            {section('Entitlement User Profile')}
            {roles(data, 'data')}
          </>
        )}
      </Box>
    </Dialog>
  );
};
