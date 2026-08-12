import { renderHook } from "@testing-library/react";

import { ExceptionCategory, MultiExceptionsNames, NonePermission, Submiter, Verifier } from "./interface";
import {
  allowVostroEmptyWhenFixingMissingNostro,
  assembleSubmitRequestBody,
  convertAllStrBoolValueInObjIntoYN,
  convertStrBoolIntoYN,
  dataAccuracyVerification,
  diffObject,
  extractMeaningfulTitleOfSSIException,
  extractSSIValue,
  findIfSubmitByYou,
  generateEmptyNostro,
  generateEmptyVostro,
  getUserProfile,
  getUserRole,
  hasHighRiskExceptionPermission,
  isAdhocSSIException,
  isMakerOrCheckInputFedwire,
  isMissingNostroException,
  isMissingVostroException,
  isMultiVostroException,
  isRebookException,
  isSSIGoodStamping,
  isSSIMissMatchedException,
  isValidateBeneInfoException,
  isVostroFormDataEmpty,
  matchException,
  missingNostroSubmitPreCheck,
  removeSpecialCharacters,
  revertSSI,
  SSILogicModel2OldField,
  SSIOldField2LogicModel,
  toUpperCase,
  trimObject,
  useForwardRef,
  vostroInformExtractWrapper,
} from "./utils";
import * as ratanUtilsMock from "src/Root/import/ratanutils";
vi.mock("src/Root/import/ratanutils", () => ({
  queryGraphql: vi.fn(async () => ({})),
  getUser: vi.fn(() => ({ id: "u1", role: "role1" })),
  hasPermission: vi.fn(() => true),
  getTradeStatusArray: vi.fn(() => []),
  conversionDQSLRequest: vi.fn(() => ""),
}));

vi.mock("../hooks/useData", () => ({
  parseMakerIdFromHistory: vi.fn(() => ["u1"]),
}));

