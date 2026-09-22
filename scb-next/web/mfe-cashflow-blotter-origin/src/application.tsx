import React from 'react';

import type { TileProps } from './Root/routing/common/interface';

export async function loadCashflowApplication() {
  await import('./cashflow-ratan/ratanstatic');
  return import('./App');
}

const App = React.lazy(loadCashflowApplication);

const CashflowApplication: React.FC<TileProps> = (props) => <App {...props} />;

export default CashflowApplication;
