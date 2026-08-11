import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScParagraph, ScSpinner } from '../webkit';

const Splash: React.FC = (): ReactElement => {
  const isNewLayout = useIsNewLayout();

  if (!isNewLayout) {
    return <div data-testid="splash">Please wait...</div>;
  }

  return (
    <ErrorBoundry>
      <div className="base-webkit-scope splash-surface" data-testid="splash" role="status" aria-live="polite">
        <ScSpinner />
        <ScParagraph>Please wait...</ScParagraph>
      </div>
    </ErrorBoundry>
  );
};

export default React.memo(Splash);
