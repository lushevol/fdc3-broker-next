import { getEnable } from "../../../ratanutils/componentEnabling";
import { conversionDQSLRequest } from "../../../ratanutils/conversion";
export const COUNTERPARTY_DETAILS_CONFIG: any = [
  {
    label: "Company",
    name: "",
    isTwoFields: true,
    detail: [
      { key: "LE ID", value: "fmEntity.legalEntity.leId" },
      { key: "LEI", value: "fmEntity.legalEntity.regulatoryInfo.lei" },
      { key: "Sub-profile ID", value: "fmEntity.fmAccount.subProfileId" },
      { key: "FMID", value: "fmEntity.fmAccount.fmId" },
      { key: "Parent FMID", value: "fmEntity.fmHierarchy.parentFmId" },
      { key: "OMGEO Code", value: "fmEntity.fmAccount.omgAlertId" },
      {
        key: "RM Name",
        value:
          "fmEntity.legalEntity.legalEntityOrgDetails.empRelationship.empCode",
      },
      {
        key: "Tax code",
        value:
          "fmEntity.legalEntity.legalEntityOrgDetails.clientTax.typeOfDocumentValue",
      },
      {
        key: "Expiry Date",
        value:
          "fmEntity.legalEntity.legalEntityOrgDetails.clientTax.expiryDateOfDocument",
      },
    ],
  },
  {
    label: "Country",
    name: "",
    isTwoFields: true,
    detail: [
      {
        key: "Country of Domicile",
        value: "fmEntity.legalEntity.legalEntityOrgDetails.domicileCountry",
      },
      {
        key: "Country of Incorporation",
        value: "fmEntity.legalEntity.incorporatedCountry",
      },
    ],
  },
  {
    label: "Segment",
    name: "",
    isTwoFields: false,
    detail: [
      {
        key: "Sub Segment Code",
        value: "fmEntity.legalEntity.subSegmentCodeValue",
      },
    ],
  },
  {
    label: "Contact Details",
    name: "",
    isTwoFields: true,
    detail: [
      {
        key: "Registered Address",
        value: "",
        isPop: true,
        isPart: true,
        popDetail: [
          {
            key: "Address Line 1",
            value: "fmEntity.legalEntity.registeredAddress.line1",
          },
          {
            key: "Address Line 2",
            value: "fmEntity.legalEntity.registeredAddress.line2",
          },
          { key: "City", value: "fmEntity.legalEntity.registeredAddress.city" },
          {
            key: "State",
            value: "fmEntity.legalEntity.registeredAddress.state",
          },
          {
            key: "Country",
            value: "fmEntity.legalEntity.registeredAddress.country",
          },
          {
            key: "Postal Code",
            value: "fmEntity.legalEntity.registeredAddress.postCode",
          },
        ],
      },
      {
        key: "Official Address",
        value: "",
        isPop: true,
        isPart: true,
        popDetail: [
          {
            key: "Address Line 1",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.line1",
          },
          {
            key: "Address Line 2",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.line2",
          },
          {
            key: "City",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.city",
          },
          {
            key: "State",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.state",
          },
          {
            key: "Country",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.country",
          },
          {
            key: "Postal Code",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.postCode",
          },
          {
            key: "Phone",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.phone",
          },
          {
            key: "Email",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.email",
          },
          {
            key: "Fax",
            value:
              "fmEntity.legalEntity.legalEntityOrgDetails.officialAddress.fax",
          },
        ],
      },
      {
        key: "Contacts",
        value: "",
        isPop: true,
        popDetail: [
          { key: "Product", value: "" },
          { key: "Document Type", value: "" },
          { key: "Delivery Type", value: "" },
          { key: "Address", value: "" },
          { key: "Contact Name", value: "" },
          { key: "Status", value: "" },
        ],
      },
    ],
  },
  {
    label: "Category",
    name: "",
    isTwoFields: true,
    detail: [
      // update: 21.09.20 We can use creditGradeCodeValue instead to figure out whether it's a GSAM Client
      {
        key: "GSAM Client",
        value: "fmEntity.legalEntity.creditGrade.creditGradeCodeValue",
      },
      //  { key: 'Private Bank Client', value: 'legalEntity.segmentCodeValue' },
      { key: "RMF", value: "fmEntity.fmAccount.rmfFlag" },
      { key: "Internal Cpty", value: "fmEntity.legalEntity.scbGroupEntity" },
    ],
  },
  {
    label: "Regulatory Classification",
    name: "",
    isTwoFields: true,
    detail: [
      {
        key: "Dodd-Frank Compliant",
        value: "fmEntity.legalEntity.doddFrankDetails.dfComplaint",
      },
      {
        key: "Dodd Frank Entity Type",
        value: "fmEntity.legalEntity.doddFrankDetails.doddFrankEntityTypeValue",
      },
      {
        key: "Dodd-Frank Incorporation Country",
        value: "fmEntity.legalEntity.dfIncCntryIsoCode",
      },
      {
        key: "Dodd-Frank US Person",
        value: "fmEntity.legalEntity.doddFrankDetails.usPerson",
      },
      {
        key: "Trading Status",
        value: "fmEntity.legalEntity.doddFrankDetails.tradestatusvalue",
      },
      {
        key: "Initial Margin Method",
        value: "fmEntity.legalEntity.doddFrankDetails.intialMarginMethod",
      },
      {
        key: "EMIR Assignment",
        value: "fmEntity.legalEntity.regulatoryInfo.emirAssignment",
      },
      {
        key: "EMIR Classification Status",
        value: "fmEntity.legalEntity.regulatoryInfo.emirClassification",
      },
      {
        key: "EMIR Clearing Category",
        value: "fmEntity.legalEntity.regulatoryInfo.emirClearing",
      },
      {
        key: "HK Clearing Classification",
        value: "fmEntity.legalEntity.regulatoryInfo.hkClearing",
      },
      {
        key: "MiFID Classification",
        value: "fmEntity.legalEntity.mifidClntClasValue",
      },
      {
        key: "MAS Classification",
        value: "fmEntity.legalEntity.regulatoryInfo.masClassification",
      },
    ],
  },
  {
    label: "Legal Agreements",
    name: "",
    isTwoFields: true,
    detail: [
      {
        key: "Master Agreement",
        value: "",
        isPop: true,
        popDetail: [
          { key: "Agreement Type", value: "" },
          { key: "Agreement Version", value: "" },
          { key: "Status", value: "" },
          { key: "Agreement Date", value: "" },
          { key: "Calculation Agent", value: "" },
          { key: "SCB Entity", value: "" },
        ],
      },
      {
        key: "Give Up",
        value: "",
        isPop: true,
        popDetail: [
          { key: "Document Name", value: "" },
          { key: "Agreement Date", value: "" },
          { key: "SCB Entity", value: "" },
          { key: "Status", value: "" },
        ],
      },
      {
        key: "FX Terms",
        value: "",
        isPop: true,
        popDetail: [
          { key: "Status", value: "" },
          { key: "Agreement Date", value: "" },
          { key: "SCB Entity", value: "" },
        ],
      },
      {
        key: "Clearing",
        value: "",
        isPop: true,
        popDetail: [
          { key: "Document Name", value: "" },
          { key: "Agreement Date", value: "" },
          { key: "SCB Entity", value: "" },
          { key: "Status", value: "" },
        ],
      },
      {
        key: "Credit Support Annex",
        value: "",
        isPop: true,
        popDetail: [
          { key: "CSA Status", value: "" },
          { key: "Date of CSA", value: "" },
          { key: "One Way or Bilateral", value: "" },
          { key: "SCB Entity", value: "" },
        ],
      },
      {
        key: "Intermediation",
        value: "",
        isPop: true,
        popDetail: [
          { key: "Document Name", value: "" },
          { key: "Agreement Date", value: "" },
          { key: "SCB Entity", value: "" },
          { key: "Status", value: "" },
          { key: "FX and Rates", value: "" },
        ],
      },
    ],
  },
  {
    label: "Settlement",
    name: "",
    isTwoFields: true,
    detail: [
      {
        key: "Netting rules table",
        value: "fmEntity.fmScbInfo.nettingAllowed",
      },
      { key: "Is CLS Eligible", value: "fmEntity.fmAccount.clsEigibility" },
      { key: "CLS Start Date", value: "fmEntity.fmAccount.clsStartDate" },
      { key: "DVP Cpty", value: "fmEntity.fmAccount.dvpCustInd" },
    ],
  },
];

