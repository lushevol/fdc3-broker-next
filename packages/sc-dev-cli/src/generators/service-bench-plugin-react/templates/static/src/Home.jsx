import React, { useContext } from 'react';

import { 
  UserContext
} from '@scdevkit/service-bench-core/react/context.js';
import { HomeContent } from './components/HomeContent';

const Home = () => {
  const user = useContext(UserContext);
  return (
    <sc-landing-layout>
      <div slot="banner-title" data-testid="banner-title">
        Welcome to Service Bench, {user?.firstName} {user?.lastName}! 
      </div>
      <div slot="banner-body">
        If you see this message, your plugin project is successfully set up.
      </div>
      <div slot="content">
          <HomeContent />
      </div>
    </sc-landing-layout>
  )
}

export { Home };