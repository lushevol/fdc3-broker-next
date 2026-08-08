import { startTransition, useContext, useEffect } from "react";
import { collectData, generateUUID, useLocation } from "./base";
import { CollectedTagValueData, TraceSubTypes, TraceTypes } from "./type";
import { E2ELatencyStoreContext } from "./context";
import { Num } from "../Amounty";

enum TrackingStatus {
  Pending,
  Completed,
}

// use performance measure to track duration points.
export const trackPerformance = (): [string, () => { duration: number }] => {
  const id = generateUUID() as string;
  const startMarkName = `start-${id}`;
  performance.mark(startMarkName);
  return [
    id,
    () => {
      const res = performance.measure(id, startMarkName);
      const intDuration = Math.round(res.duration);
      performance.clearMeasures(id);
      performance.clearMarks(startMarkName);
      return {
        duration: intDuration,
      };
    },
  ];
};

export const useTimeCost = (
  props: { name?: string; subType?: TraceSubTypes } = {}
) => {
  const { pathname } = useLocation();
  const startTracking = (props1: { name?: string } = {}) => {
    let status = TrackingStatus.Pending;
    const [id, done] = trackPerformance();
    const completeTracking = (props2: { name?: string } = {}) => {
      if (status === TrackingStatus.Completed) return;
      const { duration } = done();
      try {
        collectData({
          traceId: id,
          type: TraceTypes.PERF,
          datas: [duration],
          itemPath: pathname,
          ...props,
          ...props1,
          ...props2,
        });
      } catch (error) {
        console.error(error);
      }
      status = TrackingStatus.Completed;
    };
    const abortTracking = () => {
      done();
      status = TrackingStatus.Completed;
    };
    return {
      completeTracking,
      abortTracking,
    };
  };

  return {
    startTracking,
  };
};

export const useRTT = () => {
  return useTimeCost({ subType: TraceSubTypes.RTT });
};

export const useDisplayResolution = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      const {
        width,
        height,
        availWidth,
        availHeight,
        // @ts-ignore
        isExtended,
        orientation,
      } = window.screen;
      const { innerWidth, innerHeight } = window;
      collectData({
        name: "Display Resolution",
        type: TraceTypes.CUSTOMER,
        datas: [
          {
            tag: `width x height`,
            value: `${width} x ${height}`,
          },
          {
            tag: `innerWidth x innerHeight`,
            value: `${innerWidth} x ${innerHeight}`,
          },
          {
            tag: `availWidth x availHeight`,
            value: `${availWidth} x ${availHeight}`,
          },
          {
            tag: "Extension",
            value: isExtended ? "Extended Screen" : "Original Screen",
          },
          {
            tag: `orientation`,
            value: orientation.type,
          },
        ],
        itemPath: pathname,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
};

export const useIterableCollect = () => {
  const { pathname } = useLocation();
  const startTracking = (name: string) => {
    let status = TrackingStatus.Pending;
    const path: string[] = [];
    const abort = () => {
      path.splice(0);
      status = TrackingStatus.Completed;
    };
    const complete = () => {
      try {
        if (status === TrackingStatus.Completed) {
          console.error("Tracking is already completed.");
          return;
        }
        collectData({
          name,
          type: TraceTypes.ACTION,
          datas: path,
          itemPath: pathname,
        });
      } catch (error) {
        console.error(error);
      } finally {
        status = TrackingStatus.Completed;
      }
    };
    const next = (nextPoint: string) => {
      path.push(nextPoint);
      return {
        next,
        complete,
        abort,
      };
    };
    return next;
  };

  return {
    startTracking,
  };
};

export const useBatchCollect = () => {
  const { pathname } = useLocation();
  const startTracking = (name: string) => {
    return (path: string[]) => {
      try {
        collectData({
          name,
          type: TraceTypes.ACTION,
          datas: path,
          itemPath: pathname,
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  return {
    startTracking,
  };
};

export const useBatchCollectWithCount = () => {
  const { pathname } = useLocation();
  const startTracking = (name: string) => {
    return (path: string[]) => {
      try {
        const actionWithCount = path.reduce((res, cur) => {
          if (res[cur]) {
            res[cur] = res[cur] + 1;
          } else {
            res[cur] = 1;
          }
          return res;
        }, {} as { [k: string]: number });
        const datas = Object.keys(actionWithCount).reduce((res, cur) => {
          res.push({
            tag: cur,
            value: actionWithCount[cur],
          });
          return res;
        }, [] as CollectedTagValueData[]);
        collectData({
          name,
          type: TraceTypes.ACTION,
          subType: TraceSubTypes.Count,
          datas,
          itemPath: pathname,
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  return {
    startTracking,
  };
};

export const useE2Elatency = (name: string) => {
  const { initPoints, setPoints } = useContext(E2ELatencyStoreContext);
  const { pathname } = useLocation();
  const addTrackingPoint = (tag: string) => {
    const ts = Num.round(performance.now(), 1);
    setPoints((ps) => {
      ps.set(name, [...(ps.get(name) ?? []), { tag, value: ts }]);
      return ps;
    });
  };
  const completeTracking = () => {
    try {
      setPoints((ps) => {
        startTransition(() => {
          const os = ps.get(name);
          // at least 2 tracking points.
          if (os && os.length > 1) {
            try {
              const timecosts = os.reduce((res, cur, curIndex) => {
                if (curIndex > 0) {
                  res.push({
                    tag: cur.tag,
                    value: Num.round(cur.value - os[curIndex - 1].value, 1),
                  });
                }
                return res;
              }, [] as { tag: string; value: number }[]);
              collectData({
                name,
                type: TraceTypes.PERF,
                subType: TraceSubTypes.E2E_Latency,
                datas: timecosts,
                itemPath: pathname,
              });
            } catch (error) {}
          }
          ps.delete(name);
        });
        return ps;
      });
    } catch (error) {
      console.error(error);
    }
  };
  const abortTracking = () => {
    setPoints((ps) => {
      ps.delete(name);
      return ps;
    });
  };
  return {
    initTrackingPoints: (flag?: boolean) => initPoints(name, flag),
    addTrackingPoint,
    completeTracking,
    abortTracking,
  };
};

export const usePageView = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    collectData({
      itemPath: pathname,
      name: "Page View",
      type: TraceTypes.PAGE_VIEW,
      subType: TraceSubTypes.Start,
    });
    return () => {
      collectData({
        name: "Page View End",
        type: TraceTypes.PAGE_VIEW,
        subType: TraceSubTypes.End,
        itemPath: pathname,
      });
    };
  }, []);
};
