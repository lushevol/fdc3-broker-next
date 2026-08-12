import React, { ReactElement } from "react";
import Root, { classes, PREFIX } from "./common/style";
import { CategoryProps } from "./common/interface";
import useController from "./common/useController";
import ErrorBoundry from "../../components/ErrorBoundry";
import Main from "../common/Main";

const Category: React.FC<CategoryProps> = (
  props: CategoryProps
): ReactElement => {
  const { store, ...rest } = useController(props);
  return (
    <ErrorBoundry>
      <Root
        className={classes.root}
        data-testid={`${PREFIX}`}
        spacing={2}
        direction="column"
      >
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
