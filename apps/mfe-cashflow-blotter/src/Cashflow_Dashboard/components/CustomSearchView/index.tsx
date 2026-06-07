import { message } from "antd";
import { FC, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_Dashboard/Main/store-redux";
import {
  clearAdvancedSearch,
  searchFormClear,
  setAdvancedSearch,
} from "src/Cashflow_Dashboard/Main/store-redux/slice/dashboard-search";
import { AdvancedSearch } from "src/Root/import/ratancomponents";
import {
  deleteFilter as deleteFilterAPI,
  getBusinessFieldsFromCache,
  getFilterDetails,
  getFilterList,
  getUser,
  hasPermission,
  postSaveFilter,
  putUpdateFilter,
} from "src/Root/import/ratanutils";

import { dashboardCustomFields } from "./../../Main/common/fieldsConfig";
import StyledRoot, { classes } from "./style";
import type {
  CreateFilter,
  CreateFilterAPI,
  DeleteFilter,
  DeleteFilterAPI,
  FilterRecord,
  QueryFilterDetails,
  QueryFilterDetailsAPI,
  QueryFilterList,
  QueryFilterListAPI,
  SaveFilter,
  SaveFilterAPI,
} from "./types";
import { getOperators } from "./util";

const workspace = "cashflowCN";
const filterFieldType = "STRATEGIC_CASHFLOW_DASHBORD_FILTER_BUILDER";

const queryFilterList: QueryFilterList = async () => {
  const userInfo = getUser();
  const resp = await (getFilterList as QueryFilterListAPI)({
    type: filterFieldType,
    creator: userInfo.id,
    owner: userInfo.id,
    assignee: "",
    moduleOwner: "",
    searchAll: true,
  });
  return resp ?? [];
};
const saveFilter: SaveFilter = async (f: FilterRecord) => {
  return await (putUpdateFilter as SaveFilterAPI)(f.rowKey, {
    ...f,
    type: filterFieldType,
  });
};
const deleteFilter: DeleteFilter = async (f: FilterRecord) => {
  return await (deleteFilterAPI as DeleteFilterAPI)(f.rowKey, filterFieldType);
};
const createFilter: CreateFilter = async (f: FilterRecord) => {
  return await (postSaveFilter as CreateFilterAPI)({
    ...f,
    type: filterFieldType,
    rowKey: "",
  });
};
const queryFilterDetails: QueryFilterDetails = async (f: FilterRecord) => {
  return await (getFilterDetails as QueryFilterDetailsAPI)(
    f.rowKey,
    filterFieldType
  );
};

const CustomSearchView: FC = () => {
  const [allFields, setAllFields] = useState(dashboardCustomFields);
  const dispatch = useAppDispatch();
  const [messageApi, MessageContext] = message.useMessage();
  const { advancedSearch } = useAppSelector((state) => state.dashboardSearch);
  useEffect(() => {
    getBusinessFieldsFromCache(workspace).then((res: any) => {
      const { cashflowAndTradeFields } = res;
      const keys = dashboardCustomFields.map((i) => i.indexedTerm);
      cashflowAndTradeFields.forEach((item) => {
        if (keys.includes(item.indexedTerm)) {
          setAllFields((fs) => {
            const targetFilter = fs.find(
              (i) => i.indexedTerm === item.indexedTerm
            );
            if (targetFilter && !targetFilter.valueList) {
              targetFilter.valueList = item.valueList;
            }
            return JSON.parse(JSON.stringify(fs));
          });
        }
      });
    });
  }, []);

  const setAppliedFilter = async (nf: FilterRecord | null) => {
    if (nf) {
      dispatch(setAdvancedSearch({ ...nf, type: filterFieldType }));
      dispatch(searchFormClear());
    } else {
      dispatch(clearAdvancedSearch());
    }

    messageApi.success("Filter Applied !");
  };
  return (
    hasPermission(
      "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Custom_Query_Builder"
    ) && (
      <StyledRoot>
        <div className={classes.selector}>
          {MessageContext}
          <AdvancedSearch
            type={filterFieldType}
            fields={allFields}
            appliedFilter={advancedSearch.appliedFilter}
            setAppliedFilter={setAppliedFilter}
            queryFilterList={queryFilterList}
            queryFilterDetails={queryFilterDetails}
            createFilter={createFilter}
            saveFilter={saveFilter}
            deleteFilter={deleteFilter}
            getOperators={getOperators}
          />
        </div>
      </StyledRoot>
    )
  );
};

export default CustomSearchView;
