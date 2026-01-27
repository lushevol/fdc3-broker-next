import ExampleFDC3Tile from '../components/ExampleFDC3Tile';
import type { TileProps } from '../Root/routing/common/interface';

const FDC3Tile1: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  <div>
    <h1>FDC3 Tile 1</h1>
    <ExampleFDC3Tile {...props} />
  </div>
);

export default FDC3Tile1;