describe("MultiExceptions utils", () => {
  it("assembleSubmitRequestBody should work well", () => {
    const cashflowDetails = {
      BCS_Parent_Trade_Id: "88406196",
      BCS_Trade_Id: null,
      Delivery_Method: "",
      Parent_Trade_Id: "0",
      Position_Id: "",
      Settlement_Method: "Cash",
      Trade_Id: "88406196",
      Trade_State: "TOBESENT",
      Trade_Version: null,
      Cashflow: {
        Cashflow_Id: "M00096673610",
        Cashflow_Business_Version: 0,
        Cashflow_Version: 0,
        Cashflow_State: "WAITING",
        Cashflow_Affirmation_Status: "Unaffirmed",
        Cashflow_Event_Type: "New",
        Cashflow_Minor_Version: 3,
        Payment_Currency: "USD",
        Payment_Date: "2023-08-03",
        Payment_Type: "",
        Payment_Cutoff_Time: "2023-08-02T13:30",
        Pay_Receive_Indicator: "Receive",
        Payment_Amount: "44404973.357000",
        Netting_Id: null,
        Netting_Cuttoff_Date: "null",
        Payment_Receiver_Party_Reference: "party1",
        Payment_Payer_Party_Reference: "party2",
        Cashflow_Sub_State: "Pending Operator",
        Cashflow_Sub_State_Type: "Pending Exception",
        Cashflow_Sub_State_Updater: "System",
        Status_Event_Type: "SsiStamped",
        Event_Date: "2023-09-19",
        Cashflow_Event_Reason: "",
        Booking_System_Event: "New",
      },
      FMO_Comments: null,
      Confirmation: {
        Confirmation_Status: null,
      },
      Entity: {
        Booking_Entity_SCI_FMCODE: "SCB CN CHO*CHO",
        Booking_Entity_SCI_FMID: "400899993",
        Counterparty_SCI_FMID: "10036642",
        Counterparty_SCI_FMCODE: "SCB SHANGH*SHA",
        Counterparty_CIF_Code: null,
        Counterparty_Source_System_Entity_Id: "",
        General_Ledger_Business_Unit_Name: "EM Rates",
        Booking_Entity_General_Ledger_Business_Unit_Id: "",
      },
      Instrument_Common: {
        CFI_Code: "SRXXXX",
        ISDA_Taxonomy: "IRD|CS",
        Source_System_Instrument_Sub_Type: "IRD|CS",
      },
      Settlement_Instruction: {
        Account: {
          SCB_Nostro_Account_Number: "USD MAIN",
          SCB_Nostro_Account_Type: "NOS",
          Beneficiary_BIC_code: "",
          Beneficiary_Account_Name: "",
          Beneficiary_Account_Name_2: "",
          Beneficiary_Street_Address: "",
          Beneficiary_City: "",
          Beneficiary_Account_Number: "",
          Intermediary_BIC_code: "",
          Intermediary_Account_Name: "",
          Intermediary_Street_Address: "",
          Intermediary_City: "",
          Intermediary_Account_Number: "",
          Beneficiary_Bank_BIC_code: "",
          Beneficiary_Bank_Account_Name: "",
          Beneficiary_Bank_Street_Address: "",
          Beneficiary_Bank_City: "",
          Beneficiary_Bank_Account_Number: "",
          Beneficiary_Correspondent_BIC_code: "",
          Beneficiary_Correspondent_Account_Name: "",
          Beneficiary_Correspondent_Street_Address: "",
          Beneficiary_Correspondent_City: "",
          Beneficiary_Correspondent_Account_Number: "",
          Ordering_Customer_BIC_Code: "",
          Ordering_Customer_Account_Name: "",
          Ordering_Customer_Street_Address: "",
          Ordering_Customer_City: "",
          Ordering_Customer_Account_Number: "",
          Counterparty_CMS_Account_Number: "",
          EBBS_Bridge_Account_Number: "800609500058636006",
          EBBS_Account_Number: "800609500058636006",
          Booking_Entity_Correspondent_BIC_code: "SCBLUS33XXX",
          Booking_Entity_Correspondent_Account_Name: "STANCHART NY",
          Booking_Entity_Correspondent_Street_Address:
            "1095 AVENUE OF THE AMERICAS",
          Booking_Entity_Correspondent_City: "NEW YORK",
          Booking_Entity_Correspondent_Account_Number: "",
        },
        SSI_Id: "",
        SSI_Unique_Id: "",
        SSI_Source: "",
        SSI_Priority: "",
        Settlement_Code: null,
        Swift_Message_Type: "",
        CFI_Code: null,
        Payment_Currency: null,
        Counterparty_SCI_FMID: null,
        SCB_Entity_SCI_FMID: null,
        Remittance_Information_1: "",
        Remittance_Information_2: "",
        Remittance_Information_3: "",
        Remittance_Information_4: "",
        Sender_To_Receiver_Information_1: "",
        Sender_To_Receiver_Information_2: "",
        Sender_To_Receiver_Information_3: "",
        Sender_To_Receiver_Information_4: "",
        Sender_To_Receiver_Information_5: "",
        Sender_To_Receiver_Information_6: "",
        Is_Third_Party_Payment: "",
        Swift_Payment_Method: "",
        Swift_Payment_Date: "",
        Charge_Bearer: "",
        Nostro_Swift_Message_Type: "",
      },
      Portfolio: {
        Booking_Entity_Trade_Portfolio_Name: "IR_SWP_HOC_SH",
      },
      Data_Flow: {
        Data_Source_System: "MUREX",
      },
    };
    const exceptions = [
      {
        Id: "1704034037354450944",
        Original_Exception_Id: "Exception_3da76b78-3d9f-4c3f-8a81-477c20223828",
        Exception_Code: "Per SSI Adhoc",
        Exception_Category: "SSI",
        Exception_Type: "BUSINESS",
        Description: "Per_SSIAdhoc_EXCEPTION",
        Status: "INACTIVE",
        Actions: [
          {
            Api_Url:
              "http://ratan-cash-settlement-ssi-stamping-service/v2/adhoc/ssis/makerInput/M00096673610",
            Api_Method: "POST",
            Action_Name: "submit",
            Action_Type: "REST",
            Component_Url: null,
            Component_Name: null,
          },
          {
            Api_Url:
              "http://ratan-cash-settlement-ssi-stamping-service/v2/adhoc/ssis/checker/reject/M00096673610",
            Api_Method: "POST",
            Action_Name: "reject",
            Action_Type: "REST",
            Component_Url: null,
            Component_Name: null,
          },
        ],
        Stashing: {
          Request_Body: null,
          Maker_Id: "",
        },
      },
      {
        Id: "1704034054282645504",
        Original_Exception_Id: "1704034054222454784",
        Exception_Code: "Pending Affirmation",
        Exception_Category: "AFFIRMATION",
        Exception_Type: "BUSINESS",
        Description:
          "Cashflow and trade are not confirmed or affirmed. cashflow affirmation status is Unaffirmed, nettingId is , sourceSystem is MUREX, counterpartyFlag is ",
        Status: "PENDING_OPERATOR",
        Actions: [
          {
            Api_Url: "http://RATAN-RULE-SERVICE/v1/nstpException/submit",
            Api_Method: "POST",
            Action_Name: "submit",
            Action_Type: null,
            Component_Url: null,
            Component_Name: null,
          },
        ],
        Stashing: {
          Request_Body: null,
          Maker_Id: null,
        },
      },
    ];
    const payload = {
      comment: {
        comment: "test",
      },
      affirmation: {
        affirmedBy: "123",
        phone_email: "321",
        affirmedAt: "2023-09-19T15:56:38",
      },
      nostro: {
        settlementMeans: "NOS",
        settlementAccount: "USD MAIN",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53Account: "",
        noticeToReceive: "N",
        ebbsNostroAccount: "800609500058636006",
      },
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "NOS",
        settlementAccount: "USD MAIN",
        beneficiaryBic: "SCBLCNSXSHA",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
    };
    const action = "Submit";
    const filterExceptionNames = [];
    const res = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
      filterExceptionNames,
    });
    expect(res.cashflowId).toBe("M00096673610");
  });
  it("assembleSubmitRequestBody Reject action", () => {
    const cashflowDetails = {
      BCS_Parent_Trade_Id: "92060287",
      BCS_Trade_Id: null,
      Delivery_Method: "",
      Parent_Trade_Id: "0",
      Position_Id: "",
      Settlement_Method: "Cash",
      Trade_Id: "92060287",
      Trade_State: "TOBESENT",
      Trade_Version: null,
      Trade_Original_Source_System_Name: "",
      Cashflow: {
        Cashflow_Id: "M00101913339",
        Cashflow_Business_Version: 0,
        Cashflow_Version: 0,
        Cashflow_State: "WAITING",
        Cashflow_Affirmation_Status: "Affirmed",
        Cashflow_Event_Type: "New",
        Cashflow_Minor_Version: 7,
        Payment_Currency: "INO",
        Payment_Date: "2024-02-12",
        Payment_Type: "",
        Payment_Cutoff_Time: "2024-02-12T11:00Z",
        Pay_Receive_Indicator: "Receive",
        Payment_Amount: "19865424.700000",
        Netting_Id: null,
        Netting_Cuttoff_Date: null,
        Payment_Receiver_Party_Reference: "party1",
        Payment_Payer_Party_Reference: "party2",
        Cashflow_Sub_State: "Pending Verification",
        Cashflow_Sub_State_Type: "Pending Exception",
        Cashflow_Sub_State_Updater: "1301135",
        Status_Event_Type: "Affirmed",
        Event_Date: "2024-06-07",
        Cashflow_Event_Reason: "",
        Booking_System_Event: "New",
      },
      FMO_Comments: [
        {
          FMO_Comment: "TEst",
          FMO_Comment_Timestamp: "Fri Jun 07 09:36:12 GMT 2024",
          FMO_Comment_Updater: "1321191",
        },
        {
          FMO_Comment:
            "Matched rules are: 7204370934541885440,7198973182404272128,7198973181699629056",
          FMO_Comment_Timestamp: "Fri Jun 07 09:37:00 GMT 2024",
          FMO_Comment_Updater: "System",
        },
        {
          FMO_Comment: "Affirmed by 1301135",
          FMO_Comment_Timestamp: "Fri Jun 07 11:08:46 GMT 2024",
          FMO_Comment_Updater: "1301135",
        },
        {
          FMO_Comment: "Test",
          FMO_Comment_Timestamp: "Fri Jun 07 11:08:47 GMT 2024",
          FMO_Comment_Updater: "1301135",
        },
      ],
      Confirmation: {
        Confirmation_Status: null,
      },
      Entity: {
        Booking_Entity_SCI_FMCODE: "SCB BOMBAY*MMB",
        Booking_Entity_SCI_FMID: "4",
        Counterparty_SCI_FMID: "10075222",
        Counterparty_SCI_FMCODE: "SCB LONDON*LDN",
        Counterparty_CIF_Code: null,
        Counterparty_Source_System_Entity_Id: "",
        General_Ledger_Business_Unit_Name: "EM Rates",
        Booking_Entity_General_Ledger_Business_Unit_Id: "",
      },
      Instrument_Common: {
        CFI_Code: "SRXXXX",
        ISDA_Taxonomy: "IRD|IRS",
        Source_System_Instrument_Sub_Type: "IRD|IRS",
      },
      Settlement_Instruction: {
        Account: {
          SCB_Nostro_Account_Number: "INO NO 2",
          SCB_Nostro_Account_Type: "Over-Account",
          Beneficiary_BIC_code: "SCBLGB2LTSY",
          Beneficiary_Account_Name: "",
          Beneficiary_Account_Name_2: "",
          Beneficiary_Street_Address: "",
          Beneficiary_City: "",
          Beneficiary_Account_Number: "22205015138",
          Intermediary_BIC_code: "",
          Intermediary_Account_Name: "",
          Intermediary_Street_Address: "",
          Intermediary_City: "",
          Intermediary_Account_Number: "",
          Beneficiary_Bank_BIC_code: "SCBLINBBXXX",
          Beneficiary_Bank_Account_Name: "",
          Beneficiary_Bank_Street_Address: "",
          Beneficiary_Bank_City: "",
          Beneficiary_Bank_Account_Number: "",
          Beneficiary_Correspondent_BIC_code: "",
          Beneficiary_Correspondent_Account_Name: "",
          Beneficiary_Correspondent_Street_Address: "",
          Beneficiary_Correspondent_City: "",
          Beneficiary_Correspondent_Account_Number: "",
          Ordering_Customer_BIC_Code: "SCBLGB2LXXX",
          Ordering_Customer_Account_Name: "STANDARD CHARTERED BANK LONDON",
          Ordering_Customer_Street_Address: "1 BASINGHALL AVENUE LDN",
          Ordering_Customer_City: "UNITED KINGDOM",
          Ordering_Customer_Account_Number: "10075222",
          Counterparty_CMS_Account_Number: "",
          EBBS_Bridge_Account_Number: "23191235736",
          EBBS_Account_Number: "23191235736",
          Booking_Entity_Correspondent_BIC_code: "SCBLINBBXXX",
          Booking_Entity_Correspondent_Account_Name: "SCB MUMBAI MMB",
          Booking_Entity_Correspondent_Street_Address:
            "GLOBAL MARKETS OPERATIONS  90 M G ROAD 1ST FLOOR ",
          Booking_Entity_Correspondent_City: "MUMBAI",
          Booking_Entity_Correspondent_Account_Number: "23191235736",
        },
        SSI_Id: "45574121",
        SSI_Unique_Id: "45574121",
        SSI_Source: "Interface",
        SSI_Priority: "Primary",
        Settlement_Code: "",
        Swift_Message_Type: "MT202",
        CFI_Code: null,
        Payment_Currency: null,
        Counterparty_SCI_FMID: null,
        SCB_Entity_SCI_FMID: null,
        Remittance_Information_1: "",
        Remittance_Information_2: "",
        Remittance_Information_3: "",
        Remittance_Information_4: "",
        Sender_To_Receiver_Information_1: "",
        Sender_To_Receiver_Information_2: "",
        Sender_To_Receiver_Information_3: "",
        Sender_To_Receiver_Information_4: "",
        Sender_To_Receiver_Information_5: "",
        Sender_To_Receiver_Information_6: "",
        Is_Third_Party_Payment: "false",
        Swift_Payment_Method: "",
        Swift_Payment_Date: "",
        Charge_Bearer: "",
        Nostro_Swift_Message_Type: "",
      },
      Portfolio: {
        Booking_Entity_Trade_Portfolio_Name: "IR_SWP_INO_AEB",
      },
      Data_Flow: {
        Data_Source_System: "MUREX",
      },
    };
    const exceptions = [
      {
        Id: "1704034037354450944",
        Original_Exception_Id: "Exception_3da76b78-3d9f-4c3f-8a81-477c20223828",
        Exception_Code: "Per SSI Adhoc",
        Exception_Category: "SSI",
        Exception_Type: "BUSINESS",
        Description: "Per_SSIAdhoc_EXCEPTION",
        Status: "INACTIVE",
        Actions: [
          {
            Api_Url:
              "http://ratan-cash-settlement-ssi-stamping-service/v2/adhoc/ssis/makerInput/M00096673610",
            Api_Method: "POST",
            Action_Name: "submit",
            Action_Type: "REST",
            Component_Url: null,
            Component_Name: null,
          },
          {
            Api_Url:
              "http://ratan-cash-settlement-ssi-stamping-service/v2/adhoc/ssis/checker/reject/M00096673610",
            Api_Method: "POST",
            Action_Name: "reject",
            Action_Type: "REST",
            Component_Url: null,
            Component_Name: null,
          },
        ],
        Stashing: {
          Request_Body: null,
          Maker_Id: "",
        },
      },
      {
        Id: "1704034054282645504",
        Original_Exception_Id: "1704034054222454784",
        Exception_Code: "Pending Affirmation",
        Exception_Category: "AFFIRMATION",
        Exception_Type: "BUSINESS",
        Description:
          "Cashflow and trade are not confirmed or affirmed. cashflow affirmation status is Unaffirmed, nettingId is , sourceSystem is MUREX, counterpartyFlag is ",
        Status: "PENDING_OPERATOR",
        Actions: [
          {
            Api_Url: "http://RATAN-RULE-SERVICE/v1/nstpException/submit",
            Api_Method: "POST",
            Action_Name: "submit",
            Action_Type: null,
            Component_Url: null,
            Component_Name: null,
          },
        ],
        Stashing: {
          Request_Body: null,
          Maker_Id: null,
        },
      },
    ];
    const payload = {
      comment: {
        comment: "2",
      },
      nostro: {
        settlementMeans: "Over-Account",
        settlementAccount: "INO NO 2",
        sendersCorrespondent53Swift: "SCBLINBBXXX",
        sendersCorrespondent53Fullname: "SCB MUMBAI MMB",
        sendersCorrespondent53Address:
          "GLOBAL MARKETS OPERATIONS  90 M G ROAD 1ST FLOOR ",
        sendersCorrespondent53City: "MUMBAI",
        sendersCorrespondent53Account: "23191235736",
        noticeToReceive: "N",
        ebbsNostroAccount: "23191235736",
      },
    };
    const action = "Reject";
    const filterExceptionNames = ["vostro"];
    const res = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
      filterExceptionNames,
    });
    expect(res.cashflowId).toBe("M00101913339");
  });
  it("dataAccuracyVerification", () => {
    const sourceData = {
      comment: {
        comment: "test",
      },
      nostro: {
        settlementMeans: "NOS",
        settlementAccount: "USD MAIN",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53Account: "",
        noticeToReceive: "N",
        ebbsNostroAccount: "800609500058636006",
      },
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "NOS",
        settlementAccount: "USD MAIN",
        beneficiaryBic: "12345678",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
      affirmation: {
        affirmedBy: "LS",
        phone_email: "123",
        affirmedAt: "",
      },
      back_value: {
        swiftPaymentDate: "2023-09-19",
      },
    };
    const targetData = {
      vostro: {
        ssiSource: "",
        ssiStatus: "",
        effectiveDate: "",
        fmid: "",
        counterpartName: "",
        swiftType: "MT103",
        country: "",
        security: "",
        debitCredit: "",
        settlementMethod: "",
        deliveryMethod: "",
        settlementMeans: "NOS",
        settlementType: "",
        systemCode: "",
        ssiId: "",
        entity: "",
        tradingCurrency: "",
        typology: "",
        ssiType: "Primary",
        settlementAccount: "USD MAIN",
        productGroup: "",
        productFamily: "",
        productType: "",
        coveredPayment: "Y",
        cmsAccount: "",
        charges: "OUR",
        isThirdpartyPayment: "",
        beneficiaryBic: "",
        beneficiaryName: "CITIC SECURITIES CO LTD",
        beneficiaryName2: "",
        beneficiaryAddress: "16F CITIC SECURITIES TWR NO48 BJG",
        beneficiaryCity: "China",
        beneficiaryPostcode: "",
        beneficiaryAccount: "861530053779",
        accountWithInstitutionBic: "UBHKHKHHXXX",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionPostcode: "",
        accountWithInstitutionAccount: "36082191",
        receiversCorrespondentBic: "CITIUS33XXX",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentPostcode: "",
        receiversCorrespondentAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryCity: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "LNAME 494037",
        orderCustomerAddress: "ADDR1 595864 BJG",
        orderCustomerCity: "CN",
        orderCustomerPostcode: "",
        orderCustomerAccount: "400108557",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        eventRowKey: "",
        bookingEntity: "",
        cfiCode: "",
        isThirdPartyPayment: "N",
      },
      nostro: {
        id: "",
        legalEntity: "",
        legalEntityFmid: "",
        settlementCurrency: "",
        settlementMeans: "NOS",
        settlementAccount: "USD MAIN",
        noticeToReceive: "N",
        nostroSettlementMessageType: "",
        ebbsNostroAccount: "800609500058636006",
        ebbsBridgeAccount: "",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53PostCode: "",
        sendersCorrespondent53Account: "",
        createdAt: "",
        updatedAt: "",
        primaryFlag: "",
      },
      affirmation: {
        affirmedBy: "LS",
        phone_email: "123",
        affirmedAt: "",
      },
      back_value: {
        swiftPaymentDate: "2023-09-19",
      },
    };
    const { ok } = dataAccuracyVerification(sourceData, targetData);
    expect(ok).toBeFalsy();
  });
  it("dataAccuracyVerification1", () => {
    const sourceData = {
      comment: {
        comment: "test",
      },
      nostro: {
        settlementMeans: "NOS",
        settlementAccount: "INR NO 2",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53Account: "",
        noticeToReceive: "N",
        ebbsNostroAccount: "800609500058636006",
      },
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        beneficiaryBic: "12345678",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
      affirmation: {
        affirmedBy: "LS",
        phone_email: "123",
        affirmedAt: "",
      },
      back_value: {
        swiftPaymentDate: "2023-09-19",
      },
    };
    const targetData = {
      vostro: {
        ssiSource: "",
        ssiStatus: "",
        effectiveDate: "",
        fmid: "",
        counterpartName: "",
        swiftType: "MT103",
        country: "",
        security: "",
        debitCredit: "",
        settlementMethod: "",
        deliveryMethod: "",
        settlementMeans: "NOS",
        settlementType: "",
        systemCode: "",
        ssiId: "",
        entity: "",
        tradingCurrency: "",
        typology: "",
        ssiType: "Primary",
        settlementAccount: "USD MAIN",
        productGroup: "",
        productFamily: "",
        productType: "",
        coveredPayment: "Y",
        cmsAccount: "",
        charges: "OUR",
        isThirdpartyPayment: "",
        beneficiaryBic: "",
        beneficiaryName: "CITIC SECURITIES CO LTD",
        beneficiaryName2: "",
        beneficiaryAddress: "16F CITIC SECURITIES TWR NO48 BJG",
        beneficiaryCity: "China",
        beneficiaryPostcode: "",
        beneficiaryAccount: "861530053779",
        accountWithInstitutionBic: "UBHKHKHHXXX",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionPostcode: "",
        accountWithInstitutionAccount: "36082191",
        receiversCorrespondentBic: "CITIUS33XXX",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentPostcode: "",
        receiversCorrespondentAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryCity: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "LNAME 494037",
        orderCustomerAddress: "ADDR1 595864 BJG",
        orderCustomerCity: "CN",
        orderCustomerPostcode: "",
        orderCustomerAccount: "400108557",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        eventRowKey: "",
        bookingEntity: "",
        cfiCode: "",
        isThirdPartyPayment: "N",
      },
      nostro: {
        id: "",
        legalEntity: "",
        legalEntityFmid: "",
        settlementCurrency: "",
        settlementMeans: "NOS",
        settlementAccount: "USD MAIN",
        noticeToReceive: "N",
        nostroSettlementMessageType: "",
        ebbsNostroAccount: "800609500058636006",
        ebbsBridgeAccount: "",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53PostCode: "",
        sendersCorrespondent53Account: "",
        createdAt: "",
        updatedAt: "",
        primaryFlag: "",
      },
      affirmation: {
        affirmedBy: "LS",
        phone_email: "123",
        affirmedAt: "20240613",
      },
      back_value: {
        swiftPaymentDate: "2023-09-19",
      },
    };
    const { ok } = dataAccuracyVerification(sourceData, targetData);
    expect(ok).toBeFalsy();
  });

  it("dataAccuracyVerification reports diffs when data.vostro is missing", () => {
    const data = {
      nostro: {},
    };
    const makerSubmittedData = {
      vostro: {
        settlementAccount: "ACC-1",
        settlementMeans: "NOS",
      },
      nostro: {},
    };

    const { ok, msg } = dataAccuracyVerification(data, makerSubmittedData);

    expect(ok).toBeTruthy();
    expect(msg).toHaveLength(0);
  });

  it("dataAccuracyVerification uses fallback objects", () => {
    let vostroAccess = 0;
    const data: any = {};

    Object.defineProperty(data, MultiExceptionsNames.Vostro, {
      get: () => {
        if (vostroAccess === 0) {
          vostroAccess += 1;
          return { settlementAccount: "ACC-1", settlementMeans: "NOS" };
        }
        return undefined;
      },
      configurable: true,
    });

    Object.defineProperty(data, MultiExceptionsNames.Nostro, {
      get: () => undefined,
      configurable: true,
    });

    const { ok, msg } = dataAccuracyVerification(data, {});

    expect(ok).toBeTruthy();
    expect(msg).toEqual([]);
  });

  it("dataAccuracyVerification backvalue diff", () => {
    const sourceData = {
      back_value: {
        swiftPaymentDate: "2023-09-19",
      },
    };
    const targetData = {
      back_value: {
        swiftPaymentDate: "2023-09-20",
      },
    };

    const { ok, msg } = dataAccuracyVerification(sourceData, targetData);

    expect(ok).toBeFalsy();
    expect(msg).toEqual([
      {
        type: "form",
        section: MultiExceptionsNames.Backvalue,
        field: "swiftPaymentDate",
        errorType: "warning",
        errorMsg: "Different With Maker Input",
      },
    ]);
  });

  // #6219556
  it("dataAccuracyVerification for settlement method case", () => {
    const sourceData = {
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        settlementMethod: "CASH",
        beneficiaryBic: "12345678",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
      nostro: {
        id: "",
        legalEntity: "",
        legalEntityFmid: "",
        settlementCurrency: "",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        noticeToReceive: "N",
        nostroSettlementMessageType: "",
        ebbsNostroAccount: "800609500058636006",
        ebbsBridgeAccount: "",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53PostCode: "",
        sendersCorrespondent53Account: "",
        createdAt: "",
        updatedAt: "",
        primaryFlag: "",
      },
    };
    const targetData = {
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        settlementMethod: "",
        beneficiaryBic: "12345678",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
      nostro: {
        id: "",
        legalEntity: "",
        legalEntityFmid: "",
        settlementCurrency: "",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        noticeToReceive: "N",
        nostroSettlementMessageType: "",
        ebbsNostroAccount: "800609500058636006",
        ebbsBridgeAccount: "",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53PostCode: "",
        sendersCorrespondent53Account: "",
        createdAt: "",
        updatedAt: "",
        primaryFlag: "",
      },
    };
    const { ok } = dataAccuracyVerification(sourceData, targetData);
    expect(ok).toBeTruthy();

    // any of is FEDWIRE
    const sourceData2 = {
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        settlementMethod: "CASH",
        beneficiaryBic: "12345678",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
      nostro: {
        id: "",
        legalEntity: "",
        legalEntityFmid: "",
        settlementCurrency: "",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        noticeToReceive: "N",
        nostroSettlementMessageType: "",
        ebbsNostroAccount: "800609500058636006",
        ebbsBridgeAccount: "",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53PostCode: "",
        sendersCorrespondent53Account: "",
        createdAt: "",
        updatedAt: "",
        primaryFlag: "",
      },
    };
    const targetData2 = {
      vostro: {
        ssiType: "Primary",
        swiftType: "MT202",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        settlementMethod: "FEDWIRE",
        beneficiaryBic: "12345678",
        beneficiaryName: "",
        beneficiaryName2: "",
        beneficiaryAddress: "",
        beneficiaryCity: "",
        beneficiaryAccount: "",
        tradingCurrency: "",
        isThirdPartyPayment: "N",
        coveredPayment: "N",
        charges: "",
        accountWithInstitutionBic: "",
        accountWithInstitutionName: "",
        accountWithInstitutionAddress: "",
        accountWithInstitutionCity: "",
        accountWithInstitutionAccount: "",
        intermediaryBic: "",
        intermediaryName: "",
        intermediaryAddress: "",
        intermediaryPostcode: "",
        intermediaryAccount: "",
        receiversCorrespondentBic: "",
        receiversCorrespondentName: "",
        receiversCorrespondentAddress: "",
        receiversCorrespondentCity: "",
        receiversCorrespondentAccount: "",
        cmsAccount: "",
        orderCustomerBic: "",
        orderCustomerName: "",
        orderCustomerAddress: "",
        orderCustomerCity: "",
        orderCustomerAccount: "",
        senderToReceiver1: "",
        senderToReceiver2: "",
        senderToReceiver3: "",
        senderToReceiver4: "",
        senderToReceiver5: "",
        senderToReceiver6: "",
        remittanceInformation1: "",
        remittanceInformation2: "",
        remittanceInformation3: "",
        remittanceInformation4: "",
      },
      nostro: {
        id: "",
        legalEntity: "",
        legalEntityFmid: "",
        settlementCurrency: "",
        settlementMeans: "CLG",
        settlementAccount: "USD MAIN",
        noticeToReceive: "N",
        nostroSettlementMessageType: "",
        ebbsNostroAccount: "800609500058636006",
        ebbsBridgeAccount: "",
        sendersCorrespondent53Swift: "SCBLUS33XXX",
        sendersCorrespondent53Fullname: "STANCHART NY",
        sendersCorrespondent53Address: "1095 AVENUE OF THE AMERICAS",
        sendersCorrespondent53City: "NEW YORK",
        sendersCorrespondent53PostCode: "",
        sendersCorrespondent53Account: "",
        createdAt: "",
        updatedAt: "",
        primaryFlag: "",
      },
    };
    const { ok: ok2 } = dataAccuracyVerification(sourceData2, targetData2);
    expect(ok2).toBeFalsy();
  });
  it("hasHighRiskExceptionPermission", () => {
    expect(hasHighRiskExceptionPermission()).toEqual(true);
  });
  it("matchException", () => {
    const exception = {
      Id: "1679339386932523008",
      Original_Exception_Id: "1679339386577477632",
      Exception_Code: "Pending Affirmation",
      Exception_Type: "BUSINESS",
      Description:
        "Cashflow is not confirmed or affirmed. status is Unaffirmed",
      Status: "CLOSED",
      Actions: [],
      Stashing: {
        Maker_Request_Body: null,
        Maker_Id: null,
        Checker_Request_Body: null,
        Checker_Id: null,
      },
    };
    //NSTP
    expect(
      matchException(Object.assign(exception, { Exception_Category: "NSTP" }))
    ).toEqual("nstp");
    //HIGH_RISK_NSTP
    expect(
      matchException(
        Object.assign(exception, { Exception_Category: "HIGH_RISK_NSTP" })
      )
    ).toEqual("high_risk_nstp");
    //HARD_BLOCKER
    expect(
      matchException(
        Object.assign(exception, { Exception_Category: "HARD_BLOCKER" })
      )
    ).toEqual("hard_blocker");
    //OTHER
    expect(
      matchException(Object.assign(exception, { Exception_Category: "OTHER" }))
    ).toEqual("other");
    //AFFIRMATION
    expect(
      matchException(
        Object.assign(exception, {
          Exception_Category: "AFFIRMATION",
        })
      )
    ).toEqual("affirmation");
    //BACK_VALUE
    expect(
      matchException(
        Object.assign(exception, {
          Exception_Category: "BACK_VALUE",
        })
      )
    ).toEqual("back_value");
    //SSI
    expect(
      matchException(Object.assign(exception, { Exception_Category: "SSI" }))
    ).toEqual("vostro");
    expect(
      matchException(Object.assign(exception, { Exception_Category: "test" }))
    ).toEqual("");
  });
  it("isValidateBeneInfoException", () => {
    const exception = {
      Id: "1679339386932523008",
      Original_Exception_Id: "1679339386577477632",
      Exception_Code: "Pending Affirmation",
      Exception_Category: "SSI",
      Exception_Type: "BUSINESS",
      Description:
        "Cashflow is not confirmed or affirmed. status is Unaffirmed",
      Status: "CLOSED",
      Actions: [],
      Stashing: {
        Maker_Request_Body: null,
        Maker_Id: null,
        Checker_Request_Body: null,
        Checker_Id: null,
      },
    };
    expect(isValidateBeneInfoException(exception)).toBeFalsy();
  });
  it("isRebookException", () => {
    const exception = {
      Id: "1679339386932523008",
      Original_Exception_Id: "1679339386577477632",
      Exception_Code: "Pending Affirmation",
      Exception_Category: "HIGH_RISK_NSTP",
      Exception_Type: "BUSINESS",
      Description:
        "Cashflow is not confirmed or affirmed. status is Unaffirmed",
      Status: "CLOSED",
      Actions: [],
      Stashing: {
        Maker_Request_Body: null,
        Maker_Id: null,
        Checker_Request_Body: null,
        Checker_Id: null,
      },
    };
    expect(isRebookException(exception)).toBeFalsy();
  });
  it("extractMeaningfulTitleOfSSIException", () => {
    const exception = {
      Id: "1679339386932523008",
      Original_Exception_Id: "1679339386577477632",
      Exception_Code: "Pending Affirmation",
      Exception_Category: "Nostro",
      Exception_Type: "BUSINESS",
      Description:
        "Cashflow is not confirmed or affirmed. status is Unaffirmed",
      Status: "CLOSED",
      Actions: [],
      Stashing: {
        Maker_Request_Body: null,
        Maker_Id: null,
        Checker_Request_Body: null,
        Checker_Id: null,
      },
    };
    expect(extractMeaningfulTitleOfSSIException(exception)).toEqual("SSI");
  });
  it("diffObject", () => {
    const source = { affirmedBy: "LS", phone_email: "123", affirmedAt: "" };
    const target = { swiftPaymentDate: "2023-09-19" };
    const skipKeys = ["affirmedBy"];
    expect(diffObject(source, target, skipKeys)).toEqual(["phone_email"]);
  });
  it("convertStrBoolIntoYN", () => {
    //string
    expect(convertStrBoolIntoYN(123)).toEqual(123);
    //false
    expect(convertStrBoolIntoYN("false")).toEqual("N");
    //true
    expect(convertStrBoolIntoYN("true")).toEqual("Y");
  });
  it("convertAllStrBoolValueInObjIntoYN", () => {
    expect(convertAllStrBoolValueInObjIntoYN({ false: false })).toEqual({
      false: false,
    });
  });
  it("missingNostroSubmitPreCheck", () => {
    const data = {
      comment: {
        comment: "test",
      },
      affirmation: {
        affirmedBy: "1",
        phone_email: "1",
        affirmedAt: "2024-06-10T17:31:46",
      },
      vostro: {
        isThirdPartyPayment: "N",
      },
    };
    expect(missingNostroSubmitPreCheck(data)).toBeFalsy();
  });
  it("removeSpecialCharacters", () => {
    expect(removeSpecialCharacters("$regex test1*")).toEqual("regex test1");
  });
  it("trimObject", () => {
    const testData = { a: " 123 ", b: "1 2 3 ", c: " ", d: 1 };
    trimObject(testData)
    expect(testData).toStrictEqual({ a: "123", b: "1 2 3", c: "", d: 1 });
  });
});

