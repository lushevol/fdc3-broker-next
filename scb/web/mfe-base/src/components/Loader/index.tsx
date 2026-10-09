import React from 'react';
import { Loader as DesignLoader, type LoaderProps } from 'ratan-design-origin';
import { PREFIX } from './common/style';

const Loader = (props: LoaderProps) => <DesignLoader data-testid={PREFIX} {...props} />;
export default React.memo(Loader);
