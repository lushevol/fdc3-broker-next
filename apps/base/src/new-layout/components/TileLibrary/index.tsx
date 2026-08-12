import React, { useEffect, useRef } from 'react';
import ErrorBoundry from '../../../components/ErrorBoundry';
import { configureScModal, ScModal } from '../../webkit/components';
import Catalog from './Catalog';
import type { TileLibraryProps } from './types';

const NewLayoutTileLibrary = (props: TileLibraryProps) => {
  const modalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    configureScModal(modalRef.current, { open: props.anchor, width: '64rem' });
  }, [props.anchor]);
  return (
    <ErrorBoundry>
      <div className="base-webkit-scope">
        <ScModal
          ref={modalRef}
          open={props.anchor}
          size="lg"
          no-header
          no-padding
          aria-label="Tile Library"
          onScHide={() => props.toggleDrawer(false)()}
        >
          <Catalog {...props} />
        </ScModal>
      </div>
    </ErrorBoundry>
  );
};

export default React.memo(NewLayoutTileLibrary);