it("toUpperCase", () => {
  expect(toUpperCase("abc")).toBe("ABC");
  expect(toUpperCase(null)).toBe("");
  expect(toUpperCase()).toBe("");
});

it("isMakerOrCheckInputFedwire", () => {
  expect(isMakerOrCheckInputFedwire({}, {})).toBe(false);
  expect(isMakerOrCheckInputFedwire({ settlementMethod: "CASH" }, { settlementMethod: "fedwire" })).toBe(true);
  expect(isMakerOrCheckInputFedwire({ settlementMethod: "fedwire" }, { settlementMethod: "FEDWIRE" })).toBe(true);
  expect(isMakerOrCheckInputFedwire({ settlementMethod: "" }, { settlementMethod: "CASH" })).toBe(false);
  expect(isMakerOrCheckInputFedwire({ settlementMethod: "" }, { settlementMethod: "" })).toBe(false);
});


describe("getUserProfile", () => {
  it("should return Verifier when user has check permission", () => {
    vi.spyOn(ratanUtilsMock, "hasPermission").mockImplementation((permission) => {
      if (permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Verify") {
        return true;
      }
      return false;
    });

    const result = getUserProfile();
    expect(result).toBe(Verifier);
  });

  it("should return Submiter when user has make permission but not check permission", () => {
    vi.spyOn(ratanUtilsMock, "hasPermission").mockImplementation((permission) => {
      if (permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Initiate") {
        return true;
      }
      return false;
    });

    const result = getUserProfile();
    expect(result).toBe(Submiter);
  });

  it("should return NonePermission when user has neither make nor check permission", () => {
    vi.spyOn(ratanUtilsMock, "hasPermission").mockReturnValue(false);

    const result = getUserProfile();
    expect(result).toBe(NonePermission);
  });

  it("should prioritize check permission over make permission", () => {
    vi.spyOn(ratanUtilsMock, "hasPermission").mockImplementation((permission) => {
      if (permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Verify") {
        return true;
      }
      if (permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Initiate") {
        return true;
      }
      return false;
    });

    const result = getUserProfile();
    expect(result).toBe(Verifier);
  });
});

