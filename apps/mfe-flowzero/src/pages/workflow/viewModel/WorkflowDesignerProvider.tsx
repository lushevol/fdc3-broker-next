import React, { createContext, PropsWithChildren, useMemo } from "react";

import { WorkflowDesignerStore } from "./WorkflowDesignerStore";

export const WorkflowDesignerContext = createContext<{
  workflowDesignerStore: WorkflowDesignerStore | null;
}>({ workflowDesignerStore: null });

export const useWorkflowDesignerContext = () =>
  React.useContext(WorkflowDesignerContext);

const WorkflowDesignerProvider = (
  props: PropsWithChildren<{
    workflowDesignerStore: WorkflowDesignerStore;
  }>
) => {
  const contextValue = useMemo(() => {
    return { workflowDesignerStore: props.workflowDesignerStore };
  }, [props.workflowDesignerStore]);

  return (
    <WorkflowDesignerContext.Provider value={contextValue}>
      {props.children}
    </WorkflowDesignerContext.Provider>
  );
};

export default WorkflowDesignerProvider;
