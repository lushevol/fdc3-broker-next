import { message } from "antd";
import React, { useEffect, useState } from "react";
import { RuleGroupType } from "react-querybuilder";
import { useDispatch, useSelector } from "react-redux";
import { cashflowCustomFields } from "src/Cashflow_CN/Main/config/fieldsConfig";
import { advancedSearchAction } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { isQueryVDRangeThan1Month } from "src/Cashflow_CN/Main/utils/query-checker";
import { useBatchCollect } from "src/Root/analysis";
import { ADVANCED_SEARCH_FIELDS } from "src/Root/analysis/const";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { AdvancedSearch, hydrate } from "src/Root/import/ratancomponents";
import {
  deleteFilter as deleteFilterAPI,
  getBusinessFieldsFromCache,
  getFilterDetails,
  getFilterList,
  getUser,
  postSaveFilter,
  putUpdateFilter,
} from "src/Root/import/ratanutils";

import * as types from "../../Main/store/actionTypes";
import { getOperators } from "./operators";
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
import { filterFieldConfigItem, validateAdvancedFilter } from "./utils";

export const filterFieldType = "STRATEGIC_CASHFLOW_FILTER_BUILDER";
const workspace = "cashflowCN";

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
const queryFilterDetails: QueryFilterDetails = async (f: FilterRecord) => {
  return await (getFilterDetails as QueryFilterDetailsAPI)(
    f.rowKey,
    filterFieldType
  );
};

const deleteFilter: DeleteFilter = async (f: FilterRecord) => {
  return await (deleteFilterAPI as DeleteFilterAPI)(f.rowKey, filterFieldType);
};

export const NewFilterBuilder = () => {
  const advancedSearch = useSelector(
    (state: RootState) => state.advancedSearch
  );
  const [allFields, setAllFields] = useState([]);
  const [messageApi, MessageContext] = message.useMessage();
  const dispatch = useDispatch<any>();
  const { startTracking } = useBatchCollect();
  useEffect(() => {
    getBusinessFieldsFromCache(workspace, cashflowCustomFields).then(
      (res: any) => {
        const { cashflowAndTradeFields } = res;
        const filteredCashflowAndTradeFields = cashflowAndTradeFields.filter(
          (i) => filterFieldConfigItem(workspace, i)
        );
        setAllFields(filteredCashflowAndTradeFields);
      }
    );
  }, []);

  const validWarning = (msg: string | undefined) => {
    msg &&
      messageApi?.warning({
        content: msg,
        style: { whiteSpace: "pre-line" },
      });
  };

  const createFilter: CreateFilter = async (f: FilterRecord) => {
    const { valid, warningMsg } = validateAdvancedFilter(f);
    const newFilter = {
      ...f,
      type: filterFieldType,
      rowKey: "",
    };
    if (!valid) {
      validWarning(warningMsg);
      return Promise.reject(new Error("Invalid filter"));
    }
    return await (postSaveFilter as CreateFilterAPI)(newFilter);
  };

  const saveFilter: SaveFilter = async (f: FilterRecord) => {
    const { valid, warningMsg } = validateAdvancedFilter(f);
    const newFilter = {
      ...f,
      type: filterFieldType,
    };
    if (!valid) {
      validWarning(warningMsg);
      return Promise.reject(new Error("Invalid filter"));
    }

    return await (putUpdateFilter as SaveFilterAPI)(f.rowKey, newFilter);
  };

  const setAppliedFilter = async (nf: FilterRecord | null) => {
    const RQBFilters: RuleGroupType = hydrate(nf?.body);
    if (
      featureScopedEnabled("VD_Default_Query") &&
      isQueryVDRangeThan1Month(RQBFilters)
    ) {
      messageApi?.error(
        "The date range cannot be more than 1 month in quick search."
      );
      return;
    }

    const { valid, warningMsg } = validateAdvancedFilter(nf);
    const appliedFilter = {
      appliedFilter: nf ? { ...nf, type: filterFieldType } : nf,
    };

    if (!valid) {
      validWarning(warningMsg);
      dispatch({
        type: types.ACTION_TYPE_SET_ADVANCED_SEARCH,
        data: appliedFilter,
      });
    } else {
      await dispatch(advancedSearchAction(appliedFilter));
      messageApi?.success("Filter Applied !");
    }

    try {
      if (nf) {
        const qr = JSON.parse(nf.body);
        const fields = qr.rules.map((i) => i.field) as string[];
        const complete = startTracking(ADVANCED_SEARCH_FIELDS);
        complete(fields.slice().sort((a, b) => a.localeCompare(b)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {MessageContext}
      <AdvancedSearch
        filterMode="group-l3"
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
    </>
  );
};
