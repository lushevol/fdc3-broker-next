import { Divider } from "@mui/material";
import { message } from "antd";
import dayjs from "dayjs";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { queryCashflowList } from "src/Cashflow_CN/Main/store/actions";
import { FilterItem } from "src/Cashflow_CN/Main/store/interface";
import {
  PRESET_QUERY_COUNT_VD_TMR_PO,
  PRESET_QUERY_COUNT_VD_TMR_PV,
  PRESET_QUERY_COUNT_VD_TODAY_PO,
  PRESET_QUERY_COUNT_VD_TODAY_PV,
} from "src/Root/analysis/const";
import { legacyFilters2Query } from "src/Root/common/utils/query";

import { setFilterFields } from "../QuickFilters";
import QueryResultCount from "./QueryCount";
import Root, { classes } from "./style";

const generateFilterTemplate = (
  subState: "Pending Operator" | "Pending Verification",
  dayoffSet: number = 0
): Filter[] => {
  const filters: FilterItem[] = [
    {
      field: "Cashflow.Cashflow_Sub_State",
      operator: "EQ",
      values: subState,
    },
  ];
  const todayIsFriday = dayjs().day() === 5;
  if (dayoffSet === 1 && todayIsFriday) {
    filters.push({
      field: "Cashflow.Payment_Date",
      operator: "BET",
      values: [
        dayjs().format("YYYY-MM-DD"),
        dayjs().add(3, "day").format("YYYY-MM-DD"),
      ],
    });
  } else {
    filters.push({
      field: "Cashflow.Payment_Date",
      operator: "EQ",
      values: dayjs().add(dayoffSet, "day").format("YYYY-MM-DD"),
    });
  }
  return filters;
};

interface PresetQueryCountGroup {
  title: string;
  querys: {
    label: string;
    filters: Filter[];
    dataTestid: string;
  }[];
}

const generateQuery = () => {
  const todayIsFriday = dayjs().day() === 5;
  return [
    {
      title: "Value Today",
      querys: [
        {
          label: "Pending Operator",
          filters: generateFilterTemplate("Pending Operator"),
          dataTestid: PRESET_QUERY_COUNT_VD_TODAY_PO,
        },
        {
          label: "Pending Verification",
          filters: generateFilterTemplate("Pending Verification"),
          dataTestid: PRESET_QUERY_COUNT_VD_TODAY_PV,
        },
      ],
    },
    {
      title: todayIsFriday ? "Value till Monday" : "Value Tomorrow",
      querys: [
        {
          label: "Pending Operator",
          filters: generateFilterTemplate("Pending Operator", 1),
          dataTestid: PRESET_QUERY_COUNT_VD_TMR_PO,
        },
        {
          label: "Pending Verification",
          filters: generateFilterTemplate("Pending Verification", 1),
          dataTestid: PRESET_QUERY_COUNT_VD_TMR_PV,
        },
      ],
    },
  ];
};

const PresetQueryCount: FC = memo(() => {
  const dispatch = useDispatch<any>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [query, setQuery] = useState<PresetQueryCountGroup[]>(generateQuery());
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuery(generateQuery());
    }, 12 * 60 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleQuery = useCallback(
    (filters: Filter[], key: string) => {
      const isSameKey = activeKey === key;
      const newActiveKey = isSameKey ? null : key;
      setActiveKey(newActiveKey);
      const newFields = filters.reduce<Filter[]>((res, cur) => {
        const { label, field, values } = cur;
        return setFilterFields({ field, value: values, label }, res);
      }, []);

      const newFilter = isSameKey
        ? legacyFilters2Query([])
        : legacyFilters2Query(newFields);

      dispatch(
        queryCashflowList({
          filters: newFilter,
          searchName: "quickFilter",
          callback: (isSuccess: boolean) => {
            if (isSuccess) {
              messageApi.success("Search success!");
            }
          },
        })
      );
    },
    [activeKey]
  );

  return (
    <div>
      {messageContextHolder}
      {query.map(({ title, querys }) => (
        <Root key={title}>
          <div className={classes.title}>{title}</div>
          <Divider orientation="vertical" flexItem />
          {querys.map((q) => (
            <div className={classes.item} key={q.label}>
              <QueryResultCount
                {...q}
                onQuery={() => handleQuery(q.filters, q.dataTestid)}
                activeKey={activeKey}
              ></QueryResultCount>
            </div>
          ))}
        </Root>
      ))}
    </div>
  );
});

export default PresetQueryCount;
