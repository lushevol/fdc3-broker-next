import { Box } from "@mui/material";
import { Form, Input, Space } from "antd";
import { Button } from "Import/index";
import { FC, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_BIC_Netting_Static_Table/store";
import { setSearchQuery } from "src/Cashflow_BIC_Netting_Static_Table/store/search.slice";
import {
  BIC_NETTING_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  BIC_NETTING_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";

import { quickSearchFields } from "./config";
const { useForm } = Form;

export const QuickSearch: FC = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.search);

  const clearSearchCriterias = useCallback(() => {
    dispatch(setSearchQuery({}));
    setTimeout(() => {
      form.resetFields();
    });
  }, [form]);

  return (
    <Box pt={1} pb={1}>
      <Form
        form={form}
        initialValues={searchQuery}
        onFinish={(formData) => {
          dispatch(setSearchQuery(formData ?? {}));
        }}
        layout="inline"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
      >
        {quickSearchFields.map((f, i) => (
          <Form.Item
            label={f.schemaLabel}
            name={f.schemaKey}
            key={f.schemaKey}
            style={{ width: i === 0 ? "8%" : "12%" }}
          >
            <Input autoComplete="off" allowClear />
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Space>
            <Button
              htmlType="button"
              onClick={clearSearchCriterias}
              variant="outlined"
              data-testid={BIC_NETTING_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN}
            >
              Clear
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              variant="contained"
              data-testid={BIC_NETTING_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN}
            >
              Search
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Box>
  );
};
