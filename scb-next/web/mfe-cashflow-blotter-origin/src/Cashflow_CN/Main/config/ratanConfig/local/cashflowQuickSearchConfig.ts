import { CashflowSubStateTypes } from "../../../../components/CashflowDetails/MultiExceptions/common/interface";
import { BookingEntityNameIdOptions } from "./BookingEntity";

export const CurrencyList = [
  "HKD",
  "INO",
  "CNY",
  "AUD",
  "INR",
  "ALL",
  "CHF",
  "CNH",
  "CAD",
  "KRW",
  "EUR",
  "SAR",
  "NPR",
  "TOP",
  "XAF",
  "BHD",
  "MYO",
  "SGD",
  "QAR",
  "JPY",
  "GBP",
  "CNO",
  "FJD",
  "EGO",
  "AED",
  "EGP",
  "USD",
  "PHP",
  "XAU",
  "XAG",
  "XPD",
  "XPT",
  "XRH",
  "XU5",
  "XG2",
  "XT3",
  "XD3",
  "XRU",
  "XS9",
  "XS5",
  "XSD",
  "XU6",
  "XU7",
  "XG5",
  "XUC",
  "XG3",
  "XGC",
  "XD1",
  "XD2",
  "XG1",
  "XR1",
  "XT1",
  "XT2",
  "XU1",
  "XU2",
  "XU3",
  "XU4",
  "XU8",
  "XTN",
  "XDN",
  "XUD",
  "XG4",
  "XG6",
  "XGF",
  "XS6",
  "XSF",
  "XSI",
  "XS4",
  "XGI",
  "XGA",
  "XG7",
  "GHS",
  "IDO",
  "MXN",
  "NGX",
  "NZD",
  "PLN",
  "TRY",
  "CLF",
  "KRO",
  "KEH",
  "ZMH",
  "UGH",
  "TZH",
  "GHH",
  "NGH",
  "NGO",
  "NGY",
  "LKO",
  "LKH",
  "VNO",
  "PKH",
  "PKO",
  "BDO",
  "KES",
  "ZMW",
  "UGX",
  "TZS",
  "NGN",
  "NGA",
  "NGB",
  "LKR",
  "VND",
  "PKR",
  "BDT",
];

