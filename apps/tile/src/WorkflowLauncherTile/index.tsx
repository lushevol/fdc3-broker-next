import { WorkflowLauncherTile } from '../components/WorkflowLauncherTile';
import type { TileProps } from '../Root/routing/common/interface';

const FDC3WorkflowLauncherTile: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  <WorkflowLauncherTile {...props} />
);

export default FDC3WorkflowLauncherTile;
