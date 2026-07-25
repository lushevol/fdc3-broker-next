import type React from 'react';
import { RiskCapabilityTile } from '../components/workflowCapabilities';
import type { TileProps } from '../Root/routing/common/interface';

const WorkflowRiskTile: React.FC<TileProps> = (props) => <RiskCapabilityTile {...props} />;

export default WorkflowRiskTile;
