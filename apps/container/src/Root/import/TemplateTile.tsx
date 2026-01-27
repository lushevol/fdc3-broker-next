import React, { type ReactElement, Suspense } from 'react';

const Mfe = React.lazy(() =>
  // @ts-expect-error from systemjs
  System.import('@fm/template').then((a) => a),
);

const TemplateTile: React.FC<any> = (props: any): ReactElement => {
  return <Mfe {...props} />;
};

export default React.memo(TemplateTile);
