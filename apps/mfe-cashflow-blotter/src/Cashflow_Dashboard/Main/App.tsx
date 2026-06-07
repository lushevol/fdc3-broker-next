import { useParentData } from "Import/ratanutils";
import { FC, useEffect } from "react";
import { usePageView } from "src/Root/analysis";
import { CommonUtil } from "src/Root/import";
import { useRatanDispatcher } from "src/Root/import/ratancomponents";
import { TileProps } from "src/Root/routing/common/interface";

import json from "../../../package.json";
import { Dashboard } from "../components/Dashboard";
import StyledRoot, { classes } from "./style";

const App: FC<TileProps> = () => {
  const { isInitComplete } = useParentData();
  const { dispatchVersionState, dispatchApiStatusList } = useRatanDispatcher();
  usePageView();
  useEffect(() => {
    dispatchVersionState({ version: json.version, env: CommonUtil.getEnv() });
    dispatchApiStatusList([]);
  }, []);
  return isInitComplete ? (
    <StyledRoot className={classes.root}>
      <Dashboard />
    </StyledRoot>
  ) : null;
};

export default App;
