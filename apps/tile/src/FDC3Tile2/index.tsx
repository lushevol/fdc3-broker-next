import ExampleFDC3Tile from '../components/ExampleFDC3Tile';
import type { TileProps } from '../Root/routing/common/interface';

const FDC3Tile2: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  <div>
    <h1>FDC3 Tile 2</h1>
    <ExampleFDC3Tile {...props} />
  </div>
);

export default FDC3Tile2;
