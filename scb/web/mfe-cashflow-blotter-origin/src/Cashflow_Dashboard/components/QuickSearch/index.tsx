import { Form, Input, Select, Space } from "antd";
import { Button } from "Import/index";
import { FC, useCallback, useEffect, useState } from "react";
import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_Dashboard/Main/store-redux";
import {
  clearAdvancedSearch,
  setQuickSearch,
  setSearchFormInstance,
} from "src/Cashflow_Dashboard/Main/store-redux/slice/dashboard-search";
import {
  DASHBOARD_QUICK_SEARCH_CLEAR_BTN,
  DASHBOARD_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";
import { ratanFieldConfigPreprocessing } from "src/Root/import/ratancomponents";
import { getBusinessFieldsFromCache } from "src/Root/import/ratanutils";

import { countryOptions } from "./const";
import StyledRoot, { classes } from "./style";
import { antdSelectSearchFilterOption } from "./utils";

const { useForm } = Form;

type StaticFilterItemType = {
  label: string;
  key: string;
  width?: string;
  hide?: boolean;
  options: {
    value: string;
    label: string;
  }[];
};

const staticFilterControllers: StaticFilterItemType[] = [
  {
    label: "Country/Region",
    key: "Country",
    options: countryOptions,
  },
  {
    label: "Booking Entity",
    key: "Entity.Booking_Entity_SCI_FMID",
    options: BookingEntityNameIdOptions,
  },
];

const QuickSearch: FC = () => {
  const { quickSearch, searchIndicator, isSearching } = useAppSelector(
    (state) => state.dashboardSearch
  );
  const dispatch = useAppDispatch();
  const [filterControllers, setFilterControllers] = useState(
    staticFilterControllers
  );
  const [form] = useForm();

  useEffect(() => {
    getBusinessFieldsFromCache("cashflowCN").then((res: any) => {
      const { cashflowAndTradeFields } = res;
      const keys = staticFilterControllers.map((i) => i.key);
      cashflowAndTradeFields.forEach((item) => {
        if (keys.includes(item.indexedTerm)) {
          setFilterControllers((fs) => {
            const targetFilter = fs.find((i) => i.key === item.indexedTerm);
            if (targetFilter && !targetFilter.options.length) {
              const fieldConfig = ratanFieldConfigPreprocessing(item);
              targetFilter.options = fieldConfig.valueList;
            }
            return JSON.parse(JSON.stringify(fs));
          });
        }
      });
    });
    dispatch(setSearchFormInstance(form));
  }, []);

  const handleSearch = useCallback(() => {
    const formData = form.getFieldsValue();
    dispatch(setQuickSearch(formData));
    dispatch(clearAdvancedSearch());
  }, []);

  const clearCriteriaAndSearch = useCallback(() => {
    form.resetFields();
    dispatch(setQuickSearch({}));
  }, []);

  const onFormChange = (value: string | string[], fieldKey: string) => {
    const countryFiled = form.getFieldValue("Country");
    const bookingEntity = form.getFieldValue("Entity.Booking_Entity_SCI_FMID");

    if (countryFiled === value && fieldKey === "Country") {
      form.setFieldValue("Entity.Booking_Entity_SCI_FMID", []);
    } else if (
      bookingEntity === value &&
      fieldKey === "Entity.Booking_Entity_SCI_FMID"
    ) {
      form.setFieldValue("Country", []);
    } else if (value.length === 0 || value === null || undefined) {
      form.setFieldValue(fieldKey, undefined);
    }
  };
  return (
    <StyledRoot>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
        className={classes.form}
      >
        {filterControllers
          .filter((i) => !i.hide)
          .map((f) => (
            <Form.Item
              label={f.label}
              name={f.key}
              key={f.key}
              className={classes.formItem}
            >
              {f.options.length ? (
                <Select
                  mode="multiple"
                  style={{ width: f.width ?? "250px" }}
                  allowClear
                  showSearch
                  maxTagCount="responsive"
                  options={f.options}
                  filterOption={antdSelectSearchFilterOption}
                  onChange={(e) => onFormChange(e, f.key)}
                />
              ) : (
                <Input
                  style={{ width: f.width ?? "250px" }}
                  allowClear
                  onChange={(e) => onFormChange(e.target.value, f.key)}
                />
              )}
            </Form.Item>
          ))}
        <Form.Item className={classes.btnItem}>
          <Space>
            <Button
              style={{ height: "31.33px" }}
              htmlType="button"
              onClick={clearCriteriaAndSearch}
              variant="outlined"
              color={
                searchIndicator === "quickSearch" &&
                Object.keys(quickSearch).length
                  ? "warning"
                  : undefined
              }
              data-testid={DASHBOARD_QUICK_SEARCH_CLEAR_BTN}
              disabled={isSearching}
            >
              Clear
            </Button>
            <Button
              style={{ height: "31.33px" }}
              type="primary"
              htmlType="submit"
              variant="contained"
              data-testid={DASHBOARD_QUICK_SEARCH_SEARCH_BTN}
              disabled={isSearching}
            >
              Search
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </StyledRoot>
  );
};

export default QuickSearch;
