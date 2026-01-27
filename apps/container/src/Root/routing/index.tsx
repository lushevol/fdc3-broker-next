import type React from 'react';
import type { ReactElement } from 'react';
import { ReactRouterDom } from '../import';
import { APPLICATION_MENU, type ContainerProps } from './common/interface';

const { Routes, Route } = ReactRouterDom;

import TemplateTile from '../import/TemplateTile';
import useController from './common/useController';

const Routing: React.FC<ContainerProps> = (props: ContainerProps): ReactElement => {
  useController(props);
  return (
    <Routes>
      <Route
        path={APPLICATION_MENU.TEMPLATE_CONTAINER}
        element={<TemplateTile {...props} />}
      ></Route>
      <Route path="*" element={<></>}></Route>
    </Routes>
  );
};

export default Routing;
