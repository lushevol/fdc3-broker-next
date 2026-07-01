// @ts-nocheck
import React, { ReactElement, Suspense } from "react";

import { ReactRouterDom, Splash } from "../import";
import { TileProps } from "./common/interface";
const { Routes, Route } = ReactRouterDom;
import { useNotificationCenter } from "../NotificationCenter";
import { useVersionGuard } from "../VersionGuard";
import useController from "./common/useController";

const NewRequest = React.lazy(
  () => import("../../pages/NewRequest/NewRequest")
);
const WorkflowManagement = React.lazy(
  () => import("../../pages/WorkflowManagement/index")
);
const TaskCenter = React.lazy(() => import("../../pages/RequestCenter/index"));
const TaskCenterDetail = React.lazy(
  () => import("../../pages/RequestCenter/TaskDetailPage")
);
const FieldsManagement = React.lazy(
  () => import("../../pages/FieldsManagement/index")
);
const NewToDo = React.lazy(() => import("../../pages/NewToDo/index"));
const NewToDoDetail = React.lazy(
  () => import("../../pages/NewToDo/ToDoDetail")
);
const NewWorkflow = React.lazy(
  () => import("../../pages/workflow/view/wrapper/WorkflowCanvasContainer")
);
const FormManagement = React.lazy(
  () => import("../../pages/FormManagement/index")
);
const FormDesigner = React.lazy(() => import("../../pages/FormDesigner/index"));
const HomePage = React.lazy(() => import("../../pages/HomePage/index"));
const Routing: React.FC<TileProps> = (props: TileProps): ReactElement => {
  useController(props);
  useNotificationCenter();
  useVersionGuard();
  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        <Route
          path="/flowzero/new-request"
          element={<NewRequest {...props} />}
        />
        <Route path="/flowzero/workflow-management">
          <Route index element={<WorkflowManagement {...props} />} />
          <Route path="NewWorkflow" element={<NewWorkflow {...props} />} />
        </Route>
        <Route
          path="/flowzero/task-center"
          element={<TaskCenter {...props} />}
        />
        <Route
          path="/flowzero/task-detail"
          element={<TaskCenterDetail {...props} />}
        />
        <Route path="/flowzero/assign-to-me">
          <Route index element={<NewToDo {...props} />} />
          <Route path="detail" element={<NewToDoDetail {...props} />} />
        </Route>
        <Route
          path="/flowzero/fields-management"
          element={<FieldsManagement {...props} />}
        />
        <Route path="/flowzero/form-management">
          <Route index element={<FormManagement {...props} />} />
          <Route path="form-designer" element={<FormDesigner {...props} />} />
        </Route>
        <Route path="/flowzero/home" element={<HomePage {...props} />} />
        <Route path="*" element={<></>} />
      </Routes>
    </Suspense>
  );
};

export default Routing;
