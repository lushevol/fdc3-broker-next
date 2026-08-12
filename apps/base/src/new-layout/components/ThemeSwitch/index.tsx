import React, { type ReactElement } from 'react';
import useController from '../../../components/Switch/common/useController';
import { PREFIX } from '../../../components/Switch/common/style';
import moon from '../../assets/theme/moon.svg';
import sun from '../../assets/theme/sun.svg';
import { classes, Root, SwitchStyled } from './style';

const NewLayoutThemeSwitch: React.FC = (): ReactElement => {
  const { store, toggleColorMode } = useController();
  return (
    <Root data-testid={PREFIX}>
      <div className={classes.icon}>
        <img src={store.theme === 'light' ? sun : moon} alt={store.theme === 'light' ? 'Sun' : 'Moon'} width="20" height="20" />
      </div>
      <div className={classes.switch}>
        <span className={classes.label}>{store.theme}</span>
        <SwitchStyled
          checked={store.theme === 'light'}
          onChange={toggleColorMode}
          data-testid={`${PREFIX}_SwitchStyled`}
          inputProps={{ 'aria-label': 'Theme Switch' }}
        />
      </div>
    </Root>
  );
};

export default React.memo(NewLayoutThemeSwitch);
