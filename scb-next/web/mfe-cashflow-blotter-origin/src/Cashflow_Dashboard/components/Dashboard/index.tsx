import { Grid, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { useDashboardDataQuery } from "src/Cashflow_Dashboard/Main/hooks/useDashboardDataQuery";
import { useAppSelector } from "src/Cashflow_Dashboard/Main/store-redux";
import { BreakPoint } from "src/Root/common/utils";

import { DashboardContext } from "../../Main/hooks/context";
import CustomSearchView from "../CustomSearchView";
import QuickSearch from "../QuickSearch";
import { StatusIndicator } from "../StatusIndicator";
import { DASHBOARD_REFRESH_INTERVAL } from "./const";
import RefreshAlert from "./RefreshAlert";

export const Dashboard = () => {
  const { triggerQuery } = useDashboardDataQuery();
  const dashboardData = useAppSelector((state) => state.dashboardData);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const isBigScreen = useMediaQuery(`(min-width:${BreakPoint.Middle}px)`);

  const loopQuery = useCallback(async () => {
    await triggerQuery();
    if (refreshTimer.current === null) return;
    refreshTimer.current = setTimeout(
      () => loopQuery(),
      DASHBOARD_REFRESH_INTERVAL
    );
  }, [triggerQuery]);

  useEffect(() => {
    refreshTimer.current = setTimeout(() => loopQuery(), 0);

    return () => {
      clearTimeout(refreshTimer.current ?? 0);
      refreshTimer.current = null;
    };
  }, [loopQuery]);
  return (
    <DashboardContext.Provider value={dashboardData}>
      <Grid container spacing={2} sx={{ p: 1 }} wrap="wrap">
        <Grid item xs={9} sx={{ minWidth: isBigScreen ? "950px" : "100%" }}>
          <QuickSearch />
        </Grid>

        <Grid item xs={3} sx={{ minWidth: isBigScreen ? "400px" : "500px" }}>
          <CustomSearchView />
        </Grid>
        <Grid container item xs={12}>
          <Grid item>
            <RefreshAlert />
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item>
            <StatusIndicator />
          </Grid>
        </Grid>
      </Grid>
    </DashboardContext.Provider>
  );
};
