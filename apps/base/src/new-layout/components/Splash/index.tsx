import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../../components/ErrorBoundry';
import { ScParagraph, ScSpinner } from '../../webkit/components';

const NewLayoutSplash: React.FC = (): ReactElement => (
  <ErrorBoundry>
    <div className="base-webkit-scope splash-surface" data-testid="splash" role="status" aria-live="polite">
      <ScSpinner />
      <ScParagraph>Please wait...</ScParagraph>
    </div>
  </ErrorBoundry>
);

export default React.memo(NewLayoutSplash);