describe("assembleSubmitRequestBody", () => {
  it("should assemble request body correctly for submit action with no filterExceptionNames", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
        Cashflow_Version: 1,
        Cashflow_Business_Version: 2,
        Cashflow_Minor_Version: 3,
      },
    };
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Per SSI Adhoc",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
    ];
    const payload = {
      Comment: { comment: "test comment" },
      Vostro: { field1: "value1" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
    });

    expect(result.cashflowId).toBe("CF123");
    expect(result.action).toBe("Submit");
    expect((result.exceptions[0] as any).actions[0].requestBody).toEqual({
      fitVostro: undefined,
      fitNostro: undefined,
    });
  });

  it("should filter exceptions based on filterExceptionNames", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Per SSI Adhoc",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
      {
        Exception_Category: "AFFIRMATION",
        Exception_Code: "Pending Affirmation",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
    ];
    const payload = {
      Comment: { comment: "test comment" },
      Vostro: { field1: "value1" },
    };
    const action = "Submit";
    const filterExceptionNames = ["Vostro"];

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
      filterExceptionNames,
    });

    expect(result.exceptions.length).toBe(0);
  });

  it("should handle missing exceptions gracefully", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [];
    const payload = {
      Comment: { comment: "test comment" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
    });

    expect(result.exceptions).toEqual([]);
  });

  it("should handle Vostro and Nostro payloads for multi-exception scenarios", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Missing Nostro",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
    ];
    const payload = {
      Vostro: { field1: "value1" },
      Nostro: { field2: "value2" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
    });

    expect((result.exceptions[0] as any).actions[0].requestBody).toEqual({
      fitVostro: {},
      fitNostro: undefined,
    });
  });

  it.skip("should handle empty payload gracefully", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Per SSI Adhoc",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
      {
        Exception_Category: "OTHER_EXCEPTIONS",
        Exception_Code: "",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
    ];
    const payload = {};
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
    });

    expect((result.exceptions[0] as any).actions[0].requestBody).toBe(JSON.stringify({
      fitVostro: undefined,
      fitNostro: undefined,
    }));
  });

  it("should handle invalid action gracefully", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Per SSI Adhoc",
        Actions: [
          {
            Action_Name: "approve",
          },
        ],
      },
    ];
    const payload = {
      Comment: { comment: "test comment" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
    });

    expect((result.exceptions[0] as any).actions[0].requestBody).toBeUndefined();
  });

  it("should handle missing cashflow details gracefully", () => {
    const cashflowDetails = {};
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Per SSI Adhoc",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
    ];
    const payload = {
      Comment: { comment: "test comment" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
    });

    expect(result.cashflowId).toBeUndefined();
  });

  it("should handle undefined filterExceptionNames", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [
      {
        Exception_Category: "SSI",
        Exception_Code: "Per SSI Adhoc",
        Actions: [
          {
            Action_Name: "submit",
          },
        ],
      },
    ];
    const payload = {
      Comment: { comment: "test comment" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
      filterExceptionNames: undefined,
    });

    expect(result.exceptions.length).toBe(1);
  });
  it("should handle undefined Exception Category", () => {
    const cashflowDetails = {
      Cashflow: {
        Cashflow_Id: "CF123",
      },
    };
    const exceptions = [
      {
        Exception_Category: undefined,
        Exception_Code: "Per SSI Adhoc",
      },
    ];
    const payload = {
      Comment: { comment: "test comment" },
    };
    const action = "Submit";

    const result = assembleSubmitRequestBody({
      cashflowDetails,
      exceptions,
      payload,
      action,
      filterExceptionNames: undefined,
    });

    expect(result.exceptions.length).toBe(1);
  });
});

