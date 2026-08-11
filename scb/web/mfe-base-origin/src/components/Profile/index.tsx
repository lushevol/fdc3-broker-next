import React, { FC, useState, useEffect } from "react";
import { ProfileProps, RoleProps, SubjectProps } from "./common/interface";
import Root, { Accordion } from "./common/style";
import { useContext } from "../../hooks/provider";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Entity, Subject } from "../../hooks/model/root";
import { DateTimeFormat } from "../../utils/locale";

import useAnalytics from "../../analytics";
import { AnalyticsData } from "../../analytics/model";
import { getName } from "./util";
const analyticsData: AnalyticsData = { container: "Base", tile: "profile" };

const SubjectComp = ({
  subject,
  expanded,
  handleChange,
  actionObj,
}: SubjectProps) => {
  const name = `${subject.name}`;
  return (
    <Accordion
      expanded={expanded === name}
      onChange={handleChange(name)}
      elevation={0}
    >
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
            style={{ marginBottom: "4px", marginLeft: 0, marginRight: "4px" }}
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
                style={{
                  marginBottom: "4px",
                  marginLeft: 0,
                  marginRight: "4px",
                }}
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
  const name = React.useMemo(() => getName(entity), [entity]);
  const [expandedSubject, setExpandedSubject] = React.useState<string | false>(
    false
  );

  const handleChangeSubject =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSubject(isExpanded ? panel : false);
      ButtonEvent("click", {
        name: panel,
        value: `${expandedSubject !== panel}`,
        ...analyticsData,
      });
    };
  return (
    <Accordion
      expanded={expanded === name}
      onChange={handleChange(name)}
      elevation={0}
    >
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
          entity?.subjects?.map((subject: Subject) => {
            const entitlements = { ...store?.user?.entitlements };
            const actionObj =
              entitlements[`${entity.name}:${entity.roleName}`][subject.name];
            return (
              <SubjectComp
                key={name}
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

export const RoleComp = (
  roleArray: Entity[] | undefined,
  expanded: string | false,
  handleChange: RoleProps["handleChange"]
) => {
  return roleArray?.map((entity: Entity) => {
    return (
      <EntityComp
        key={entity.id}
        entity={entity}
        expanded={expanded}
        handleChange={handleChange}
      />
    );
  });
};

const Profile: FC<ProfileProps> = ({ open, onClose }) => {
  const [store] = useContext();
  const { ButtonEvent } = useAnalytics();
  const [functionalProfileArray, setFunctionalProfileArray] = useState<
    Entity[]
  >([]);
  const [entitlementProfileArray, setEntitlementProfileArray] = useState<
    Entity[]
  >([]);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      ButtonEvent("click", {
        name: panel,
        value: `${expanded !== panel}`,
        ...analyticsData,
      });
    };

  useEffect(() => {
    setTimeout(() => {
      const array1 = store?.entities?.filter(
        (entity: Entity) => entity?.name !== "RATAN_DATA_ENTITLEMENT"
      );
      const array2 = store?.entities?.filter(
        (entity: Entity) => entity?.name === "RATAN_DATA_ENTITLEMENT"
      );
      setFunctionalProfileArray(array1 ?? []);
      setEntitlementProfileArray(array2 ?? []);
    }, 500);
  }, []);

  const auth_time = (store?.user?.auth_time as number) * 1000;
  const expiredIn = (store?.expiredIn as number) * 1000;
  const timeType = store?.timeType?.toUpperCase();

  return (
    <Root
      open={open}
      titleComponents={"User Profile"}
      isResizeble={true}
      onClose={() => onClose()}
      defaultWidth={800}
      defaultHeight={600}
    >
      <Box sx={{ mt: 1, mb: 2 }}>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
          elevation={0}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", p: 2 }}
            data-testid="entitlement-profile-label-box"
          >
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {store?.user?.fullName}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  {store?.user?.oud?.userId}
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  {store?.user?.oud?.title}
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  {store?.user?.oud?.emailId}
                </Typography>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  {store?.user?.oud?.country}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  Login time:
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  {DateTimeFormat(timeType, auth_time)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  Session Expired time:
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="span"
                >
                  {DateTimeFormat(timeType, expiredIn)}
                </Typography>
              </Stack>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 151, borderRadius: "5px" }}
            image={`https://leap.standardchartered.com/tsp-profile/pics/${store.user?.userId}/photo_lg.jpg`}
            alt="Live from space album cover"
          />
        </Card>
        <Card data-testid="functional-profile-label-card" elevation={0}>
          <Typography component="div" variant="h5" sx={{ p: 2 }}>
            Functional User Profile
          </Typography>
          {RoleComp(functionalProfileArray, expanded, handleChange)}
        </Card>

        {!!entitlementProfileArray.length && (
          <Card data-testid="entitlement-profile-label" elevation={0}>
            <Typography component="div" variant="h6" sx={{ p: 2 }}>
              Entitlement User Profile
            </Typography>
            {RoleComp(entitlementProfileArray, expanded, handleChange)}
          </Card>
        )}
      </Box>
    </Root>
  );
};

export default Profile;
