import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Main from '../common/Main';
import type { ImportMapProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';

const ImportMap: React.FC<ImportMapProps> = (props: ImportMapProps): ReactElement => {
  const { store, ...rest } = useController(props);

  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`} spacing={2} direction="column">
        <Main
          titleCreateNew="Create New Import Map"
          columnVisibilityModel={{
            createdBy: false,
            createdAt: false,
          }}
          {...rest}
        />
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(ImportMap);