it("isMissingVostroException", () => {
  expect(isMissingVostroException({
    Exception_Category: "SSI",
    Exception_Code: "Missing Vostro"
  })).toBe(true);
});

it("isMultiVostroException", () => {
  expect(isMultiVostroException({
    Exception_Category: "SSI",
    Exception_Code: "Multi Vostro"
  })).toBe(true);
});

it("isSSIGoodStamping", () => {
  expect(isSSIGoodStamping({
    Exception_Category: "SSI",
    Exception_Code: "Per SSI Adhoc",
    Status: "INACTIVE"
  })).toBe(true);
});

it("isAdhocSSIException", () => {
  expect(isAdhocSSIException({
    Exception_Category: "SSI",
    Exception_Code: "Adhoc SSI"
  })).toBe(true);
});

describe("useForwardRef", () => {
  it("should return a ref object with the initial value", () => {
    const initialValue = "testValue";
    const { result } = renderHook(() => useForwardRef({ current: null }, initialValue));
    expect(result.current.current).toBe(initialValue);
  });

  it("should update the ref when a function ref is provided", () => {
    let refValue = null;
    const functionRef = (value: any) => {
      refValue = value;
    };
    const initialValue = "testValue";
    const { result } = renderHook(() => useForwardRef(functionRef, initialValue));
    expect(refValue).toBe(result.current.current);
    expect(refValue).toBe(initialValue);
  });

  it("should handle null ref gracefully", () => {
    const initialValue = "testValue";
    const { result } = renderHook(() => useForwardRef(null, initialValue));
    expect(result.current.current).toBe(initialValue);
  });

  it("should update the ref object when the value changes", () => {
    const ref = { current: null };
    const initialValue = "initialValue";
    const { result } = renderHook(() => useForwardRef(ref, initialValue));
    expect(ref.current).toBe(initialValue);

    const newValue = "newValue";
    // @ts-ignore
    result.current.current = newValue;
    expect(ref.current).toBe("initialValue");
  });

  it("should handle null initial value", () => {
    const ref = { current: null };
    const { result } = renderHook(() => useForwardRef(ref, null));
    expect(result.current.current).toBe(null);
  });

  it("should handle undefined initial value", () => {
    const ref = { current: null };
    const { result } = renderHook(() => useForwardRef(ref));
    expect(result.current.current).toBe(null);
  });

  it("should not modify the ref if no initial value is provided", () => {
    const ref = { current: null };
    const { result } = renderHook(() => useForwardRef(ref));
    expect(result.current.current).toBe(null);
  });

  it("should work with multiple refs", () => {
    const ref1 = { current: null };
    const ref2 = { current: null };
    const initialValue = "testValue";

    const { result: result1 } = renderHook(() => useForwardRef(ref1, initialValue));
    const { result: result2 } = renderHook(() => useForwardRef(ref2, initialValue));

    expect(result1.current.current).toBe(initialValue);
    expect(result2.current.current).toBe(initialValue);
    expect(ref1.current).toBe(initialValue);
    expect(ref2.current).toBe(initialValue);
  });
  it("should return an object with all fields as empty string", () => {
    const result = generateEmptyNostro();
    Object.values(result).forEach((value) => {
      expect(value).toBe("");
    });
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("legalEntity");
    expect(result).toHaveProperty("settlementCurrency");
    expect(result).toHaveProperty("settlementMeans");
    expect(result).toHaveProperty("settlementAccount");
    expect(result).toHaveProperty("noticeToReceive");
    expect(result).toHaveProperty("nostroSettlementMessageType");
    expect(result).toHaveProperty("ebbsNostroAccount");
    expect(result).toHaveProperty("ebbsBridgeAccount");
    expect(result).toHaveProperty("sendersCorrespondent53Swift");
    expect(result).toHaveProperty("sendersCorrespondent53Fullname");
    expect(result).toHaveProperty("sendersCorrespondent53Address");
    expect(result).toHaveProperty("sendersCorrespondent53City");
    expect(result).toHaveProperty("sendersCorrespondent53PostCode");
    expect(result).toHaveProperty("sendersCorrespondent53Account");
    expect(result).toHaveProperty("createdAt");
    expect(result).toHaveProperty("updatedAt");
    expect(result).toHaveProperty("primaryFlag");
  });
});

