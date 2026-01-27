import type React from 'react';
import { ReactRouterDom } from './Root/import';
import Routing from './Root/routing';

const { Routes, Route, MemoryRouter } = ReactRouterDom;
const App: React.FC<any> = (props: any): React.ReactElement => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="*" element={<Routing {...props} />}></Route>
      </Routes>
    </MemoryRouter>
  );
};

export default App;
