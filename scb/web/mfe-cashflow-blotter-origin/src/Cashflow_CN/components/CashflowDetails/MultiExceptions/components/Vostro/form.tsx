import { Divider, Stack } from "@mui/material";
import { Button } from "Import/index";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { get_MULTI_EXCEPTION_VOSTRO_FORM_ACTION } from "src/Root/analysis/const";
import { CustomFormGroup } from "src/Root/import/ratancomponents";

import { SSI_DETAILS_CONFIG_CN_Group } from "../../../../../Main/config/fieldsConfig";
import {
  MultiExceptionsFormNames,
  RefStructType,
} from "../../common/interface";
import { editingActions, removeSpecialCharacters } from "../../common/utils";
import { layoutSettingContext } from "../Layout/item";
import { AdhocSSIHandlerFunction } from "./AdhocSSIHandler";
import { VostroFormProps } from "./interface";
import { classes } from "./style";

interface PopRuleFnParam {
  rules: any[];
  updateRules: (param: any[]) => void;
}
export const debounceSetFormFieldsValue = debounce((set, fieldsValue) => {
  set(fieldsValue);
}, 500);

// Value length must be 8 or 11, and value must be alphanumeric and all be uppercase
const isAlphanumeric8or11 = (str: string) =>
  /^(([A-Z0-9]{8})|([A-Z0-9]{11}))$/.test(str);
const SSI_DETAILS_CONFIG_CN_COPY = cloneDeep(SSI_DETAILS_CONFIG_CN_Group);

const MAX_NAME_SIZE = 35;

export const handleCoveredPayment = (
  changes: any,
  formData: any,
  setVostroFormFieldsValue: VostroFormProps["setVostroFormFieldsValue"]
) => {
  if (
    changes.coveredPayment === "N" ||
    changes.hasOwnProperty("receiversCorrespondentBic") ||
    changes.hasOwnProperty("swiftType") ||
    changes.hasOwnProperty("settlementMeans")
  ) {
    const { receiversCorrespondentBic, swiftType, settlementMeans } = formData;
    if (
      settlementMeans === "NOS" &&
      swiftType === "MT103" &&
      (changes.coveredPayment === "N"
        ? isAlphanumeric8or11(receiversCorrespondentBic)
        : receiversCorrespondentBic)
    ) {
      debounceSetFormFieldsValue(setVostroFormFieldsValue, {
        coveredPayment: "Y",
      });
    } else {
      debounceSetFormFieldsValue(setVostroFormFieldsValue, {
        coveredPayment: "N",
      });
    }
  } else if (changes.coveredPayment === "Y") {
    const { swiftType, settlementMeans } = formData;
    if (swiftType !== "MT103" || settlementMeans !== "NOS") {
      debounceSetFormFieldsValue(setVostroFormFieldsValue, {
        coveredPayment: "N",
      });
    }
  }
};

export const handleAutoPopulate = (
  changes: any,
  counterPartyDetails: VostroFormProps["counterPartyDetails"],
  setVostroFormFieldsValue: VostroFormProps["setVostroFormFieldsValue"],
  forceRefreshAfterAutoPopulate: Function
) => {
  if (counterPartyDetails) {
    if (changes.swiftType === "MT103") {
      const { fmAccount = {}, legalEntity: { registeredAddress = {} } = {} } =
        counterPartyDetails;
      let { fmId = "", fmLongName = "" } = fmAccount;
      const {
        line1: addrLine1 = "",
        line2: addrLine2 = "",
        city = "",
        country = "",
        postCode = "",
        countryCode = "",
      } = registeredAddress;
      // Special characters will be handled for SCI data
      fmLongName = removeSpecialCharacters(fmLongName + "");
      const resolvedAddrLine1 = removeSpecialCharacters(addrLine1 + "");
      const resolvedAddrLine2 = removeSpecialCharacters(addrLine2 + "");
      const resolvedCity = removeSpecialCharacters(city + "");
      const resolvedCountry = country
        ? removeSpecialCharacters(country)
        : country;
      const beneficiaryProps: { [n: string]: string } = {
        beneficiaryName: fmLongName,
      };
      if (fmLongName.length > MAX_NAME_SIZE) {
        beneficiaryProps.beneficiaryName = fmLongName.slice(0, MAX_NAME_SIZE);
        beneficiaryProps.beneficiaryName2 = fmLongName.slice(MAX_NAME_SIZE);
      }
      const newVostroData = {
        ssiType: "Primary",
        // 59
        beneficiaryBic: "",
        beneficiaryAddress: `${resolvedAddrLine1} ${resolvedAddrLine2} ${resolvedCity}`,
        beneficiaryCity: resolvedCountry,
        charges: "OUR",
        ...beneficiaryProps,
        beneficiaryAddress1: addrLine1,
        beneficiaryAddress2: addrLine2,
        beneficiaryCityName: city,
        beneficiaryPostCode: postCode,
        beneficiaryCountryIsoCode: countryCode,
        // 50
        orderCustomerName: fmLongName,
        orderCustomerAddress: `${resolvedAddrLine1} ${resolvedAddrLine2} ${resolvedCity}`,
        orderCustomerCity: resolvedCountry,
        orderCustomerAccount: fmId, // FMID
        orderCustomerAddress1: addrLine1,
        orderCustomerAddress2: addrLine2,
        orderCustomerCityName: city,
        orderCustomerPostCode: postCode,
        orderCustomerCountryIsoCode: countryCode,
      };
      setVostroFormFieldsValue(newVostroData);
      forceRefreshAfterAutoPopulate(newVostroData);
    } else if (changes.swiftType === "MT202") {
      const { fmSysContact } = counterPartyDetails;
      const { addrLine } =
        fmSysContact?.find(
          (i) => i.mediumCode === "SWIFT" && i.mediumUsage === "MAIN"
        ) ?? {};

      const newVostroData = {
        ssiType: "Primary",
        // 59
        beneficiaryBic: addrLine,
        beneficiaryAddress: "",
        beneficiaryCity: "",
        charges: "",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress1: "",
        beneficiaryAddress2: "",
        beneficiaryCityName: "",
        beneficiaryPostCode: "",
        beneficiaryCountryIsoCode: "",
        // 50
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        orderCustomerAddress1: "",
        orderCustomerAddress2: "",
        orderCustomerCityName: "",
        orderCustomerPostCode: "",
        orderCustomerCountryIsoCode: "",
      };
      setVostroFormFieldsValue(newVostroData);
      forceRefreshAfterAutoPopulate(newVostroData);
    }
  }
};

