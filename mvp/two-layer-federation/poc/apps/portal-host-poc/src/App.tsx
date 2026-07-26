import { PortalHost } from './PortalHost';
import { LOCAL_ENTITLEMENTS, LOCAL_TILE_REGISTRY } from './portalRegistry';

export function App() {
  return <PortalHost registry={LOCAL_TILE_REGISTRY} entitlements={[...LOCAL_ENTITLEMENTS]} />;
}
