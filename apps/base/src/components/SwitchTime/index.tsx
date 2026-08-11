import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import React, { type ReactElement } from 'react';
import { useIsNewLayout } from '../../hooks/model/root';
import { SwitchStyled } from '../Switch/common/style';
import darkIcon from './common/images/clock-dark.svg';
import lightIcon from './common/images/clock-light.svg';
import StyledRoot, { classes, PREFIX } from './common/style';
import useController from './common/useController';

const SwitchTime: React.FC = (): ReactElement => {
  const { store, toggleTimeType, getTime } = useController();
  const isNewLayout = useIsNewLayout();

  return (
    <StyledRoot data-testid={PREFIX} className={isNewLayout ? 'switch-time-wrapper' : undefined}>
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
            <SwitchStyled
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
    </StyledRoot>
  );
};

export default React.memo(SwitchTime);
