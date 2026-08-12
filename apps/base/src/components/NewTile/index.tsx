import SearchIcon from '@mui/icons-material/Search';
import React, { type ReactElement, useCallback } from 'react';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScButton } from '../webkit';
import type { NewTileProps } from './common/interface';
import newTileDarkSelected from './common/images/new-tile-dark-selected.svg';
import newTileDark from './common/images/new-tile-dark.svg';
import newTileLightSelected from './common/images/new-tile-light-selected.svg';
import newTileLight from './common/images/new-tile-light.svg';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';

const NewTile: React.FC<NewTileProps> = (props: NewTileProps): ReactElement => {
  const { store } = useController();
  const isNewLayout = useIsNewLayout();
  const isDrawerOpen = Boolean(store.drawer);
  const tileIcon = store.theme === 'light'
    ? (isDrawerOpen ? newTileLightSelected : newTileLight)
    : (isDrawerOpen ? newTileDarkSelected : newTileDark);
  const openDrawer = useCallback(() => {
    props.toggleDrawer(!isDrawerOpen)();
  }, [isDrawerOpen, props]);

  if (!isNewLayout) {
    return (
      <Root
        className={classes.root}
        data-testid={`${PREFIX}`}
        onClick={props.toggleDrawer(true)}
      >
        <span className={classes.box}>
          <SearchIcon />
        </span>
        <span className={classes.title}>New Tile</span>
      </Root>
    );
  }

  return (
    <div className="base-webkit-scope new-tile-launcher" data-testid={`${PREFIX}`}>
      <ScButton
        type="text"
        selectable="toggle"
        selected={isDrawerOpen}
        role="button"
        aria-label="Open Tile Library"
        aria-pressed={isDrawerOpen}
        onClick={openDrawer}
      >
        <img className="new-tile-icon" src={tileIcon} alt="" aria-hidden="true" />
      </ScButton>
    </div>
  );
};

export default React.memo(NewTile);
