import { FormInstance } from "antd";
import { useMemo } from "react";
import { CurrencyList } from "src/Cashflow_CN/Main/config/ratanConfig/local/cashflowQuickSearchConfig";
export const useDetailsFormItems = (form: FormInstance) => {
  const validateAmount = async (_: any, value: number) => {
    const threshold = form.getFieldValue("threshold");
    const limitation = form.getFieldValue("limitation");
    if (isNaN(value)) {
      return Promise.reject(new Error("Amount must be a number"));
    }
    if (threshold !== undefined && value >= Number(threshold)) {
      return Promise.reject(new Error("Amount must be less than Threshold"));
    }
    if (limitation !== undefined && value >= Number(limitation)) {
      return Promise.reject(new Error("Amount must be less than Limitation"));
    }
    return Promise.resolve();
  };

  const validateLimitation = async (_: any, value: number) => {
    const threshold = form.getFieldValue("threshold");
    if (isNaN(value)) {
      return Promise.reject(new Error("Amount must be a number"));
    }
    if (threshold !== undefined && value >= Number(threshold)) {
      return Promise.reject(new Error("Amount must be less than Threshold"));
    }
    return Promise.resolve();
  };

  const currencyOptions = useMemo(() => {
    const thisOptions: { label: string; value: string }[] = [];

    CurrencyList?.forEach((item: string) => {
      if (typeof item === "string") {
        thisOptions.push({ label: item, value: item });
      }
    });

    return thisOptions;
  }, []);

  const formItemsConfig = [
    {
      label: "Booking Entity FMID",
      name: "entityFmId",
      rules: [],
      component: "QuickSearchInput",
    },
    {
      label: "Booking Entity FMCODE",
      name: "entityFmCode",
      rules: [],
      component: "QuickSearchInput",
    },
    {
      label: "Nostro Agent",
      name: "nostroAgent",
      component: "QuickSearchInput",
      rules: [
        { required: true, message: "please type nostro agent" },
        {
          pattern: /^.{8}$|^.{11}$/,
          message: "Nostro Agent must be 8 or 11 characters",
        },
      ],
    },
    {
      label: "Currency",
      name: "currency",
      component: "QuickSearchSelect",
      valueList: CurrencyList,
      rules: [{ required: true, message: "please select currency" }],
    },
    {
      label: "Threshold",
      name: "threshold",
      rules: [{ required: true, message: "please input Threshold" }],
    },
    {
      label: "Amount",
      name: "amount",
      rules: [
        { required: true, message: "please input Amount" },
        { validator: validateAmount },
      ],
    },
    {
      label: "Limitation",
      name: "limitation",
      rules: [{ required: true, message: "please input Limitation" }],
    },
  ];
  return {
    validateAmount,
    validateLimitation,
    formItemsConfig,
    currencyOptions,
  };
};
