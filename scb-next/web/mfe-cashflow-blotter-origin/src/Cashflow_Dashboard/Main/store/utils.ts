import isNil from "lodash/isNil";
import { RuleGroupType, RuleType } from "react-querybuilder";
import { transformQueryOptions } from "src/Cashflow_CN/components/AdvancedSearch/converter";
import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import { legacyFilters2Query } from "src/Root/common/utils/query";
import { hydrate } from "src/Root/import/ratancomponents";

import { AdvancedSearchCriteria, SearchCriteria } from "./interface";

export const convertAdvancedSearch2Filters = (
  advancedSearch: AdvancedSearchCriteria
): Filter[] => {
  if (advancedSearch.appliedFilter) {
    const RQBFilters = hydrate(
      advancedSearch.appliedFilter?.body
    ) as RuleGroupType;
    return (RQBFilters?.rules as RuleType[]).map((r) => {
      if (r.field === "Country") {
        return convertCountrySearch2Filter(
          Array.isArray(r.value) ? r.value : [r.value]
        );
      } else {
        return {
          field: r.field,
          operator:
            transformQueryOptions.operatorMap![r.operator] || r.operator,
          values: r.value,
        };
      }
    });
  }
  return [];
};

export const convertQuickFilter2Filters = (
  quickSearch: SearchCriteria
): Filter[] => {
  return Object.entries(quickSearch)
    .filter(
      ([field, value]) =>
        !isNil(value) && Array.isArray(value) && value.length > 0
    )
    .map(([field, value]) => {
      if (field === "Country") {
        return convertCountrySearch2Filter(value as string[]);
      } else if (field === "Entity.Counterparty_SCI_FMID") {
        return convertCounterPartySearch2Filter(value as string);
      } else {
        return {
          field,
          operator: "IN",
          values: value,
        };
      }
    });
};

export const convertCounterPartySearch2Filter = (cpInput: string): Filter => {
  const cpInputList = cpInput.split(",").map((i) => i.trim());
  const field = /^\d+$/g.test(cpInputList[0])
    ? "Entity.Counterparty_SCI_FMID"
    : "Entity.Counterparty_SCI_FMCODE";
  return {
    field,
    operator: "IN",
    values: cpInputList,
  };
};

export const convertCountrySearch2Filter = (countryValue: string[]): Filter => {
  const bookingEntityIdOfCountry = BookingEntityNameIdOptions.filter(
    (item: any) => {
      return countryValue.includes(item.tag);
    }
  ).map((i) => i.value);
  return {
    field: "Entity.Booking_Entity_SCI_FMID",
    operator: "IN",
    values: bookingEntityIdOfCountry,
  };
};

export const parseAdvancedSearch = (
  advancedSearch: AdvancedSearchCriteria
): RuleGroupType => {
  return legacyFilters2Query(convertAdvancedSearch2Filters(advancedSearch));
};

export const parseQuickFilter = (
  quickSearch: SearchCriteria
): RuleGroupType => {
  return legacyFilters2Query(convertQuickFilter2Filters(quickSearch));
};
