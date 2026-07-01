import { useState, useEffect } from "react";
//@ts-ignore
import { useMap } from "react-use";
import { convertValue, setOnChangeFun } from "./validation/validationUtils";
import {
  getValidationRules,
  getValidationRulesFromRuleService,
} from "../../ratanutils/http/api";
import MandatoryOnRulesTracer from "./validation/MandatoryOnRulesTracer";
import ValueBindTracer from "./validation/ValueBindTracer";
import LaterOrOnTracer from "./validation/LaterOrOnTracer";
import EalierOrOnTracer from "./validation/EalierOrOnTracer";
import RegExpTracer from "./validation/RegExpTracer";
import _pick from "lodash/pick";

const validationRulesCache: { [type: string]: { [e: string]: any } } = {
  cn: {},
  bau: {},
};

const judgeCNOrBAU = (isCN?: boolean) => (isCN ? "cn" : "bau");

export interface PopulateRulesParams {
  rules?: any[];
  updateRules?: (rules: any[]) => void;
}

export const useValidation = ({
  entity,
  form,
  editable,
  btnSet,
  onFormChange,
  isCashflowSettlementCN,
  validationRules = [],
  populateRules,
}: {
  entity: string;
  form: any;
  editable: boolean;
  btnSet: Function;
  onFormChange?: Function;
  isCashflowSettlementCN?: boolean;
  validationRules: any[];
  populateRules?: (params: PopulateRulesParams) => void;
}) => {
  const [rules, setRules] = useState<any[]>([]);
  const [rulesObj, setRulesObj] = useState<MapType>({});
  const [isRequiredObj, { set, setAll }] = useMap<MapType>({});
  const [onChangeObj, setOnChangeObj] = useState<MapType>({});
  const [isReady, setIsReady] = useState(false);
  const [autoInputValues, setAutoInputValues] = useState({});
  const fetchValidationRules = isCashflowSettlementCN
    ? getValidationRulesFromRuleService
    : getValidationRules;

  const resetValidation = () => {
    setRules(JSON.parse(JSON.stringify(rules)));
    setAutoInputValues({});
  };

  const forceRefreshValidation = async (value) => {
    if (!rules.length) {
      try {
        let re;
        if (
          validationRulesCache[judgeCNOrBAU(isCashflowSettlementCN)][entity]
        ) {
          re =
            validationRulesCache[judgeCNOrBAU(isCashflowSettlementCN)][entity];
        } else {
          re = await fetchValidationRules(entity);
          validationRulesCache[judgeCNOrBAU(isCashflowSettlementCN)][entity] =
            re;
        }
        if (Array.isArray(re)) setRules(re);
      } catch (error) {}
    }
    setTimeout(() => {
      valuesChange(_pick(value, "swiftType"));
    });
  };

  const valuesChange = (obj: any, all?: any) => {
    Object.keys(obj).forEach((key: string) => {
      onChangeObj[key]?.forEach((callback: Function) => {
        callback.call(null, obj[key]);
      });
    });
    onFormChange?.(obj, all);
  };

  useEffect(() => {
    if (editable && entity && !rules.length) {
      fetchValidationRules(entity)
        .then((res: any) => {
          if (Array.isArray(res)) {
            setRules([...res, ...validationRules]);
            populateRules?.({
              rules: [...res, ...validationRules],
              updateRules: setRules,
            });
          } else {
            throw new Error("Rules should be an array!");
          }
        })
        .catch(() => {
          btnSet("ruleError", true);
        });
    } else if (editable && entity && rules.length) {
      populateRules?.({
        rules: rules,
        updateRules: setRules,
      });
    }
  }, [editable, rules.toString()]);

  useEffect(() => {
    const newRulesObj: any = {};
    const newIsRequiredObj: any = {};
    const newOnChangeObj: any = {};

    rules.forEach((item: any, index: number) => {
      if (!newRulesObj[item.field]) {
        newRulesObj[item.field] = [];
      }

      const ruleId = index;
      item.rules.forEach((subItem: any) => {
        /**
         * @Auth Tech
         * @Comment shoud dobule check the logic
         */

        switch (subItem.name) {
          case "MandatoryOn":
            newIsRequiredObj[item.field] = false;
            subItem.value.fields.forEach((subSubItem: any) =>
              MandatoryOnRulesTracer({
                newOnChangeObj,
                subSubItem,
                setOnChangeFun,
                isRequiredObj,
                item,
                ruleId,
                set,
                form,
              })
            );
            break;
          case "ValueBind":
            // if (typeof newIsRequiredObj[item.field] === "undefined") {
            //   newIsRequiredObj[item.field] = true;
            // }
            newRulesObj[item.field].push(({ getFieldValue }: any) =>
              ValueBindTracer(
                getFieldValue,
                subItem,
                convertValue,
                item,
                setAutoInputValues
              )
            );
            break;
          case "RegExp": {
            const allowEmpty = item.rules.some(
              (item: any) => item.name === "AllowEmpty"
            );

            if (
              typeof newIsRequiredObj[item.field] === "undefined" &&
              !allowEmpty
            ) {
              newIsRequiredObj[item.field] = true;
            }

            newRulesObj[item.field].push(() =>
              RegExpTracer(subItem, item.rules, ruleId)
            );
            break;
          }
          case "LaterOrOn":
            newRulesObj[item.field].push(({ getFieldValue }: any) =>
              LaterOrOnTracer(getFieldValue, subItem, convertValue)
            );
            break;
          case "EalierOrOn":
            newRulesObj[item.field].push(({ getFieldValue }: any) =>
              EalierOrOnTracer(getFieldValue, subItem, convertValue)
            );
        }
      });

      setIsReady(true);
    });

    setOnChangeObj(newOnChangeObj);
    setRulesObj(newRulesObj);
    setAll(newIsRequiredObj);
  }, [rules]);

  return {
    rulesObj,
    isRequiredObj,
    isReady,
    resetValidation,
    valuesChange,
    forceRefreshValidation,
    autoInputValues,
  };
};
