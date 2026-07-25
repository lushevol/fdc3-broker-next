import type React from 'react';
import { PricingCapabilityTile } from '../components/workflowCapabilities';
import type { TileProps } from '../Root/routing/common/interface';

const WorkflowPricingTile: React.FC<TileProps> = (props) => <PricingCapabilityTile {...props} />;

export default WorkflowPricingTile;
