import { useParentData } from 'Import/ratanutils';
import { createContext, Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useFDC3 } from 'ratan-fdc3-agent';
import { useDispatch } from 'react-redux';
import { usePageView } from 'src/Root/analysis';
import {
  type CashflowSearchAgent,
  registerCashflowSearchIntent,
} from 'src/Root/fdc3/cashflowInterop';
import { CommonUtil } from 'src/Root/import';
import { useRatanDispatcher } from 'src/Root/import/ratancomponents';
import { TileProps } from 'src/Root/routing/common/interface';

import json from '../../../package.json';
import CashflowDataGrid from '../components/CashflowDataGrid';
import GridFooter from '../components/GridFooter';
import QuickSearch from '../components/QuickSearch';
import { convertFilter2GroupSearchCriteria } from './common/utils';
import { setQuickSearchCriteria } from './store/slice';
import StyledRoot, { classes } from './style';

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
  const fdc3 = useFDC3() as CashflowSearchAgent;
  usePageView();
  useEffect(() => {
    dispatchVersionState({ version: json.version, env: CommonUtil.getEnv() });
    dispatchApiStatusList([]);
  }, []);
  useEffect(() => {
    if (parameters?.filters) {
      const filter = convertFilter2GroupSearchCriteria(parameters.filters, true);
      dispatch(setQuickSearchCriteria(filter));
    }
  }, [parameters]);
  useEffect(() => {
    let isMounted = true;
    let listener: Awaited<ReturnType<typeof registerCashflowSearchIntent>> | undefined;

    registerCashflowSearchIntent(fdc3, (filters) => {
      const filter = convertFilter2GroupSearchCriteria(filters, true);
      dispatch(setQuickSearchCriteria(filter));
    })
      .then((nextListener) => {
        if (isMounted) {
          listener = nextListener;
        } else {
          void nextListener.unsubscribe();
        }
      })
      .catch((error) => {
        console.warn('[Cashflow FDC3] Failed to register SearchCashflows listener', error);
      });

    return () => {
      isMounted = false;
      void listener?.unsubscribe();
    };
  }, [dispatch, fdc3]);
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
