import { ViewSelector } from "Import/ratancomponents";
import {
  conversionViewOptions,
  getBusinessFieldsFromCache,
  hasPermission,
} from "Import/ratanutils";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ratanConfig from "src/Cashflow_CN/Main/config/ratanConfig";
import { useBatchCollect } from "src/Root/analysis";
import { CUSTOM_VIEW_FIELDS } from "src/Root/analysis/const";

import { cashflowCustomFields } from "../../Main/config/fieldsConfig";
import { queryCashflowList } from "../../Main/store/actions";
import { NewFilterBuilder } from "../AdvancedSearch";
import StyledRoot, { classes } from "./style";

const viewFieldType = "CASHFLOW_CN_VIEW_BUILDER";
const CustomSearchView: FC = () => {
  const cashflowGridEvent = useSelector(
    (state: any) => state.cashflowGridEvent
  );
  const dispatch = useDispatch<any>();
  const [viewOptions, setViewOptions] = useState<any>();
  const workspace = "cashflowCN";
  const { startTracking } = useBatchCollect();

  useEffect(() => {
    getBusinessFieldsFromCache(workspace, cashflowCustomFields).then(
      (res: any) => {
        const { cashflowFields } = res;
        const viewOptions = conversionViewOptions(
          cashflowFields,
          false,
          workspace,
          ["FMO_Comments"]
        );
        setViewOptions(viewOptions);
      }
    );
  }, []);

  const onChangedView = (colIds: string[]) => {
    const newFields = colIds.filter(
      (id) =>
        !(
          ratanConfig.cashflow.cashflowSettlementMandatoryFields || []
        ).includes(id)
    );
    if (newFields.length) {
      dispatch(queryCashflowList({ isRefresh: true }));
      try {
        const complete = startTracking(CUSTOM_VIEW_FIELDS);
        complete(newFields.slice().sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <StyledRoot>
      <div className={classes.selector}>
        {hasPermission(
          "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Custom_Query_Builder"
        ) && <NewFilterBuilder />}
        {viewOptions && (
          <ViewSelector
            tradeGridReady={cashflowGridEvent}
            viewFieldType={viewFieldType}
            viewOptions={viewOptions}
            showIndexTerm={true}
            onChangedView={onChangedView}
          />
        )}
      </div>
    </StyledRoot>
  );
};

export default CustomSearchView;
