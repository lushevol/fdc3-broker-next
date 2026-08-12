import type React from 'react';
import { FDC3Integration } from '../fdc3/FDC3Integration';
import NewLayoutRouting from './routing';
import NewLayoutTheme from './theme';
import './webkit/styles.css';

const NewLayoutExperience: React.FC<Record<string, unknown>> = (props) => (
  <NewLayoutTheme>
    <FDC3Integration>
      <NewLayoutRouting {...props} />
    </FDC3Integration>
  </NewLayoutTheme>
);

export default NewLayoutExperience;