// extract fields from config to make up query.
export const extractFields = (initialObj: any, arr: Array<any>) => {
  initialObj.forEach((item: any) => {
    if (item.name) {
      const temp = arr.filter((val: any) => {
        return val.indexedTerm === item.name;
      });
      if (temp.length === 0) {
        arr.push({ indexedTerm: item.name });
      }
    }
    // Counterparty_Name is from other data source.
    // regulatoryInfo parsed from array, assgin matched row data to specify field.
    if (
      item.value &&
      item.value !== "Counterparty_Name" &&
      !item.value.includes("fmEntity.legalEntity.regulatoryInfo")
    ) {
      const temp = arr.filter((val: any) => {
        return val.indexedTerm === item.value;
      });
      if (temp.length === 0) {
        arr.push({ indexedTerm: item.value });
      }
    }
    if (item.detail && item.detail.length > 0) {
      extractFields(item.detail, arr);
    }
    if (item.popDetail && item.popDetail.length > 0) {
      extractFields(item.popDetail, arr);
    }
  });
  arr.push({
    indexedTerm: "fmEntity.legalEntity.regulatoryInfo.regulatoryTypeValue",
  });
  arr.push({
    indexedTerm: "fmEntity.legalEntity.regulatoryInfo.regulatoryFields",
  });
  arr.push({
    indexedTerm: "fmEntity.legalEntity.regulatoryInfo.regulatoryField2Value",
  });
  arr.push({
    indexedTerm: "fmEntity.legalEntity.regulatoryInfo.regulatoryFieldText",
  });
  arr.push({
    indexedTerm: "fmEntity.fmSysContact.mediumUsage",
  });
  return arr;
};