describe("common utils basics", () => {
  it("matchException maps categories to names", () => {
    expect(matchException({ Exception_Category: ExceptionCategory.NSTP } as any)).toBe(
      MultiExceptionsNames.NSTP
    );
    expect(matchException({ Exception_Category: ExceptionCategory.AFFIRMATION } as any)).toBe(
      MultiExceptionsNames.Affirmation
    );
    expect(matchException({ Exception_Category: ExceptionCategory.SSI } as any)).toBe(
      MultiExceptionsNames.Vostro
    );
  });

  it("special exception checks based on code and category", () => {
    const base = { Exception_Category: ExceptionCategory.SSI, Exception_Code: "RATAN-201000001", Status: "INACTIVE" } as any;
    expect(isMissingVostroException(base)).toBe(true);
    expect(isMultiVostroException({ ...base, Exception_Code: "RATAN-201000002" })).toBe(true);
    expect(isSSIGoodStamping({ ...base, Exception_Code: "RATAN-201000010", Status: "INACTIVE" })).toBe(true);
    expect(isMissingNostroException({ ...base, Exception_Code: "RATAN-201000005" })).toBe(true);
    expect(isSSIMissMatchedException({ ...base, Exception_Code: "RATAN-201000003" })).toBe(true);
    expect(isValidateBeneInfoException({ ...base, Exception_Code: "RATAN-201000006" })).toBe(true);
    expect(isAdhocSSIException({ ...base, Exception_Code: "RATAN-202000005" })).toBe(true);
    expect(isRebookException({ Exception_Category: ExceptionCategory.HIGH_RISK_NSTP, Exception_Code: "Rebook" } as any)).toBe(true);
  });

  it("extractMeaningfulTitleOfSSIException returns code for vostro", () => {
    const res = extractMeaningfulTitleOfSSIException({ Exception_Category: ExceptionCategory.SSI, Exception_Code: "CODE123", Description: "desc" } as any);
    expect(res).toBe("CODE123");
  });

  it("diffObject finds differing keys", () => {
    const a = { x: 1, y: 2 };
    const b = { x: 1, y: 3 };
    expect(diffObject(a, b)).toEqual(["y"]);
    expect(diffObject({ a: "", b: "v" }, { a: "", b: "v" })).toEqual([]);
    expect(diffObject({ a: "1", b: "2" }, { a: "9", b: "2" }, ["a"]))
      .toEqual([]);
  });

  it("convertStrBoolIntoYN and convertAllStrBoolValueInObjIntoYN", () => {
    expect(convertStrBoolIntoYN("true")).toBe("Y");
    expect(convertStrBoolIntoYN("false")).toBe("N");
    expect(convertStrBoolIntoYN("something")).toBe("something");
    const obj = { a: "true", b: "false", c: 1 } as any;
    const converted = convertAllStrBoolValueInObjIntoYN(obj);
    expect(converted.a).toBe("Y");
    expect(converted.b).toBe("N");
    expect(converted.c).toBe(1);
  });

  it("generateEmptyVostro and Nostro produce objects with keys", () => {
    const v = generateEmptyVostro();
    const n = generateEmptyNostro();
    expect(v).toHaveProperty("settlementAccount");
    expect(n).toHaveProperty("id");
  });

  it("isVostroFormDataEmpty and missingNostroSubmitPreCheck", () => {
    const empty = { isThirdPartyPayment: "N", coveredPayment: "N" } as any;
    expect(isVostroFormDataEmpty(empty)).toBe(true);
    const data: any = { [MultiExceptionsNames.Vostro]: empty };
    missingNostroSubmitPreCheck(data);
    expect(data[MultiExceptionsNames.Vostro]).toBeUndefined();
  });

  it("isVostroFormDataEmpty handles non-object and non-empty", () => {
    expect(isVostroFormDataEmpty(undefined as any)).toBe(false);
    expect(isVostroFormDataEmpty("test" as any)).toBe(false);

    const notEmpty = {
      isThirdPartyPayment: "Y",
      coveredPayment: "N",
      settlementAccount: "ACC-1",
    } as any;
    expect(isVostroFormDataEmpty(notEmpty)).toBe(false);

    const data: any = { [MultiExceptionsNames.Vostro]: notEmpty };
    missingNostroSubmitPreCheck(data);
    expect(data[MultiExceptionsNames.Vostro]).toBe(notEmpty);
  });

  it("isVostroFormDataEmpty returns false for boolean Y", () => {
    const data = { isThirdPartyPayment: "Y" } as any;
    expect(isVostroFormDataEmpty(data)).toBe(false);
  });

  it("isVostroFormDataEmpty treats empty boolean fields as empty", () => {
    const empty = {
      isThirdPartyPayment: "",
      coveredPayment: "",
    } as any;
    expect(isVostroFormDataEmpty(empty)).toBe(true);
  });

  it("isVostroFormDataEmpty treats empty non-boolean fields as empty", () => {
    const empty = { settlementAccount: "" } as any;
    expect(isVostroFormDataEmpty(empty)).toBe(true);
  });

  it("removeSpecialCharacters and toUpperCase", () => {
    expect(removeSpecialCharacters("ab@# c$%d")).toBe("ab cd");
    expect(toUpperCase("abc")).toBe("ABC");
    expect(toUpperCase()).toBe("");
  });

  it("trimObject ignores non-object", () => {
    expect(() => trimObject(null as any)).not.toThrow();
  });

  it("trimObject trims only strings", () => {
    const obj: any = { a: "  foo  ", b: 1 };
    trimObject(obj);
    expect(obj.a).toBe("foo");
    expect(obj.b).toBe(1);
  });

  it("isMakerOrCheckInputFedwire returns true when FEDWIRE appears", () => {
    expect(isMakerOrCheckInputFedwire({ settlementMethod: "FEDWIRE" } as any, {} as any)).toBe(true);
    expect(isMakerOrCheckInputFedwire({} as any, { settlementMethod: "fedwire" } as any)).toBe(true);
    expect(isMakerOrCheckInputFedwire({} as any, {} as any)).toBe(false);
  });

  it("getUserRole and findIfSubmitByYou use mocked getUser and parseMakerIdFromHistory", () => {
    expect(getUserRole()).toBe("role1");
    const res = findIfSubmitByYou("Maker", [] as any);
    expect(res).toBe(true);
  });

  it("SSILogicModel mappings and revertSSI path2field conversions", () => {
    expect(SSILogicModel2OldField["Account.SCB_Nostro_Account_Number"]).toBe(
      "settlementAccount"
    );
    expect(SSIOldField2LogicModel["settlementAccount"]).toBe(
      "Account.SCB_Nostro_Account_Number"
    );

    const ssi = {
      Account: {
        SCB_Nostro_Account_Number: "ACC-1",
        SCB_Nostro_Account_Type: "TYPE-1",
      },
      Is_Third_Party_Payment: "true",
      Nostro_Swift_Message_Type: "MT210",
      Swift_Payment_Method: "Cover",
      Nostro_Type: "",
    } as any;
    const result = revertSSI(ssi);
    expect(result.vostro.settlementAccount).toBe("ACC-1");
    expect(result.nostro.settlementAccount).toBe("ACC-1");
    expect(result.vostro.isThirdpartyPayment).toBe("");
    expect(result.nostro.noticeToReceive).toBe("Y");
    expect(result.vostro.coveredPayment).toBe("Y");
    expect(result.nostro.nostroType).toBe("DEFAULT");

    const ssi2 = {
      Nostro_Swift_Message_Type: "N",
      Swift_Payment_Method: "Other",
      Nostro_Type: "CUSTOM",
    } as any;
    const result2 = revertSSI(ssi2);
    expect(result2.nostro.noticeToReceive).toBe("N");
    expect(result2.vostro.coveredPayment).toBe("N");
    expect(result2.nostro.nostroType).toBe("CUSTOM");

    const ssi3 = {
      Is_Third_Party_Payment: "false",
      Nostro_Swift_Message_Type: "Y",
      Swift_Payment_Method: "Y",
      Nostro_Type: "DEFAULT",
    } as any;
    const result3 = revertSSI(ssi3);
    expect((result3.vostro as any).isThirdPartyPayment).toBe("N");
    expect(result3.nostro.noticeToReceive).toBe("Y");
    expect(result3.vostro.coveredPayment).toBe("Y");
    expect(result3.nostro.nostroType).toBe("DEFAULT");

    const ssi4 = {
      Nostro_Type: null,
      Dedicated: { Portfolio: "PORT-1" },
      Account: { POP_Dubai: "DUBAI" },
    } as any;
    const result4 = revertSSI(ssi4);
    expect(result4.nostro.nostroType).toBe("DEFAULT");
    expect(result4.nostro.dedicatedPortfolio).toBe("PORT-1");
    expect(result4.vostro.popDubai).toBe("DUBAI");

    const ssi5 = {
      Nostro_Type: undefined,
      Nostro_Swift_Message_Type: "Y",
      Swift_Payment_Method: "Y",
    } as any;
    const result5 = revertSSI(ssi5);
    expect(result5.nostro.nostroType).toBe("DEFAULT");
    expect(result5.nostro.noticeToReceive).toBe("Y");
    expect(result5.vostro.coveredPayment).toBe("Y");

    const ssi6 = {
      Settlement_Method: "WIRE",
      Charge_Bearer: "OUR",
    } as any;
    const result6 = revertSSI(ssi6);
    expect(result6.vostro.settlementMethod).toBe("WIRE");
    expect(result6.vostro.charges).toBe("OUR");

    const result7 = revertSSI();
    expect(result7.vostro).toHaveProperty("settlementAccount");
    expect(result7.nostro).toHaveProperty("id");
  });

  it("extractSSIValue handles undefined ssi for path and path2field cases", () => {
    const cfgNoConverter = { path: "Account.Beneficiary_Account_Name" } as any;
    expect(extractSSIValue(undefined as any, cfgNoConverter)).toBeUndefined();

    const cfgWithConverter = {
      path: "Nostro_Type",
      path2field: (value: any) => {
        switch (value) {
          case undefined:
          case "":
          case null:
          case "DEFAULT":
            return "DEFAULT";
          default:
            return value;
        }
      },
    } as any;
    expect(extractSSIValue(undefined as any, cfgWithConverter)).toBe("DEFAULT");
  });

  it("allowVostroEmptyWhenFixingMissingNostro and vostroInformExtractWrapper", () => {
    expect(
      allowVostroEmptyWhenFixingMissingNostro({
        Cashflow: { Pay_Receive_Indicator: "Receive" },
      } as any)
    ).toBe(true);
    expect(
      allowVostroEmptyWhenFixingMissingNostro({
        Cashflow: { Pay_Receive_Indicator: "Pay" },
      } as any)
    ).toBe(false);

    const { wrapper } = vostroInformExtractWrapper({
      cashflow: {
        Entity: { Booking_Entity_SCI_FMID: "E1" },
        Cashflow: { Payment_Currency: "USD" },
      },
    } as any);
    const wrapped = wrapper({ settlementAccount: "A1" } as any);
    expect(wrapped.entity).toBe("E1");
    expect(wrapped.tradingCurrency).toBe("USD");

    const { wrapper: wrapper2 } = vostroInformExtractWrapper({} as any);
    const wrapped2 = wrapper2({ settlementAccount: "A2" } as any);
    expect(wrapped2.entity).toBe("");
    expect(wrapped2.tradingCurrency).toBe("");
  });
});
