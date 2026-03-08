import type React from 'react';
import { ReactRouterDom } from './Root/import';
import Routing from './Root/routing';
import { ChatbotSidebar, ChatbotProvider } from './Root/import';

const { Routes, Route, MemoryRouter } = ReactRouterDom;
const App: React.FC<any> = (props: any): React.ReactElement => {
  return (
    <MemoryRouter>
      <ChatbotProvider>
        <Routes>
          <Route path="*" element={<Routing {...props} />}></Route>
        </Routes>
        <ChatbotSidebar />
      </ChatbotProvider>
    </MemoryRouter>
  );
};

export default App;
