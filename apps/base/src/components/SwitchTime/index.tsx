import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import React, { type ReactElement } from 'react';
import StyledRoot, { classes, PREFIX } from './common/style';
import useController from './common/useController';

const SwitchTime: React.FC = (): ReactElement => {
  const { store, toggleTimeType, getTime } = useController();

  return (
    <StyledRoot data-testid={PREFIX}>
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
    </StyledRoot>
  );
};

export default React.memo(SwitchTime);
