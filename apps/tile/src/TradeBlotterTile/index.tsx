import { TradeBlotterFDC3Tile } from '../components/TradeBlotterFDC3Tile';
import type { TileProps } from '../Root/routing/common/interface';

const TradeBlotterTile: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  <TradeBlotterFDC3Tile {...props} />
);

export default TradeBlotterTile;
