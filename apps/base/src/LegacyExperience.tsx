import type React from 'react';
import { FDC3Integration } from './fdc3/FDC3Integration';
import Routing from './routing';
import ThemeProvider from './theme';

const LegacyExperience: React.FC<Record<string, unknown>> = (props) => (
  <ThemeProvider>
    <FDC3Integration>
      <Routing {...props} />
    </FDC3Integration>
  </ThemeProvider>
);

export default LegacyExperience;
