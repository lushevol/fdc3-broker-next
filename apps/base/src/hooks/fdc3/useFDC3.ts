import type { DesktopAgent } from '@finos/fdc3';
import { useEffect } from 'react';
import baseFDC3Broker from './base-broker';
import { FDC3ClientConstructor } from './fdc3-client-constructor';
import { getExternalFDC3, setExternalFDC3 } from './useExternalFDC3';
import { useFDC3WorkspaceHelper } from './useFDC3WorkspaceHelper';

const useFDC3 = () => {
  const { workspaceOpenTile } = useFDC3WorkspaceHelper();
  baseFDC3Broker.setOpenTile(workspaceOpenTile);

  useEffect(() => {
    setExternalFDC3(window.fdc3);
    window.fdc3 = new FDC3ClientConstructor(baseFDC3Broker).build();

    return () => {
      if (getExternalFDC3()) {
        window.fdc3 = getExternalFDC3() as DesktopAgent;
      }
    };
  }, []);
};

export default useFDC3;
