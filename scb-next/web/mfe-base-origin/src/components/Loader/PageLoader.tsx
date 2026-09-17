import React from 'react';
import { PageLoader as DesignPageLoader, type LoaderProps } from 'ratan-design-origin';
import { PREFIX } from './common/style';

const PageLoader = (props: LoaderProps) => (
  <DesignPageLoader
    data-testid={`${PREFIX}_Page`}
    {...props}
    slotProps={{ loader: { 'data-testid': PREFIX } }}
  />
);
export default React.memo(PageLoader);
