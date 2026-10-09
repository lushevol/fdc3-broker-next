import React, { ReactElement } from 'react';
import { FormLabel, FormControl, Switch } from 'ratan-design-origin/primitives';
import StyledRoot, { classes, PREFIX } from '../../components/SwitchTime/common/style';
import { SwitchStyled } from '../../components/Switch/common/style';
import useController from '../../components/SwitchTime/common/useController';
import darkIcon from '../../components/SwitchTime/common/images/clock-dark.svg';
import lightIcon from '../../components/SwitchTime/common/images/clock-light.svg';
import { resolvePortalAppearance, useIsNewLayout } from '../appearance';
import { PortalHeaderSwitch, PortalTimeSwitchRoot } from '../header-styles';

const SwitchTime: React.FC = (): ReactElement => {
  const { store, toggleTimeType, getTime } = useController();
  const isNewLayout = useIsNewLayout();
  const isPortal = resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype';
  const SwitchRoot = isPortal ? PortalTimeSwitchRoot : StyledRoot;
  const SwitchControl = isPortal ? PortalHeaderSwitch : SwitchStyled;

  return (
    <SwitchRoot
      {...(isPortal ? { component: 'section' as const } : {})}
      data-testid={PREFIX}
      className={isNewLayout ? 'switch-time-wrapper' : undefined}
    >
      {isNewLayout ? (
        <div>
          <span className="switch-time-icon">
            {store.theme === 'light' ? (
              <img src={lightIcon} alt="Clock" width="20px" height="20px" />
            ) : (
              <img src={darkIcon} alt="Clock" width="20px" height="20px" />
            )}
          </span>
          <FormControl component="fieldset" variant="standard" className={classes.form}>
            <FormLabel component="span" className={classes.label}>
              {getTime()}
            </FormLabel>
            <SwitchControl
              className="custom-switch"
              checked={store.timeType?.toUpperCase() === 'UTC'}
              onChange={toggleTimeType}
              data-testid={`${PREFIX}_switchtime`}
              inputProps={{ 'aria-label': 'Time Switch' }}
            />
          </FormControl>
        </div>
      ) : (
        <FormControl component="fieldset" variant="standard" className={classes.form}>
          <FormLabel component="span" className={classes.label}>
            {getTime()}
          </FormLabel>
          <Switch
            checked={store.timeType?.toUpperCase() === 'UTC'}
            onChange={toggleTimeType}
            name="timeType"
            size="small"
            color="default"
            data-testid={`${PREFIX}_switchtime`}
            inputProps={{ 'aria-label': 'Time Switch' }}
          />
        </FormControl>
      )}
    </SwitchRoot>
  );
};

export default React.memo(SwitchTime);
