import React from 'react';
import MfeThemeProvider from './Root/component/MfeThemeProvider';
import Routing from './Root/routing';
import { ContainerProps } from './Root/routing/common/interface';
import { ContainerProvider, ReactRouterDom } from './Root/import';
import { resolveRatanAppearance } from 'ratan-design-origin';
const { Routes, Route, MemoryRouter } = ReactRouterDom;
const App: React.FC<ContainerProps> = (props: ContainerProps): React.ReactElement => {
  const appearance = resolveRatanAppearance(props.appearance);
  return (
    <ContainerProvider.default appearance={appearance}>
      <MfeThemeProvider appearance={appearance}>
        <MemoryRouter>
          <Routes>
            <Route path="*" element={<Routing {...props} appearance={appearance} />}></Route>
          </Routes>
        </MemoryRouter>
      </MfeThemeProvider>
    </ContainerProvider.default>
  );
};

export default App;
