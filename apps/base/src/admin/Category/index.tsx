import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Main from '../common/Main';
import type { CategoryProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';

const Category: React.FC<CategoryProps> = (props: CategoryProps): ReactElement => {
  const { store, ...rest } = useController(props);
  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`} spacing={2} direction="column">
        <Main
          titleCreateNew="Create New Category"
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

export default React.memo(Category);
