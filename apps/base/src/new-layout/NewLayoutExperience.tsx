import type React from 'react';
import { FDC3Integration } from '../fdc3/FDC3Integration';
import Routing from '../routing';
import NewLayoutTheme from './theme';
import '../components/webkit.css';

const NewLayoutExperience: React.FC<Record<string, unknown>> = (props) => (
  <NewLayoutTheme>
    <FDC3Integration>
      <Routing {...props} />
    </FDC3Integration>
  </NewLayoutTheme>
);

export default NewLayoutExperience;
