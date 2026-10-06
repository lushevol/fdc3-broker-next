import React, { ReactElement } from 'react';
import dark from '../../components/Switch/common/images/dark.svg';
import moon from '../../components/Switch/common/images/moon.svg';
import sun from '../../components/Switch/common/images/sun.svg';
import { LightMode as LightModeIcon } from 'ratan-design-origin/icons';
import useController from '../../components/Switch/common/useController';
import Root, { classes, PREFIX, SwitchStyled } from '../../components/Switch/common/style';
import { resolvePortalAppearance, useIsNewLayout } from '../appearance';
import { PortalHeaderSwitch, PortalThemeSwitchRoot } from '../header-styles';

const Switch: React.FC = (): ReactElement => {
  const isNewLayout = useIsNewLayout();
  const { store, toggleColorMode } = useController();
  const isPortal = resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype';
  const SwitchRoot = isPortal ? PortalThemeSwitchRoot : Root;
  const SwitchControl = isPortal ? PortalHeaderSwitch : SwitchStyled;
  return (
    <SwitchRoot
      {...(isPortal ? { component: 'section' as const } : {})}
      className={isNewLayout ? `${classes.root} switch-theme-wrapper` : classes.root}
      data-testid={`${PREFIX}`}
    >
      <div className={classes.icon}>
        {!isNewLayout ? (
          store.theme === 'light' ? (
            <LightModeIcon />
          ) : (
            <img src={dark} alt="dark" width="14px" height="14px" />
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
          <SwitchControl
            className="custom-switch"
            checked={store.theme === 'light'}
            onChange={toggleColorMode}
            data-testid={`${PREFIX}_SwitchStyled`}
            inputProps={{ 'aria-label': 'Theme Switch' }}
          />
        </div>
      </div>
    </SwitchRoot>
  );
};

export default React.memo(Switch);
