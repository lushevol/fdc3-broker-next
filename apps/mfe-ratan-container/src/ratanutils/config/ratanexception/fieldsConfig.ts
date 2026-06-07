import {
  queryCounterPartyDetails,
  queryFmidOrCounterpartyList,
} from "../../http/graphql";
import { CustomFormConfigProps } from "../../../ratancomponents/CustomForm/FormItemComponents";
import { MessageInstance } from "antd/es/message/interface";

const fmidConfig: any = {
  beneficiaryFields: {
    beneficiaryName: "lmp_long_name",
    beneficiaryCity: "lsp_dmcl_cntry_iso_code",
    beneficiaryAddress: "fla_address_line_1",
  },
  orderingCustomerFields: {
    orderCustomerName: "lmp_long_name",
    orderCustomerCity: "lsp_dmcl_cntry_iso_code",
    orderCustomerAddress: "fla_address_line_1",
  },
};

export const handleSearchResponse = (messageApi) => (res: any) => {
  const data = res.searchCounterParty;
  let fmidOptions = null;
  if (data && data.length > 0) {
    fmidOptions = data.map((item: any) => {
      return {
        label: `${item.fm_profile_sys_gen_id} - ${item.lmp_long_name}`,
        value: item.fm_profile_sys_gen_id,
      };
    });
  } else {
    messageApi && messageApi.info("No data found");
  }
  return fmidOptions;
};

/**
 *
 * @param searchTerm
 * @param config  do not remove this param @Auth Tech
 * @param messageApi
 * @returns
 */
export const searchFmid = (
  searchTerm: string,
  config: CustomFormConfigProps[],
  messageApi: MessageInstance
) => {
  return queryFmidOrCounterpartyList(searchTerm).then(
    handleSearchResponse(messageApi)
  );
};

export const handleSelectFmidResponse =
  (fields: any, configs: CustomFormConfigProps[], form: any) => (res: any) => {
    const data = res.counterPartyDetails;
    if (data) {
      return configs.map((item: CustomFormConfigProps) => {
        const realFields = fields[item.field];
        if (realFields) {
          form.setFieldsValue({ [item.field]: data[realFields] });
          item.disabled = true;
        }
        return item;
      });
    }
    return null;
  };

export const selectFmid = (
  fields: any,
  value: string,
  configs: CustomFormConfigProps[],
  form: any
) => {
  return queryCounterPartyDetails(value, true).then(
    handleSelectFmidResponse(fields, configs, form)
  );
};

export const clear = (
  fields: any,
  configs: CustomFormConfigProps[],
  form: any
) => {
  return configs.map((item: CustomFormConfigProps) => {
    const realFields = fields[item.field];
    if (typeof realFields !== "undefined") {
      form.setFieldsValue({ [item.field]: undefined });
      item.disabled = false;
    }
    return item;
  });
};

