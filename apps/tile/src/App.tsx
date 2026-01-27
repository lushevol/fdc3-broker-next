import type React from 'react';
import Routing from './Root/routing';
import type { TileProps } from './Root/routing/common/interface';

const App: React.FC<TileProps> = (props: TileProps): React.ReactElement => <Routing {...props} />;

export default App;