const form = forwardRef<RefStructType, VostroFormProps>(
  (
    {
      data,
      disable,
      actions,
      onTriggerAction,
      setVostroFormFieldsValue,
      counterPartyDetails,
      cashflowDetails,
      nostroDetailsData,
    },
    ref
  ) => {
    const [ruleContext, setRuleContext] = useState<PopRuleFnParam | null>(null);
    const [currentFormData, setCurrentFormData] = useState<any>({});
    const layoutSetting = useContext(layoutSettingContext);

    const handleChange = useCallback(
      (changes: any = {}, formData: any = {}) => {
        if (Object.keys(formData).length === 0) return;
        // only invovled fields can trigger update
        // when covered payment set to Y, it may be empty in 54 BIC, so excludes it.
        setCurrentFormData(formData);
        handleCoveredPayment(changes, formData, setVostroFormFieldsValue);
        handleAutoPopulate(
          changes,
          counterPartyDetails,
          setVostroFormFieldsValue,
          (data) => {
            (ref as React.RefObject<RefStructType>).current?.valuesChange?.(
              data
            );
          }
        );
      },
      [counterPartyDetails]
    );

    const extraInfoDisplay = useMemo(() => {
      const res: { label: string; value: string }[] = [];
      res.push({ label: "SSI ID", value: data?.ssiId ?? "" });
      res.push({ label: "Settlement Code", value: data?.settlementCode ?? "" });
      return res;
    }, [data]);

    const populateRuleHandler = useCallback(({ rules, updateRules }) => {
      setRuleContext({ rules, updateRules });
    }, []);

    useEffect(() => {
      if (!ruleContext || !cashflowDetails) return;

      const { rules, updateRules } = ruleContext;
      if (!rules || !updateRules) return;
      /**
       * handle Adhoc SSI vostro rules
       */
      AdhocSSIHandlerFunction(
        {
          layoutTitle: layoutSetting?.title,
          originalVostroData: data,
          currentVostroData: currentFormData,
          nostroDetailsData,
          cashflowDetails,
          rules,
        },
        {
          setVostroFormFieldsValue,
          updateRules,
        }
      );
    }, [
      ruleContext,
      currentFormData,
      cashflowDetails,
      nostroDetailsData,
      layoutSetting,
      data,
    ]);

    return data ? (
      <CustomFormGroup
        ref={ref}
        className={classes.form}
        formName={MultiExceptionsFormNames.VostroForm}
        defaultData={data}
        formConfig={SSI_DETAILS_CONFIG_CN_COPY}
        onChange={handleChange}
        editable={!disable}
        validationRuleName="EXCEPTION_SSI"
        isCashflowSettlementCN
        populateRules={populateRuleHandler}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack
            className={classes.infodisplay}
            direction="row"
            alignItems="center"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            {extraInfoDisplay.map((i) => (
              <span key={i.label}>
                {i.label} : {i.value}
              </span>
            ))}
          </Stack>
          <Stack className={classes.operations} direction="row-reverse">
            {actions.map((a) => {
              if (!editingActions.includes(a) || disable) {
                return (
                  <Button
                    variant="contained"
                    data-testid={get_MULTI_EXCEPTION_VOSTRO_FORM_ACTION(a)}
                    onClick={() => onTriggerAction(a)}
                    key={a}
                  >
                    {a}
                  </Button>
                );
              }
            })}
          </Stack>
        </Stack>
      </CustomFormGroup>
    ) : null;
  }
);

export default form;
