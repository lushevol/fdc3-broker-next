import React, { type ReactElement, useCallback } from 'react';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScButton } from '../webkit';
import type { NewTileProps } from './common/interface';
import { PREFIX } from './common/style';
import useController from './common/useController';

const NewTile: React.FC<NewTileProps> = (props: NewTileProps): ReactElement => {
  const { store } = useController();
  const isNewLayout = useIsNewLayout();
  const isDrawerOpen = Boolean(store.drawer);
  const openDrawer = useCallback(() => {
    props.toggleDrawer(!isDrawerOpen)();
  }, [isDrawerOpen, props]);

  if (!isNewLayout) {
    return (
      <button
        type="button"
        data-testid={`${PREFIX}`}
        aria-label="Open Tile Library"
        aria-pressed={isDrawerOpen}
        onClick={openDrawer}
      >
        New Tile
      </button>
    );
  }

  return (
    <div className="base-webkit-scope" data-testid={`${PREFIX}`}>
      <ScButton
        type={isNewLayout ? 'text' : 'primary'}
        selectable="toggle"
        selected={isDrawerOpen}
        aria-label="Open Tile Library"
        aria-pressed={isDrawerOpen}
        onClick={openDrawer}
      >
        New tile
      </ScButton>
    </div>
  );
};

export default React.memo(NewTile);
