import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { USELESS_INIT_POINT } from "./const";

export const E2ELatencyStoreContext = createContext<{
  points: Map<string, { tag: string; value: number }[]>;
  initPoints: (name: string, defaultPoint?: boolean) => void;
  setPoints: Dispatch<
    SetStateAction<Map<string, { tag: string; value: number }[]>>
  >;
}>({
  points: new Map(),
  initPoints: () => undefined,
  setPoints: () => undefined,
});

export const E2ELatencyStoreWrap = ({ children }: PropsWithChildren) => {
  const zeroPoint = useRef(performance.now());
  const [renderPoints, setRenderPoints] = useState<
    Map<string, { tag: string; value: number }[]>
  >(new Map());

  const renderAnalysisValue = useMemo(() => {
    return {
      points: renderPoints,
      initPoints: (name: string, defaultPoint?: boolean) =>
        setRenderPoints((ps) =>
          ps.set(
            name,
            defaultPoint
              ? [{ tag: USELESS_INIT_POINT, value: zeroPoint.current }]
              : []
          )
        ),
      setPoints: setRenderPoints,
    };
  }, []);

  return (
    <E2ELatencyStoreContext.Provider value={renderAnalysisValue}>
      {children}
    </E2ELatencyStoreContext.Provider>
  );
};
