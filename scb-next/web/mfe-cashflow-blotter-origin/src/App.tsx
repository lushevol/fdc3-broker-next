import { App as AntdApp } from 'antd';
import React from 'react';

import MfeThemeProvider from './Root/common/component/MfeThemeProvider';
import { ContainerProvider } from './Root/import';
import Routing from './Root/routing';
import { TileProps } from './Root/routing/common/interface';
import { resolveRatanAppearance } from 'ratan-design-origin';

const App: React.FC<TileProps> = (props: TileProps): React.ReactElement => {
  const appearance = resolveRatanAppearance(props.appearance);
  return (
    <ContainerProvider.default appearance={appearance}>
      <MfeThemeProvider appearance={appearance}>
        <AntdApp style={{ height: '100%' }}>
          <Routing {...props} appearance={appearance} />
        </AntdApp>
      </MfeThemeProvider>
    </ContainerProvider.default>
  );
};

export default App;
