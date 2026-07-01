import { useParentData } from "Import/ratanutils";
import { createContext, Dispatch, FC, SetStateAction, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePageView } from "src/Root/analysis";
import { CommonUtil } from "src/Root/import";
import { useRatanDispatcher } from "src/Root/import/ratancomponents";
import { TileProps } from "src/Root/routing/common/interface";

import json from "../../../package.json";
import CashflowDataGrid from "../components/CashflowDataGrid";
import GridFooter from "../components/GridFooter";
import QuickSearch from "../components/QuickSearch";
import { convertFilter2GroupSearchCriteria } from "./common/utils";
import { setQuickSearchCriteria } from "./store/slice";
import StyledRoot, { classes } from "./style";

export const AgGridFilterContext = createContext<{
  aggridTags: AggridFilterTag[];
  setAggridTags: Dispatch<SetStateAction<AggridFilterTag[]>>;
  removeAggridTag: (c: string) => void;
}>({
  aggridTags: [],
  setAggridTags: () => {},
  removeAggridTag: () => {},
});

const App: FC<TileProps> = ({ parameters }) => {
  const { isInitComplete } = useParentData();
  const { dispatchVersionState, dispatchApiStatusList } = useRatanDispatcher();
  const dispatch = useDispatch();
  usePageView();
  useEffect(() => {
    dispatchVersionState({ version: json.version, env: CommonUtil.getEnv() });
    dispatchApiStatusList([]);
  }, []);
  useEffect(() => {
    if (parameters?.filters) {
      const filter = convertFilter2GroupSearchCriteria(
        parameters.filters,
        true
      );
      dispatch(setQuickSearchCriteria(filter));
    }
  }, [parameters]);
  return isInitComplete ? (
    <StyledRoot className={classes.ratanCashflow}>
      <div className={classes.searchSection}>
        <div className={classes.searchSectionBody}>
          <QuickSearch />
        </div>
      </div>
      <GridFooter />
      <CashflowDataGrid />
    </StyledRoot>
  ) : null;
};

export default App;