export const SSI_DETAILS_CONFIG: CustomFormConfigProps[] = [
  {
    field: "ssiType",
    label: "SSI Type",
    componentType: "SelectItem",
    options: [
      {
        label: "Primary",
        value: "Primary",
      },
      {
        label: "Secondary",
        value: "Secondary",
      },
    ],
  },
  {
    field: "swiftType",
    label: "Msg",
    componentType: "SelectItem",
    options: [
      {
        label: "MT103",
        value: "MT103",
      },
      {
        label: "MT202",
        value: "MT202",
      },
      {
        label: "MT103 SERIAL",
        value: "MT103 SERIAL",
      },
    ],
    onChange: (value: string, configs: CustomFormConfigProps[]) => {
      return configs.map((item: any) => {
        if (item.field === "orderCustomerBic") {
          if (value === "MT202") {
            item.title = "52A Ordering Institution";
          } else {
            item.title = "50a: Ordering Customer";
          }
        } else if (item.field === "beneficiaryBic") {
          if (value === "MT202") {
            item.title = "58a: Beneficiary Customer";
          } else {
            item.title = "59a: Beneficiary Customer";
          }
        }
        return item;
      });
    },
  },
  {
    field: "settlementMeans",
    label: "Settlement Means",
    componentType: "SelectItem",
    options: [
      {
        label: "NOS",
        value: "NOS",
      },
      {
        label: "Over Account",
        value: "Over-Account",
      },
      {
        label: "FXBRREC",
        value: "FXBRREC",
      },
      {
        label: "CLG",
        value: "CLG",
      },
      {
        label: "CLS SUSP",
        value: "CLS SUSP",
      },
      {
        label: "CPN SUSP",
        value: "CPN SUSP",
      },
      {
        label: "FATCASUS",
        value: "FATCASUS",
      },
      {
        label: "GBFXSUS",
        value: "GBFXSUS",
      },
      {
        label: "HKCT",
        value: "HKCT",
      },
      {
        label: "HKNOTE",
        value: "HKNOTE",
      },
      {
        label: "MMSUS",
        value: "MMSUS",
      },
      {
        label: "NOSCENT",
        value: "NOSCENT",
      },
      {
        label: "Non Nostro",
        value: "Non-Nostro",
      },
      {
        label: "TBFXSUS",
        value: "TBFXSUS",
      },
      {
        label: "WMSUS",
        value: "WMSUS",
      },
    ],
  },
  {
    field: "settlementAccount",
    label: "Settlement Account",
    hasDivider: true,
  },
  {
    field: "beneficiaryFields",
    label: "FMID | Counterparty",
    componentType: "SelectItem",
    options: [],
    placeholder: "Search...",
    onSearch: searchFmid,
    onChange: selectFmid.bind(this, fmidConfig.beneficiaryFields),
    notSubmit: true,
  },
  {
    field: "beneficiaryBic",
    label: "BIC",
    title: "58a: Beneficiary Customer",
  },
  {
    field: "beneficiaryName",
    label: "Full Name",
  },
  {
    field: "beneficiaryName2",
    label: "Full Name1",
  },
  {
    field: "beneficiaryAddress",
    label: "Address",
  },
  {
    field: "beneficiaryCity",
    label: "City & Post Code",
  },
  {
    field: "beneficiaryAccount",
    label: "Account",
  },
  {
    field: "tradingCurrency",
    label: "Trading Currency",
    hidden: true,
  },
  {
    field: "isThirdpartyPayment",
    label: "TPP",
    componentType: "CheckboxItem",
  },
  {
    field: "coveredPayment",
    label: "Covered Payment",
    componentType: "CheckboxItem",
  },
  {
    field: "charges",
    label: "Charges Bearer",
    hasDivider: true,
    componentType: "SelectItem",
    options: [
      {
        label: "OUR",
        value: "OUR",
      },
      {
        label: "BEN",
        value: "BEN",
      },
      {
        label: "SHA",
        value: "SHA",
      },
    ],
  },
  {
    field: "accountWithInstitutionBic",
    label: "BIC",
    title: "57a: Account With Institution",
  },
  {
    field: "accountWithInstitutionName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "accountWithInstitutionAddress",
    label: "Address",
  },
  {
    field: "accountWithInstitutionCity",
    label: "City & Post Code",
  },
  {
    field: "accountWithInstitutionAccount",
    label: "Account",
    hasBr: true,
  },
  {
    field: "intermediaryBic",
    label: "BIC",
    title: "56a: Intermediary Institution",
  },
  {
    field: "intermediaryName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "intermediaryAddress",
    label: "Address",
  },
  {
    field: "intermediaryPostcode",
    label: "City & Post Code",
  },
  {
    field: "intermediaryAccount",
    label: "Account",
    hasBr: true,
  },
  {
    field: "receiversCorrespondentBic",
    label: "BIC",
    title: "54a: Receiver's Correspondent",
  },
  {
    field: "receiversCorrespondentName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "receiversCorrespondentAddress",
    label: "Address",
  },
  {
    field: "receiversCorrespondentCity",
    label: "City & Post Code",
  },
  {
    field: "receiversCorrespondentAccount",
    label: "Account",
    hasBr: true,
  },
  {
    field: "cmsAccount",
    label: "CMS Account",
    hasDivider: true,
  },
  {
    field: "orderingCustomerFields",
    label: "FMID | Counterparty",
    componentType: "SelectItem",
    options: [],
    placeholder: "Search...",
    onSearch: searchFmid,
    onChange: selectFmid.bind(this, fmidConfig.orderingCustomerFields),
    buttonText: "Clear",
    onClick: clear.bind(this, {
      ...fmidConfig.orderingCustomerFields,
      orderingCustomerFields: "",
    }),
    notSubmit: true,
  },
  {
    field: "orderCustomerBic",
    label: "BIC",
    title: "50a: Ordering Customer",
  },
  {
    field: "orderCustomerName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "orderCustomerAddress",
    label: "Address",
  },
  {
    field: "orderCustomerCity",
    label: "City & Post Code",
  },
  {
    field: "orderCustomerAccount",
    label: "Account",
    hasDivider: true,
  },
  {
    field: "senderToReceiver1",
    label: "72: Sender To Reciever 1",
    title: "ADDITIONAL INFORMATION",
  },
  {
    field: "senderToReceiver2",
    label: "72: Sender To Reciever 2",
  },
  {
    field: "senderToReceiver3",
    label: "72: Sender To Reciever 3",
  },
  {
    field: "senderToReceiver4",
    label: "72: Sender To Reciever 4",
  },
  {
    field: "senderToReceiver5",
    label: "72: Sender To Reciever 5",
  },
  {
    field: "senderToReceiver6",
    label: "72: Sender To Reciever 6",
  },
  {
    field: "remittanceInformation1",
    label: "70: Remittance Information 1",
  },
  {
    field: "remittanceInformation2",
    label: "70: Remittance Information 2",
  },
  {
    field: "remittanceInformation3",
    label: "70: Remittance Information 3",
  },
  {
    field: "remittanceInformation4",
    label: "70: Remittance Information 4",
  },
];

