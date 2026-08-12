import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import React, { type ReactElement } from 'react';
import { useIsNewLayout } from '../../hooks/model/root';
import moon from './common/images/moon.svg';
import sun from './common/images/sun.svg';
import Root, { classes, PREFIX, SwitchStyled } from './common/style';
import useController from './common/useController';

const Switch: React.FC = (): ReactElement => {
  const isNewLayout = useIsNewLayout();
  const { store, toggleColorMode } = useController();
  return (
    <Root
      className={isNewLayout ? `${classes.root} switch-theme-wrapper` : classes.root}
      data-testid={`${PREFIX}`}
    >
      <div className={classes.icon}>
        {!isNewLayout ? (
          store.theme === 'light' ? (
            <LightModeIcon />
          ) : (
            <DarkModeIcon />
          )
        ) : store.theme === 'light' ? (
          <img src={sun} alt="Sun" width="20px" height="20px" />
        ) : (
          <img src={moon} alt="Moon" width="20px" height="20px" />
        )}
      </div>
      <div className={classes.switch}>
        <div>
          <span className={classes.label}>{store.theme}</span>
          <SwitchStyled
            className={isNewLayout ? 'custom-switch' : undefined}
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
