import React, { createContext, PropsWithChildren, useMemo } from "react";
import BPMNStore from "src/stores/BPMNStore";

export const BPMNContext = createContext<{
  bpmnStore: BPMNStore | null;
}>({ bpmnStore: null });

export const useBPMNContext = () => React.useContext(BPMNContext);

const BPMNProvider = (
  props: PropsWithChildren<{
    bpmnStore: BPMNStore;
  }>
) => {
  const contextValue = useMemo(() => {
    return { bpmnStore: props.bpmnStore };
  }, [props.bpmnStore]);

  return (
    <BPMNContext.Provider value={contextValue}>
      {props.children}
    </BPMNContext.Provider>
  );
};

export default BPMNProvider;
