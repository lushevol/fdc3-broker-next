import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import useAnalytics from '../../analytics';
import type { Entity, Subject } from '../../hooks/model/root';
import { useContext } from '../../hooks/provider';
import { DateTimeFormat } from '../../utils/locale';
import type { ProfileProps, RoleProps, SubjectProps } from './common/interface';
import Root, { Accordion } from './common/style';
import { getName } from './util';

const LEGACY_PROFILE_ANALYTICS = { container: 'Base', tile: 'profile' } as const;

const SubjectComp = ({ subject, expanded, handleChange, actionObj }: SubjectProps) => {
  const name = `${subject.name}`;
  return (
    <Accordion expanded={expanded === name} onChange={handleChange(name)} elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`subject-header-${subject.id}`}
        id={`subject-header-${subject.id}`}
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ ml: 3, p: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography
            variant="subtitle1"
            component="div"
            style={{ marginBottom: '4px', marginLeft: 0, marginRight: '4px' }}
          >
            Action:
          </Typography>
          {expanded === name &&
            actionObj.map((action) => (
              <Chip
                key={action}
                label={action}
                variant="filled"
                color="default"
                style={{ marginBottom: '4px', marginLeft: 0, marginRight: '4px' }}
              />
            ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const EntityComp = ({ entity, expanded, handleChange }: RoleProps) => {
  const [store] = useContext();
  const { ButtonEvent } = useAnalytics();
  const name = useMemo(() => getName(entity), [entity]);
  const [expandedSubject, setExpandedSubject] = useState<string | false>(false);

  const handleChangeSubject =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSubject(isExpanded ? panel : false);
      ButtonEvent('click', {
        name: panel,
        value: `${expandedSubject !== panel}`,
        ...LEGACY_PROFILE_ANALYTICS,
      });
    };

  return (
    <Accordion expanded={expanded === name} onChange={handleChange(name)} elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`entity-header-${entity.id}`}
        id={`entity-header-${entity.id}`}
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="subtitle1" component="div">
          Subject:
        </Typography>
        {expanded === name &&
          entity.subjects?.map((subject: Subject) => {
            const entitlements = store.user?.entitlements as
              | Record<string, Record<string, string[]>>
              | undefined;
            const actionObj = entitlements?.[`${entity.name}:${entity.roleName}`]?.[subject.name] ?? [];
            return (
              <SubjectComp
                key={subject.id}
                actionObj={actionObj}
                subject={subject}
                expanded={expandedSubject}
                handleChange={handleChangeSubject}
              />
            );
          })}
      </AccordionDetails>
    </Accordion>
  );
};

interface RoleListProps {
  roles: Entity[];
  expanded: string | false;
  handleChange: RoleProps['handleChange'];
}

const RoleList = ({ roles, expanded, handleChange }: RoleListProps) => (
  <>
    {roles.map((entity) => (
      <EntityComp key={entity.id} entity={entity} expanded={expanded} handleChange={handleChange} />
    ))}
  </>
);

export const RoleComp = (
  roleArray: Entity[],
  expanded: string | false,
  handleChange: RoleProps['handleChange'],
) => <RoleList roles={roleArray} expanded={expanded} handleChange={handleChange} />;

const LegacyProfile: FC<ProfileProps> = ({ open, onClose }) => {
  const [store] = useContext();
  const { ButtonEvent } = useAnalytics();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [functionalProfiles, setFunctionalProfiles] = useState<Entity[]>([]);
  const [entitlementProfiles, setEntitlementProfiles] = useState<Entity[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFunctionalProfiles(
        store.entities?.filter((entity) => entity.name !== 'RATAN_DATA_ENTITLEMENT') ?? [],
      );
      setEntitlementProfiles(
        store.entities?.filter((entity) => entity.name === 'RATAN_DATA_ENTITLEMENT') ?? [],
      );
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [store.entities]);

  const handleChange = (panel: string) =>
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      ButtonEvent('click', {
        name: panel,
        value: `${expanded !== panel}`,
        ...LEGACY_PROFILE_ANALYTICS,
      });
    };

  const authTime = (store.user?.auth_time ?? 0) * 1000;
  const expiredIn = (store.expiredIn ?? 0) * 1000;
  const timeType = store.timeType?.toUpperCase();

  return (
    <Root
      open={open}
      titleComponents="User Profile"
      isResizeble
      onClose={onClose}
      defaultWidth={800}
      defaultHeight={600}
    >
      <Box sx={{ mt: 1, mb: 2 }}>
        <Card sx={{ display: 'flex', justifyContent: 'space-between' }} elevation={0}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
            data-testid="entitlement-profile-label-box"
          >
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                {store.user?.fullName}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {store.user?.oud?.userId}
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {store.user?.oud?.title}
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {store.user?.oud?.emailId}
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {store.user?.oud?.country}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  Login time:
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {DateTimeFormat(timeType, authTime)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  Session Expired time:
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="span">
                  {DateTimeFormat(timeType, expiredIn)}
                </Typography>
              </Stack>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 151, borderRadius: '5px' }}
            image={`https://leap.standardchartered.com/tsp-profile/pics/${store.user?.userId}/photo_lg.jpg`}
            alt="Live from space album cover"
          />
        </Card>
        <Card data-testid="functional-profile-label-card" elevation={0}>
          <Typography component="div" variant="h5" sx={{ p: 2 }}>
            Functional User Profile
          </Typography>
          {RoleComp(functionalProfiles, expanded, handleChange)}
        </Card>
        {!!entitlementProfiles.length && (
          <Card data-testid="entitlement-profile-label" elevation={0}>
            <Typography component="div" variant="h6" sx={{ p: 2 }}>
              Entitlement User Profile
            </Typography>
            {RoleComp(entitlementProfiles, expanded, handleChange)}
          </Card>
        )}
      </Box>
    </Root>
  );
};

export default LegacyProfile;
