import React, { ReactElement, useCallback } from 'react';
import { IconButton } from 'ratan-design-origin/primitives';
import useController from '../../components/NewTile/common/useController';
import Root, { classes, PREFIX } from '../../components/NewTile/common/style';
import search from '../../components/NewTile/common/images/search.svg';
import searchLight from '../../components/NewTile/common/images/searchLight.svg';
import newTileLight from '../../components/NewTile/common/images/new-tile-light.svg';
import newTileLightHover from '../../components/NewTile/common/images/new-tile-light-hover.svg';
import newTileLightSelected from '../../components/NewTile/common/images/new-tile-light-selected.svg';
import newTileDark from '../../components/NewTile/common/images/new-tile-dark.svg';
import newTileDarkHover from '../../components/NewTile/common/images/new-tile-dark-hover.svg';
import newTileDarkSelected from '../../components/NewTile/common/images/new-tile-dark-selected.svg';
import type { NewTileProps } from '../../components/NewTile/common/interface';
import { resolvePortalAppearance, useIsNewLayout } from '../appearance';
import { PortalNewTileRoot } from '../header-styles';

const NewTile: React.FC<NewTileProps> = (props: NewTileProps): ReactElement => {
  const { store } = useController();
  const theme = store.theme === 'dark' ? search : searchLight;
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const isNewLayout = useIsNewLayout();
  const isPortal = resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype';
  const TriggerRoot = isPortal ? PortalNewTileRoot : Root;
  const { toggleDrawer } = props;
  const isDrawerOpen = !!store.drawer;
  const newTileIconClassNames = ['new-tile-icon', 'new-tile-icon-hover', 'new-tile-icon-selected'];
  const newTileIconSources =
    store.theme === 'light'
      ? [newTileLight, newTileLightHover, newTileLightSelected]
      : [newTileDark, newTileDarkHover, newTileDarkSelected];

  const openDrawer = useCallback(() => {
    toggleDrawer(!isDrawerOpen)();
  }, [toggleDrawer, isDrawerOpen]);
  return (
    <TriggerRoot
      {...(isPortal ? { component: 'section' as const } : {})}
      className={isNewLayout ? `${classes.root} new-tile-icon-wrapper` : classes.root}
      data-testid={`${PREFIX}`}
      onClick={openDrawer}
    >
      {!isNewLayout ? (
        <>
          <span className={classes.box}>
            <img src={theme} alt="new tile" />
          </span>
          <span className={classes.title}>New Tile</span>
        </>
      ) : (
        <IconButton
          type="button"
          className={`${classes.box}${isDrawerOpen ? ' selected' : ''}`}
          aria-label="Open new tile"
          aria-pressed={isDrawerOpen}
          disableRipple
        >
          {newTileIconSources.map((src, i) => (
            <img
              key={newTileIconClassNames[i]}
              className={newTileIconClassNames[i]}
              src={src}
              alt="New Tile Icon"
              width={20}
              height={20}
            />
          ))}
        </IconButton>
      )}
    </TriggerRoot>
  );
};

export default React.memo(NewTile);
