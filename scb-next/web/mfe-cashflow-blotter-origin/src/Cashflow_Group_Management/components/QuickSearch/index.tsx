import { DatePicker, Form, Input, Select, Space } from "antd";
import { Button } from "Import/index";
import { getBusinessFieldsFromCache } from "Import/ratanutils";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateFormat } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";
import { antdSelectSearchFilterOption } from "src/Cashflow_Dashboard/components/QuickSearch/utils";
import {
  setQuickSearchCriteria,
  triggerSearch,
} from "src/Cashflow_Group_Management/Main/store/slice";
import {
  GROUP_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  GROUP_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";
import { ratanFieldConfigPreprocessing } from "src/Root/import/ratancomponents";

import { GroupBlotterRootState } from "../../Main/store/interface";
import { cashflowStatusOptions, filterControllers } from "./const";
import { FilterItemConfig } from "./type";
const { useForm } = Form;

const ValueWidgetSelector = (f: FilterItemConfig) => {
  const isMultiSelect = f.type === "multiSelect";
  switch (f.type) {
    case "multiSelect":
    case "select":
      return (
        <Select
          showSearch
          allowClear
          options={f.options}
          filterOption={antdSelectSearchFilterOption}
          {...(isMultiSelect && {
            maxTagCount: 1,
            maxTagTextLength: 10,
            mode: "multiple",
          })}
        />
      );

    case "date":
      return (
        <DatePicker style={{ width: "100%" }} allowClear format={DateFormat} />
      );

    case "input":
    default:
      return <Input allowClear />;
  }
};

const QuickSearch: FC = () => {
  const dispatch = useDispatch<any>();
  const quickSearch = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.quickSearch
  );
  const [groupFilterControllers, setGroupFilterControllers] =
    useState(filterControllers);
  const [form] = useForm();

  const handleSearch = useCallback(() => {
    const formData = form.getFieldsValue();
    dispatch(setQuickSearchCriteria(formData));
    dispatch(triggerSearch("initial"));
  }, []);

  const clearCriteriaAndSearch = useCallback(() => {
    dispatch(setQuickSearchCriteria({}));
    dispatch(triggerSearch("initial"));
    setTimeout(() => {
      form.resetFields();
    }, 0);
  }, []);

  useEffect(() => {
    getBusinessFieldsFromCache("cashflowCN").then((res: any) => {
      const { cashflowAndTradeFields } = res;
      const keys = filterControllers.map((i) => i.key);
      cashflowAndTradeFields.forEach((item) => {
        if (keys.includes(item.indexedTerm)) {
          setGroupFilterControllers((fs) => {
            const targetFilter = fs.find((i) => i.key === item.indexedTerm);
            if (targetFilter && !targetFilter.options.length) {
              const fieldConfig = ratanFieldConfigPreprocessing(item);
              targetFilter.options = fieldConfig.valueList;
              if (targetFilter.key === "Cashflow.Cashflow_State") {
                targetFilter.options = [
                  ...targetFilter.options,
                  ...cashflowStatusOptions,
                ];
              }
            }
            return JSON.parse(JSON.stringify(fs));
          });
        }
      });
    });
  }, []);

  return (
    <Form
      form={form}
      initialValues={quickSearch}
      onFinish={handleSearch}
      layout="inline"
      style={{ gap: "10px" }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      {groupFilterControllers
        .filter((f) => !f.hide)
        .map((f) => (
          <Form.Item
            label={f.label}
            name={f.name}
            key={f.key}
            style={{ width: "320px" }}
          >
            {ValueWidgetSelector(f)}
          </Form.Item>
        ))}
      <Form.Item wrapperCol={{ offset: 8 }} style={{ width: "320px" }}>
        <Space>
          <Button
            htmlType="button"
            onClick={clearCriteriaAndSearch}
            variant="outlined"
            data-testid={GROUP_BLOTTER_QUICK_SEARCH_CLEAR_BTN}
          >
            Clear
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            variant="contained"
            data-testid={GROUP_BLOTTER_QUICK_SEARCH_SEARCH_BTN}
          >
            Search
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default QuickSearch;
