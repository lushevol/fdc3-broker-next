import type React from 'react';
import LegacyExperience from '../LegacyExperience';
import NewLayoutExperience from './NewLayoutExperience';

export const isNewLayoutEnabled = (search = window.location.search): boolean =>
  new URLSearchParams(search).get('new-layout') === 'true';

export const PortalExperience: React.FC<Record<string, unknown>> = (props) =>
  isNewLayoutEnabled() ? <NewLayoutExperience {...props} /> : <LegacyExperience {...props} />;