const config = {
  quickSearchLabelWidth: 175,
  quickSearchFormWidth: 240,
  quickSearchItemsCN: [
    {
      label: "Cashflow ID",
      field: "Cashflow.Cashflow_Id",
      component: "QuickSearchInput",
      placeholder: "Multiple searches separated by commas",
    },
    {
      component: "QuickSearchManyInOne",
      manyInOne: [
        {
          label: "Trade ID",
          field: "Trade_Id",
          component: "QuickSearchInput",
        },
        {
          label: "Original Trade ID",
          field: "BCS_Parent_Trade_Id",
          component: "QuickSearchInput",
        },
      ],
    },
    {
      label: "Value Date Range",
      field: "Cashflow.Payment_Date",
      component: "QuickSearchPicker",
    },
    {
      label: "Currency",
      field: "Cashflow.Payment_Currency",
      component: "QuickSearchAutoComplete",
      valueList: CurrencyList,
    },
    {
      label: "Product Taxonomy",
      field: "PRODUCT_TAXONOMY",
      component: "QuickSearchSelect",
      selectMode: "tags",
      valueList: [
        {
          label: "ForeignExchange:Forward",
          value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:Forward",
        },

        {
          label: "ForeignExchange:Spot",
          value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:Spot",
        },
        {
          label: "ForeignExchange:Swap",
          value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:Swap",
        },
        {
          label: "ForeignExchange:VanillaOption",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:VanillaOption",
        },
        {
          label: "ForeignExchange:SimpleExotic:Digital",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:SimpleExotic:Digital",
        },
        {
          label: "ForeignExchange:NDF",
          value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:NDF",
        },
        {
          label: "ForeignExchange:NDO",
          value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:NDO",
        },
        {
          label: "ForeignExchange:SimpleExotic:Barrier",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:SimpleExotic:Barrier",
        },
        {
          label: "IRD|IRS|Structured Swap|FX_QUANTO_RA_DI",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/IRD|IRS|Structured Swap|FX_QUANTO_RA_DI",
        },
        {
          label: "IRD|IRS|Vanilla IR Swap",
          value: "Instrument_Common.ISDA_Taxonomy/_/IRD|IRS|Vanilla IR Swap",
        },
        {
          label: "IRD|IRS",
          value: "Instrument_Common.ISDA_Taxonomy/_/IRD|IRS",
        },
        {
          label: "CURR|FXD|FXD",
          value: "Instrument_Common.ISDA_Taxonomy/_/CURR|FXD|FXD",
        },
        {
          label: "IRD|LN_BR",
          value: "Instrument_Common.ISDA_Taxonomy/_/IRD|LN_BR",
        },
        {
          label: "IRD|CS",
          value: "Instrument_Common.ISDA_Taxonomy/_/IRD|CS",
        },
        {
          label: "CURR|FXD|XSW",
          value: "Instrument_Common.ISDA_Taxonomy/_/CURR|FXD|XSW",
        },
        {
          label: "CRD|RTRS",
          value: "Instrument_Common.ISDA_Taxonomy/_/CRD|RTRS",
        },
        {
          label: "COM|SWAP",
          value: "Instrument_Common.ISDA_Taxonomy/_/COM|SWAP",
        },
        {
          label: "IRD|BOND",
          value: "Instrument_Common.ISDA_Taxonomy/_/IRD|BOND",
        },
        {
          label: "SCF|SCF|SCF",
          value: "Instrument_Common.ISDA_Taxonomy/_/SCF|SCF|SCF",
        },
        {
          label: "CURR|OPT|SMP",
          value: "Instrument_Common.ISDA_Taxonomy/_/CURR|OPT|SMP",
        },
        {
          label: "CURR|OPT|ASN",
          value: "Instrument_Common.ISDA_Taxonomy/_/CURR|OPT|ASN",
        },
        {
          label: "Simple Cashflow (SCF)",
          value: "Instrument_Common.Primary_Asset_Class/_/Cash",
        },
        {
          label: "InterestRate:IRSwap:FixedFloat",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:IRSwap:FixedFloat",
        },
        {
          label: "InterestRate:IRSwap:OIS",
          value: "Instrument_Common.ISDA_Taxonomy/_/InterestRate:IRSwap:OIS",
        },
        {
          label: "InterestRate:IRSwap:Basis",
          value: "Instrument_Common.ISDA_Taxonomy/_/InterestRate:IRSwap:Basis",
        },
        {
          label: "InterestRate:IRSwap:FixedFixed",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:IRSwap:FixedFixed",
        },
        {
          label: "InterestRate:IRSwap:FloatFloat",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:IRSwap:FloatFloat",
        },
        {
          label: "InterestRate:CrossCurrency:FixedFloat",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:CrossCurrency:FixedFloat",
        },
        {
          label: "InterestRate:CrossCurrency:Basis",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:CrossCurrency:Basis",
        },
        {
          label: "InterestRate:CrossCurrency:FixedFixed",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:CrossCurrency:FixedFixed",
        },
        {
          label: "InterestRate:CrossCurrency:FloatFloat",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/InterestRate:CrossCurrency:FloatFloat",
        },
        {
          label: "InterestRate:LoanDeposit",
          value: "Instrument_Common.ISDA_Taxonomy/_/InterestRate:LoanDeposit",
        },
        {
          label: "Credit:Loans:TermLoan",
          value: "Instrument_Common.ISDA_Taxonomy/_/Credit:Loans:TermLoan",
        },
        {
          label: "Credit:Loans:RevolvingTermLoan",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/Credit:Loans:RevolvingTermLoan",
        },
        {
          label: "Commodity:Metals:Precious:SpotFwd:Physical",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/Commodity:Metals:Precious:SpotFwd:Physical",
        },
        {
          label: "Commodity:Metals:Precious:SpotFwd:Cash",
          value:
            "Instrument_Common.ISDA_Taxonomy/_/Commodity:Metals:Precious:SpotFwd:Cash",
        },
        {
          label: "InterestRate:FRA",
          value: "Instrument_Common.ISDA_Taxonomy/_/InterestRate:FRA",
        },
      ],
    },
    {
      component: "QuickSearchManyInOne",
      manyInOne: [
        {
          label: "Counterparty FMCODE",
          field: "Entity.Counterparty_SCI_FMCODE",
          component: "QuickSearchInput",
          commas: true,
          placeholder: "Multiple searches separated by commas",
        },
        {
          label: "Counterparty FMID",
          field: "Entity.Counterparty_SCI_FMID",
          component: "QuickSearchInput",
          commas: true,
          placeholder: "Multiple searches separated by commas",
        },
      ],
    },
    {
      component: "QuickSearchManyInOne",
      manyInOne: [
        {
          label: "SCB Booking Entity",
          field: "Entity.Booking_Entity_SCI_FMID",
          component: "QuickSearchSelect",
          valueList: BookingEntityNameIdOptions,
        },
        {
          label: "SCB Booking Entity FMID",
          field: "Entity.Booking_Entity_SCI_FMID",
          component: "QuickSearchInput",
        },
      ],
    },
    {
      label: "Beneficiary Name",
      field: "Settlement_Instruction.Account.Beneficiary_Account_Name",
      component: "QuickSearchInput",
    },
    {
      label: "Beneficiary Account BIC Code",
      field: "Settlement_Instruction.Account.Beneficiary_BIC_code",
      component: "QuickSearchInput",
    },
    {
      label: "Cashflow State",
      field: "Cashflow.Cashflow_State",
      component: "QuickSearchSelect",
      selectMode: "tags",
      valueList: [],
    },
    {
      label: "Cashflow Sub State",
      field: "Cashflow.Cashflow_Sub_State",
      component: "QuickSearchSelect",
      valueList: [
        {
          label: CashflowSubStateTypes.PendingOperator,
          value: CashflowSubStateTypes.PendingOperator,
        },
        {
          label: CashflowSubStateTypes.PendingVerification,
          value: CashflowSubStateTypes.PendingVerification,
        },
      ],
    },
  ],
};

export default config;
