import { Grid, useMediaQuery } from "@mui/material";
import cn from "classnames";
import { getBusinessFieldsFromCache, useParentData } from "Import/ratanutils";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDisplayResolution,
  useE2Elatency,
  usePageView,
  useTimeCost,
} from "src/Root/analysis";
import {
  BLOTTER_RENDERING_LATENCY,
  BLOTTER_RENDERING_LATENCY_STAGES,
  READ_FIELDS_FROM_CACHE,
  READ_FIELDS_WITHOUT_CACHE,
} from "src/Root/analysis/const";
import { getFieldsVersion } from "src/Root/common/utils";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { CommonUtil, ReactRouterDom } from "src/Root/import";
import { useRatanDispatcher } from "src/Root/import/ratancomponents";
import { TileProps } from "src/Root/routing/common/interface";

import json from "../../../package.json";
import CashflowDataGrid from "../components/CashflowDataGrid";
import CashflowNotification from "../components/CashflowNotification";
import CustomSearchView from "../components/CustomSearchView";
import GridFooter from "../components/GridFooter";
import PresetQueryCount from "../components/PresetQueryCount";
import QuickFilters from "../components/QuickFilters";
import QuickSearch from "../components/QuickSearch";
import ToggleVisibleDivider from "../components/ToggleVisibleDivider";
import { cashflowCustomFields } from "./config/fieldsConfig";
import { setInitParams, setOpensearch } from "./store/actions";
import { RootState } from "./store/interface";
import StyledRoot, { BreakPoint, classes } from "./style";

export const AgGridFilterContext = createContext<{
  aggridTags: AggridFilterTag[];
  setAggridTags: Dispatch<SetStateAction<AggridFilterTag[]>>;
  removeAggridTag: (c: string) => void;
  clearAggridTags: () => void;
}>({
  aggridTags: [],
  setAggridTags: () => {},
  removeAggridTag: () => {},
  clearAggridTags: () => {},
});

const App: FC<TileProps> = ({ parameters }) => {
  const { isInitComplete } = useParentData();
  const [isGetFieldsDone, setIsGetFieldsDone] = useState(false);
  const showCashflowSearchBar = useSelector(
    (state: RootState) => state.showCashflowSearchBar
  );
  const dynamicClass = cn(classes.searchSection, {
    hide: !showCashflowSearchBar,
  });
  const gridEvent = useSelector((state: RootState) => state.cashflowGridEvent);
  const [aggridTags, setAggridTags] = useState<AggridFilterTag[]>([]);
  const dispatch = useDispatch<any>();
  const { dispatchVersionState, dispatchApiStatusList } = useRatanDispatcher();
  const { initTrackingPoints, addTrackingPoint } = useE2Elatency(
    BLOTTER_RENDERING_LATENCY
  );
  const { startTracking: startTrackingReadfromcache } = useTimeCost({
    subType: "event",
  });
  const isBigScreen = useMediaQuery(`(min-width:${BreakPoint.Middle}px)`);
  usePageView();
  useDisplayResolution();
  const { useLocation } = ReactRouterDom;
  const location = useLocation();

  const removeAggridTag = useCallback(
    (colId: string) => {
      gridEvent.api?.destroyFilter(colId);
      setAggridTags((val) => val.filter((subItem) => subItem.colId !== colId));
    },
    [gridEvent]
  );

  const clearAggridTags = useCallback(() => {
    gridEvent.api?.setFilterModel(null);
    setAggridTags([]);
  }, [gridEvent]);

  useEffect(() => {
    if (parameters && (parameters.cashflowId || parameters.filters)) {
      dispatch(setInitParams(parameters));
    }
  }, [parameters]);
  /**
   * option1
   * OpenSearch flag in url param
   * with ?opensearch=true will enalbe opensearch query
   * 
   * import queryString from "query-string";
   * const param = queryString.parse(window.location.search, {
   *  parseBooleans: true，
   * });
   * if (param.opensearch === true) {
   *   dispatch(setOpensearch(true));
   * }

   * option2
   * use react router dom to get route path
   */
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/cashflow_open_search")) {
      dispatch(setOpensearch(true));
    }
  }, []);

  useEffect(() => {
    initTrackingPoints(true);
    addTrackingPoint(BLOTTER_RENDERING_LATENCY_STAGES.RENDER_PAGE_FRAME);
  }, []);

  useEffect(() => {
    dispatchVersionState({ version: json.version, env: CommonUtil.getEnv() });
    dispatchApiStatusList(["TDS3_Trade_Query", "DQSL_Counterparty_Query_V2"]);
    if (isInitComplete) {
      const {
        fields: fieldsVersionBefore,
        fieldsConfig: fieldsConfigVersionBefore,
      } = getFieldsVersion() ?? {};
      const { completeTracking, abortTracking } = startTrackingReadfromcache();
      getBusinessFieldsFromCache("cashflowCN", cashflowCustomFields)
        .then(() => {
          setIsGetFieldsDone(true);
          const {
            fields: fieldsVersionAfter,
            fieldsConfig: fieldsConfigVersionAfter,
          } = getFieldsVersion() ?? {};
          completeTracking({
            name:
              fieldsVersionBefore === fieldsVersionAfter &&
              fieldsConfigVersionBefore === fieldsConfigVersionAfter
                ? READ_FIELDS_FROM_CACHE
                : READ_FIELDS_WITHOUT_CACHE,
          });
        })
        .catch(() => {
          abortTracking();
          setIsGetFieldsDone(true);
        });
    }
  }, [isInitComplete]);

  const setAgGridValue = useMemo(
    () => ({
      aggridTags,
      setAggridTags,
      removeAggridTag,
      clearAggridTags,
    }),
    [aggridTags, setAggridTags, removeAggridTag, clearAggridTags]
  );

  return isInitComplete && isGetFieldsDone ? (
    <StyledRoot
      className={`${classes.ratanCashflow} kp--ratan_cashflow_blotter`}
    >
      <AgGridFilterContext.Provider value={setAgGridValue}>
        {/* <Version version={json.version} /> */}
        <div className={dynamicClass}>
          <div className={classes.searchSectionBody}>
            <Grid container spacing={0} wrap="wrap">
              <Grid
                item
                xs={9}
                className={classes.box}
                sx={{
                  minWidth: isBigScreen ? "950px" : "100%",
                  paddingBottom: "4px !important",
                }}
              >
                <div className={`${classes.border} kp--quick_search`}>
                  <div className={classes.label}>Quick Search</div>
                  <QuickSearch />
                </div>
              </Grid>
              <Grid
                item
                xs={3}
                className={classes.box}
                sx={{
                  minWidth: isBigScreen ? "400px" : "500px",
                  paddingBottom: "4px !important",
                }}
              >
                <PresetQueryCount />
                <div className={classes.border}>
                  <div className={classes.label}>Custom Search/View</div>
                  <CustomSearchView />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        <ToggleVisibleDivider />
        {featureScopedEnabled("Enable_Search_Bar") && <QuickFilters />}
        <GridFooter />
        <CashflowDataGrid />
        <CashflowNotification />
      </AgGridFilterContext.Provider>
    </StyledRoot>
  ) : null;
};

export default App;