if (getEnable("New_Counterparty_Fields")) {
  COUNTERPARTY_DETAILS_CONFIG.unshift({
    label: "Client",
    name: "fmEntity.legalEntity.legalName",
    isTwoFields: true,
    detail: [
      { key: "FM ID", value: "fmEntity.fmAccount.fmId" },
      { key: "FMCODE", value: "fmEntity.fmAccount.fmCode" },
      {
        key: "Legal Name",
        value: "fmEntity.legalEntity.legalName",
      },
      { key: "FmType", value: "fmEntity.fmAccount.fmType" },
      { key: "Long Name", value: "fmEntity.fmAccount.fmLongName" },
      {
        key: "SWIFT BIC",
        value: "fmEntity.fmSysContact.addrLine",
      },
      {
        key: "Short Name",
        value: "fmEntity.legalEntity.shortName",
      },
    ],
  });
} else {
  COUNTERPARTY_DETAILS_CONFIG.unshift({
    label: "Client",
    name: "fmEntity.legalEntity.legalName",
    isTwoFields: false,
    detail: [
      { key: "FM ID", value: "fmEntity.fmAccount.fmId" },
      { key: "Counterparty ShortName", value: "Counterparty_Name" },
    ],
  });
}

export const counterpartyQueryStr = conversionDQSLRequest({
  businessFields: extractFields(COUNTERPARTY_DETAILS_CONFIG, []),
  isAllFields: true,
});

export const counterpartyQueryStrForCN = conversionDQSLRequest({
  businessFields: [
    {
      indexedTerm: "fmEntity.fmAccount.fmId",
    },
    {
      indexedTerm: "fmEntity.fmAccount.fmLongName",
    },
    {
      indexedTerm: "fmEntity.fmAddress.addrType",
    },
    {
      indexedTerm: "fmEntity.fmAddress.addrLine1",
    },
    {
      indexedTerm: "fmEntity.fmAddress.city",
    },
    {
      indexedTerm: "fmEntity.fmAddress.country",
    },
    {
      indexedTerm: "fmEntity.fmSysContact.addrLine",
    },
    {
      indexedTerm: "fmEntity.fmSysContact.mediumUsage",
    },
    {
      indexedTerm: "fmEntity.fmSysContact.mediumCode",
    },
  ],
  isAllFields: true,
});
