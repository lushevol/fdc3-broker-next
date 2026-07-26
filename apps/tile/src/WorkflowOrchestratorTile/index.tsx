import type React from 'react';
import { WorkflowOrchestratorTile as WorkflowOrchestratorView } from '../components/WorkflowOrchestratorTile';
import type { TileProps } from '../Root/routing/common/interface';

const WorkflowOrchestratorTile: React.FC<TileProps> = (props) => (
  <WorkflowOrchestratorView {...props} />
);

export default WorkflowOrchestratorTile;
