import type { GridReadyEvent } from "ag-grid-community";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  advancedSearchAction,
  queryCashflowList,
  setCashflowGridEvent,
} from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { useE2Elatency, useRTT } from "src/Root/analysis";
import {
  BLOTTER_RENDERING_LATENCY,
  BLOTTER_RENDERING_LATENCY_STAGES,
  RTT_QUERY_BLOTTER_DATA,
} from "src/Root/analysis/const";
import { legacyFilters2Query } from "src/Root/common/utils/query";
import {
  dehydrate,
  generateTemplateFilterRecord,
} from "src/Root/import/ratancomponents";
import { getOperator } from "src/Root/import/ratanutils";

import { filterFieldType } from "../../AdvancedSearch";

export const useGridReadyEvent = () => {
  const dispatch = useDispatch<any>();
  const initParams = useSelector((state: RootState) => state.initParams);
  const { addTrackingPoint, completeTracking, abortTracking } = useE2Elatency(
    BLOTTER_RENDERING_LATENCY
  );
  const { startTracking } = useRTT();

  const initialSearch = useCallback(() => {
    const {
      completeTracking: completeTrackingRTT,
      abortTracking: abortTrackingRTT,
    } = startTracking();
    if (initParams?.cashflowId) {
      const id = initParams.cashflowId;
      const queryConditions = [
        {
          field: "Cashflow.Cashflow_Id",
          operator: getOperator(id),
          values: id,
        },
      ];
      dispatch(
        queryCashflowList({
          filters: legacyFilters2Query(queryConditions),
          searchName: "searchSection",
          callback(f) {
            if (f) {
              addTrackingPoint(
                BLOTTER_RENDERING_LATENCY_STAGES.RENDER_BLOTTER_DATA
              );
              completeTracking();
              completeTrackingRTT({
                name: RTT_QUERY_BLOTTER_DATA,
              });
            } else {
              abortTracking();
              abortTrackingRTT();
            }
          },
        })
      );
    } else if (initParams?.filters) {
      const tempFilter = generateTemplateFilterRecord();
      const res = dispatch(
        advancedSearchAction({
          appliedFilter: {
            ...tempFilter,
            type: filterFieldType,
            body: dehydrate(legacyFilters2Query(initParams.filters)),
          },
        })
      );
      (res as Promise<RootState["advancedSearch"]>)
        .then(() => {
          addTrackingPoint(
            BLOTTER_RENDERING_LATENCY_STAGES.RENDER_BLOTTER_DATA
          );
          completeTracking();
          completeTrackingRTT({
            name: RTT_QUERY_BLOTTER_DATA,
          });
        })
        .catch(() => {
          abortTracking();
          abortTrackingRTT();
        });
    } else {
      dispatch(
        queryCashflowList({
          callback(f) {
            if (f) {
              addTrackingPoint(
                BLOTTER_RENDERING_LATENCY_STAGES.RENDER_BLOTTER_DATA
              );
              completeTracking();
              completeTrackingRTT({
                name: RTT_QUERY_BLOTTER_DATA,
              });
            } else {
              abortTracking();
              abortTrackingRTT();
            }
          },
        })
      );
    }
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    dispatch(setCashflowGridEvent(params));
    setTimeout(() => {
      initialSearch();
    }, 0);
    addTrackingPoint(BLOTTER_RENDERING_LATENCY_STAGES.RENDER_BLOTTER_FRAME);
  }, []);

  return {
    onGridReady,
    initialSearch,
  };
};
