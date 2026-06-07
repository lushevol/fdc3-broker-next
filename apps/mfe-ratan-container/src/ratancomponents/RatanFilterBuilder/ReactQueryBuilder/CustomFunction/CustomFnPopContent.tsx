import React, { FC, useState, useMemo, useEffect } from "react";
import { useMap } from "react-use";
import { Select, Tooltip } from "antd";
import DoneIcon from "@mui/icons-material/Done";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@mui/material";
import { StylePopRoot } from "./common/CustomFnPopContentStyle";
import FunItemsComponent from "./CustomParamsComp";
import { hydrationGenerationObj } from "./utils/utils";
import { CustomFunFieldType } from "../types";

interface CustomFnPopContent {
  initialValue: string | undefined;
  disabled: boolean | undefined;
  funList: any[];
  dataType: string;
  handleOnChange;
  functionName: string | undefined;
  type?: string;
  level: any;
}

const CustomFnPopContent: FC<CustomFnPopContent> = ({
  initialValue,
  disabled,
  funList,
  dataType,
  handleOnChange,
  type,
  functionName,
  level,
}) => {
  let hyResult = hydrationGenerationObj(initialValue);
  const [newFunName, setNewFunName] = useState<string | undefined>(
    functionName
  );
  const [fnResult, { set, reset }] = useMap<MapType>({});
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [isDisableDelete, setIsDisableDelete] = useState<boolean>(true);
  let isParamValidate = true;

  const formItems = useMemo(() => {
    const doms: JSX.Element[] = [];
    const functionObj = funList.find(
      (func) => func.functionName === newFunName
    );
    const paramsConfig = functionObj?.parameters;
    let allIndex = 0;

    if (Array.isArray(paramsConfig)) {
      paramsConfig.forEach((item: any, index: number) => {
        const initialValue =
          hyResult.funName === newFunName ? hyResult.param[index] : undefined;
        doms.push(
          <FunItemsComponent
            initValue={initialValue}
            config={item}
            disabled={disabled}
            onChange={(key: string, value: string | number | undefined) => {
              set(key, value);
            }}
            field={`funName_${index}`}
            key={`${newFunName}_${allIndex}`}
          />
        );
        allIndex++;
      });

      isParamValidate = !Object.values(fnResult).some(
        (value) => value === undefined
      );
    }
    return doms;
  }, [newFunName, fnResult, hyResult]);

  const onChangeFunName = (value: string) => {
    reset();
    setNewFunName(value);

    if (value !== hyResult.funName) {
      hyResult.param = [];
    }
  };

  const onFunSubmit = () => {
    const expression = generateExpression();
    const functionObj = funList.find(
      (func) => func.functionName === newFunName
    );
    const resultType = functionObj.methodReturnType[0]?.paramType;
    if (type && type === "fieldSelctor" && level === 1) {
      handleOnChange({
        value: initialValue,
        fn: { expression, field: initialValue, resultType: resultType },
      } as CustomFunFieldType);
    } else {
      handleOnChange({
        value: initialValue,
        fn: { expression, field: initialValue, resultType: resultType },
      });
    }
    setNewFunName(undefined);
  };

  const onRemoveSubmit = () => {
    reset();
    if (type && type === "fieldSelctor" && level === 1) {
      handleOnChange({
        value: hyResult.funField,
        fn: {},
      });
    } else {
      handleOnChange(hyResult.funField);
    }
  };

  const generateExpression = () => {
    let expression = `${newFunName}(${hyResult.funField}`;

    const valuesArr = Object.values(fnResult);
    valuesArr.length > 0 &&
      valuesArr.forEach((value: any, index: number) => {
        if (typeof value === "number") {
          expression += `, ${value}`;
        } else {
          expression += `, "${value}"`;
        }
      });

    expression += ")";
    return expression;
  };

  useEffect(() => {
    const newExpression = generateExpression();

    if (newFunName && isParamValidate) {
      setIsDisableDelete(false);
      if (newExpression !== initialValue) {
        setIsDisableSubmit(false);
      }
    } else {
      setIsDisableSubmit(true);
      setIsDisableDelete(true);
    }
  }, [newFunName, fnResult, initialValue, isParamValidate]);

  const renderFunOptions = () => {
    const newOptions = funList.map((a) => ({
      label: a.displayName,
      value: a.functionName,
    }));
    return newOptions;
  };

  const showTooltip = () => {
    const item = funList.find((func) => func.functionName === newFunName);
    return item?.description;
  };

  return (
    <StylePopRoot>
      <div className="custom-field-popover-fun-content">
        {newFunName && (
          <Tooltip title={showTooltip()}>
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
          </Tooltip>
        )}
        <Select
          className="custom-field-fun-menthod-select"
          id="custom-field-fun-menthod"
          placeholder="Select Function..."
          onChange={onChangeFunName}
          data-testid="customFieldFunMenthodSelect"
          options={renderFunOptions()}
          value={newFunName}
          allowClear
        ></Select>
        {formItems}
        <div className="custom-field-popover-fun-action">
          <Button
            className={"custom-field-fun-button-submit"}
            onClick={onFunSubmit}
            disabled={isDisableSubmit}
            startIcon={<DoneIcon sx={{ fontSize: 40 }} />}
            variant="outlined"
            size="small"
            data-testid="customFieldFunMenthod-submit"
          ></Button>
          <Button
            className={"custom-field-fun-button-delete"}
            onClick={onRemoveSubmit}
            disabled={isDisableDelete}
            startIcon={<DeleteForeverIcon sx={{ fontSize: 40 }} />}
            variant="outlined"
            size="small"
            data-testid="customFieldFunMenthod-delete"
          ></Button>
        </div>
      </div>
    </StylePopRoot>
  );
};

export default CustomFnPopContent;
