import React, { FC, useState, useEffect } from "react";
import { Popover } from "antd";
import FunctionsIcon from "@mui/icons-material/Functions";
import { Button } from "@mui/material";
import CustomFnPopContent from "./CustomFnPopContent";
import { hydrationGenerationObj } from "./utils/utils";
import { FieldInput } from "../types";
import { RuleFunctionConfig } from "../../RatanOne/type";

interface CustomFnCompProps {
  handleOnChange;
  functionConfig: RuleFunctionConfig[];
  schema: any;
  selectorValue: string | undefined;
  selectorRule: any;
  disableCascader: boolean | undefined;
  type?: string;
  level: any;
}

const CustomFnComp: FC<CustomFnCompProps> = ({
  handleOnChange,
  type,
  functionConfig,
  schema,
  selectorValue,
  selectorRule,
  disableCascader,
  level,
}) => {
  const [disableFun, setDisableFun] = useState(true);
  const enableFunComp = selectorValue && !["~", ""].includes(selectorValue);
  const [newConfig, setNewConfig] = useState<RuleFunctionConfig[]>([]);
  const newValue = selectorValue as any;
  const newRule = selectorRule as any;
  let newFieldName = selectorValue;

  if (type === "fieldSelctor") {
    if (newRule?.enrich) {
      newFieldName = newRule.enrich.expression;
    } else if (newRule?.field?.fn) {
      newFieldName = newValue?.fn.expression;
    }
  } else newFieldName = newValue?.fn ? newValue?.fn.expression : newValue;

  const { funField, funName } = hydrationGenerationObj(newFieldName);
  const fieldConfig = schema?.fieldMap?.[funField ?? ""] as
    | FieldInput
    | undefined;
  const dataType = fieldConfig?.config?.dataType || "text";
  const color = funName ? "success" : "primary";

  const constGenerateFunConfig = () => {
    const newArr =
      functionConfig.filter(
        (a) => a.supportTargetObjectClass[0].toLowerCase() === dataType
      ) || [];
    setNewConfig(newArr);
    if (newArr.length === 0) {
      setDisableFun(true);
    } else {
      disableCascader ? setDisableFun(true) : setDisableFun(false);
    }
  };

  useEffect(() => {
    constGenerateFunConfig();
  }, []);

  return (
    <Popover
      content={
        <CustomFnPopContent
          initialValue={newFieldName}
          disabled={disableFun}
          funList={newConfig}
          dataType={dataType}
          handleOnChange={handleOnChange}
          functionName={funName}
          type={type}
          level={level}
        />
      }
      trigger="click"
      destroyTooltipOnHide={true}
    >
      {enableFunComp && (
        <Button
          className={"custom-field-fun-main-button"}
          onClick={(e) => {}}
          color={color}
          disabled={disableFun}
          startIcon={<FunctionsIcon style={{ fontSize: "13px" }} />}
          variant="outlined"
          size="small"
          data-testid="customFieldFunMenthod-fun-button"
        >
          FN
        </Button>
      )}
    </Popover>
  );
};

export default CustomFnComp;
