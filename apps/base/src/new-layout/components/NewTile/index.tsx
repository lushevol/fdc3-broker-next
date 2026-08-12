import React, { type ReactElement, useCallback } from 'react';
import type { NewTileProps } from '../../../components/NewTile/common/interface';
import { PREFIX } from '../../../components/NewTile/common/style';
import useController from '../../../components/NewTile/common/useController';
import darkSelected from '../../assets/new-tile/new-tile-dark-selected.svg';
import dark from '../../assets/new-tile/new-tile-dark.svg';
import lightSelected from '../../assets/new-tile/new-tile-light-selected.svg';
import light from '../../assets/new-tile/new-tile-light.svg';
import { ScButton } from '../../webkit/components';

const NewLayoutNewTile: React.FC<NewTileProps> = (props): ReactElement => {
  const { store } = useController();
  const isDrawerOpen = Boolean(store.drawer);
  const tileIcon = store.theme === 'light'
    ? (isDrawerOpen ? lightSelected : light)
    : (isDrawerOpen ? darkSelected : dark);
  const openDrawer = useCallback(() => {
    props.toggleDrawer(!isDrawerOpen)();
  }, [isDrawerOpen, props]);

  return (
    <div className="base-webkit-scope new-tile-launcher" data-testid={PREFIX}>
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

export default React.memo(NewLayoutNewTile);
