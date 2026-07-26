import type React from 'react';
import { TradeDiscoveryCapabilityTile } from '../components/workflowCapabilities';
import type { TileProps } from '../Root/routing/common/interface';

const WorkflowDiscoveryTile: React.FC<TileProps> = (props) => (
  <TradeDiscoveryCapabilityTile {...props} />
);

export default WorkflowDiscoveryTile;
