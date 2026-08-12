import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import React, { type ReactElement } from 'react';
import Root, { classes, PREFIX, SwitchStyled } from './common/style';
import useController from './common/useController';

const Switch: React.FC = (): ReactElement => {
  const { store, toggleColorMode } = useController();
  return (
    <Root className={classes.root} data-testid={`${PREFIX}`}>
      <div className={classes.icon}>
        {store.theme === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
      </div>
      <div className={classes.switch}>
        <div>
          <span className={classes.label}>{store.theme}</span>
          <SwitchStyled
            checked={store.theme === 'light'}
            onChange={toggleColorMode}
            data-testid={`${PREFIX}_SwitchStyled`}
            inputProps={{ 'aria-label': 'Theme Switch' }}
          />
        </div>
      </div>
    </Root>
  );
};

export default React.memo(Switch);