export const SSI_DETAILS_CONFIG_CN: CustomFormConfigProps[] = [
  {
    field: "ssiType",
    label: "SSI Type",
    componentType: "SelectItem",
    options: [
      {
        label: "Primary",
        value: "Primary",
      },
      {
        label: "Secondary",
        value: "Secondary",
      },
    ],
  },
  {
    field: "swiftType",
    label: "Msg",
    componentType: "SelectItem",
    options: [
      {
        label: "MT103",
        value: "MT103",
      },
      {
        label: "MT202",
        value: "MT202",
      },
    ],
    onChange: (value: string, configs: CustomFormConfigProps[]) => {
      return configs.map((item: any) => {
        if (item.field === "orderCustomerBic") {
          if (value === "MT202") {
            item.title = "52a: Ordering Institution";
          } else {
            item.title = "50a: Ordering Customer";
          }
        } else if (item.field === "beneficiaryBic") {
          if (value === "MT202") {
            item.title = "58a: Beneficiary Customer";
          } else {
            item.title = "59a: Beneficiary Customer";
          }
        }
        return item;
      });
    },
  },
  {
    field: "settlementMeans",
    label: "Settlement Means",
    componentType: "SelectItem",
    options: [
      {
        label: "NOS",
        value: "NOS",
      },
      {
        label: "Over-Account",
        value: "Over-Account",
      },
      {
        label: "FXBRREC",
        value: "FXBRREC",
      },
      {
        label: "CLG",
        value: "CLG",
      },
      {
        label: "CLS SUSP",
        value: "CLS SUSP",
      },
      {
        label: "CPN SUSP",
        value: "CPN SUSP",
      },
      {
        label: "FATCASUS",
        value: "FATCASUS",
      },
      {
        label: "GBFXSUS",
        value: "GBFXSUS",
      },
      {
        label: "HKCT",
        value: "HKCT",
      },
      {
        label: "HKNOTE",
        value: "HKNOTE",
      },
      {
        label: "MMSUS",
        value: "MMSUS",
      },
      {
        label: "NOSCENT",
        value: "NOSCENT",
      },
      {
        label: "Non Nostro",
        value: "Non-Nostro",
      },
      {
        label: "TBFXSUS",
        value: "TBFXSUS",
      },
      {
        label: "WMSUS",
        value: "WMSUS",
      },
    ],
  },
  {
    field: "settlementAccount",
    label: "Settlement Account",
    hasDivider: true,
  },
  {
    field: "beneficiaryBic",
    label: "BIC",
    title: "58a: Beneficiary Customer",
  },
  {
    field: "beneficiaryName",
    label: "Full Name",
  },
  {
    field: "beneficiaryName2",
    label: "Full Name1",
  },
  {
    field: "beneficiaryAddress",
    label: "Address",
  },
  {
    field: "beneficiaryCity",
    label: "Country",
  },
  {
    field: "beneficiaryAccount",
    label: "Account",
  },
  {
    field: "tradingCurrency",
    label: "Trading Currency",
    hidden: true,
  },
  {
    field: "isThirdPartyPayment",
    label: "TPP",
    componentType: "CheckboxItem",
  },
  {
    field: "coveredPayment",
    label: "Covered Payment",
    componentType: "CheckboxItem",
  },
  {
    field: "charges",
    label: "Charges Bearer",
    hasDivider: true,
    componentType: "SelectItem",
    options: [
      {
        label: "OUR",
        value: "OUR",
      },
      {
        label: "BEN",
        value: "BEN",
      },
      {
        label: "SHA",
        value: "SHA",
      },
    ],
  },
  {
    field: "accountWithInstitutionBic",
    label: "BIC",
    title: "57a: Account With Institution",
  },
  {
    field: "accountWithInstitutionName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "accountWithInstitutionAddress",
    label: "Address",
  },
  {
    field: "accountWithInstitutionCity",
    label: "Country",
  },
  {
    field: "accountWithInstitutionAccount",
    label: "Account",
    hasBr: true,
  },
  {
    field: "intermediaryBic",
    label: "BIC",
    title: "56a: Intermediary Institution",
  },
  {
    field: "intermediaryName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "intermediaryAddress",
    label: "Address",
  },
  {
    field: "intermediaryPostcode",
    label: "Country",
  },
  {
    field: "intermediaryAccount",
    label: "Account",
    hasBr: true,
  },
  {
    field: "receiversCorrespondentBic",
    label: "BIC",
    title: "54a: Receiver's Correspondent",
  },
  {
    field: "receiversCorrespondentName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "receiversCorrespondentAddress",
    label: "Address",
  },
  {
    field: "receiversCorrespondentCity",
    label: "Country",
  },
  {
    field: "receiversCorrespondentAccount",
    label: "Account",
    hasBr: true,
  },
  {
    field: "cmsAccount",
    label: "CMS Account",
    hasDivider: true,
  },
  {
    field: "orderCustomerBic",
    label: "BIC",
    title: "50a: Ordering Customer",
  },
  {
    field: "orderCustomerName",
    label: "Full Name",
    hasBr: true,
  },
  {
    field: "orderCustomerAddress",
    label: "Address",
  },
  {
    field: "orderCustomerCity",
    label: "Country",
  },
  {
    field: "orderCustomerAccount",
    label: "Account",
    hasDivider: true,
  },
  {
    field: "senderToReceiver1",
    label: "72: Sender To Reciever 1",
    title: "ADDITIONAL INFORMATION",
  },
  {
    field: "senderToReceiver2",
    label: "72: Sender To Reciever 2",
  },
  {
    field: "senderToReceiver3",
    label: "72: Sender To Reciever 3",
  },
  {
    field: "senderToReceiver4",
    label: "72: Sender To Reciever 4",
  },
  {
    field: "senderToReceiver5",
    label: "72: Sender To Reciever 5",
  },
  {
    field: "senderToReceiver6",
    label: "72: Sender To Reciever 6",
  },
  {
    field: "remittanceInformation1",
    label: "70: Remittance Inform 1",
  },
  {
    field: "remittanceInformation2",
    label: "70: Remittance Inform 2",
  },
  {
    field: "remittanceInformation3",
    label: "70: Remittance Inform 3",
  },
  {
    field: "remittanceInformation4",
    label: "70: Remittance Inform 4",
  },
];
