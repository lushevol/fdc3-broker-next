import { render, screen, waitFor } from '@testing-library/react';
import { CounterpartyDetailsV2, extractFromRegulatoryInfo, isGSAMClient, washData } from './index';
import { deepClone, isEmpty } from "../../../ratanutils/utils";
import { queryCounterPartyDetails } from "../../../ratanutils/http/graphql";

vi.mock("../../../ratanutils/http/graphql", () => {
  return {
    queryCounterPartyDetails: vi.fn(() => Promise.resolve({
        "fmEntity": {
          "fmSysContact": [
            {
              "addrLine": "CHFMCNSHXXX",
              "mediumUsage": "MXR"
            },
            {
              "addrLine": "CHFMCNSHXXX",
              "mediumUsage": "MAIN"
            }
          ],
          "legalEntity": {
            "legalName": "M496OMOU 4O2D6 6959NOA",
            "shortName": "SCB HK",
            "regulatoryInfo": [
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "REGDATE",
                "regulatoryField2Value": "",
                "regulatoryFieldText": "2017-11-22T01:35:00.000Z"
              },
              {
                "regulatoryTypeValue": "EMIR",
                "regulatoryFields": "AUTHORISED",
                "regulatoryField2Value": "NOTAUTH",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "LEIREGCTR",
                "regulatoryField2Value": "",
                "regulatoryFieldText": "NP"
              },
              {
                "regulatoryTypeValue": "EMIR",
                "regulatoryFields": "EMIRPR",
                "regulatoryField2Value": "",
                "regulatoryFieldText": "VR.Ekjbdkr@zbb.jjj.zk;Urkjjs.Ekdr@mzdbgugr.jjj"
              },
              {
                "regulatoryTypeValue": "EMIR",
                "regulatoryFields": "CLASSFICAT",
                "regulatoryField2Value": "NFC-",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "LSTUPDDATE",
                "regulatoryField2Value": "",
                "regulatoryFieldText": "2019-10-12T12:12:00.000Z"
              },
              {
                "regulatoryTypeValue": "CVA",
                "regulatoryFields": "CVACLASS",
                "regulatoryField2Value": "ABUNSUB",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "CVA",
                "regulatoryFields": "CLASSDATE",
                "regulatoryField2Value": "",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "EMIR",
                "regulatoryFields": "EMIRCLRCAT",
                "regulatoryField2Value": "NA",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "LEILEGNAM",
                "regulatoryField2Value": "",
                "regulatoryFieldText": "Tjlxilif Tigfx Gltldir"
              },
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "REGSTATUS",
                "regulatoryField2Value": "LAPSED",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "EMIR",
                "regulatoryFields": "EEAINCORP",
                "regulatoryField2Value": "GLBL",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "EMIR",
                "regulatoryFields": "ASSIGNFLAG",
                "regulatoryField2Value": "PROVISION",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "LEIENTSTAT",
                "regulatoryField2Value": "ACTIVE",
                "regulatoryFieldText": ""
              },
              {
                "regulatoryTypeValue": "MIFID",
                "regulatoryFields": "LEI",
                "regulatoryField2Value": "",
                "regulatoryFieldText": "549300DVX8CW8OWD1369"
              }
            ],
            "leId": "11145344",
            "legalEntityOrgDetails": [
              {
                "empRelationship": [
                  {
                    "empCode": "1188817"
                  },
                  {
                    "empCode": "0C2"
                  },
                  {
                    "empCode": "DN1"
                  },
                  {
                    "empCode": "1573671"
                  },
                  {
                    "empCode": "070"
                  }
                ],
                "clientTax": [
                  {
                    "typeOfDocumentValue": null,
                    "expiryDateOfDocument": null
                  }
                ],
                "domicileCountry": "NP",
                "officialAddress": [
                  {
                    "line1": "Bxfa TpeIhE CexuFxsP (ysF   ShF nurrh)",
                    "line2": "4Ec CIsEgOcrh - zJ",
                    "city": "7IfOtIsFe",
                    "state": "NA",
                    "country": "NP",
                    "postCode": "",
                    "phone": "",
                    "email": "",
                    "fax": ""
                  }
                ]
              }
            ],
            "incorporatedCountry": "NP",
            "subSegmentCodeValue": "K3",
            "registeredAddress": {
              "line1": "lIhF sr.Y, lIgItIFx",
              "line2": "5IvcIsqeh",
              "city": ".",
              "state": "NA",
              "country": "NP",
              "postCode": ""
            },
            "creditGrade": [
              {
                "creditGradeCodeValue": "3B"
              }
            ],
            "scbGroupEntity": "N",
            "doddFrankDetails": {
              "dfComplaint": "",
              "doddFrankEntityTypeValue": "",
              "usPerson": "N",
              "tradestatusvalue": "",
              "intialMarginMethod": ""
            },
            "dfIncCntryIsoCode": "NP",
            "mifidClntClasValue": ""
          },
          "fmAccount": {
            "fmId": "400594382",
            "subProfileId": "1",
            "omgAlertId": "",
            "rmfFlag": "",
            "clsEigibility": "N",
            "clsStartDate": "",
            "dvpCustInd": "1",
            "fmCode": "SCB HONGKON*HKG",
            "fmType": "BANK",
            "fmLongName": "STANDARD CHARTERED BANK HONGKONG"
          },
          "fmHierarchy": {
            "parentFmId": "300084311"
          },
          "fmScbInfo": {
            "nettingAllowed": null
          }
        }
    }))
  }
})

const tradeDetails = {
  Entity: {
    Counterparty_SCI_FMID: "12345",
    Booking_Entity_SCIFMID: "67890",
    Counterparty_Name: "Test Counterparty",
  },
  Physical_Status: "Active",
};

describe('<CounterpartyDetails/>', () => {
  // ADO timeout error
  test('should render CounterpartyDetails', async () => {
    vi.mocked(queryCounterPartyDetails).mockImplementation((fmId: string)=>{
      return Promise.resolve( {
        fmEntity: {
          fmSysContact: [],
          legalEntity: {
            name: "Test Legal Entity",
          },
        },
      })
    });
    render(<CounterpartyDetailsV2 tradeDetails={tradeDetails}/>);
    await waitFor(() => {
      expect(queryCounterPartyDetails).toHaveBeenCalledWith("12345");
    });
    const detailsDiv = await screen.findByTestId("counterparty-details-pop");
    expect(detailsDiv).toBeInTheDocument();
  });
  test('should render CounterpartyDetails isbookingEntity true', async () => {
    vi.mocked(queryCounterPartyDetails).mockImplementation((fmId: string)=>{
      return Promise.resolve( {
        fmEntity: {
          fmSysContact: [],
          legalEntity: {
            name: "Test Legal Entity",
          },
        },
      })
    });
    render(<CounterpartyDetailsV2 tradeDetails={tradeDetails} isBookingEntity={true}/>);
    await waitFor(() => {
      expect(queryCounterPartyDetails).toHaveBeenCalledWith("12345");
    });
    const detailsDiv = await screen.findByTestId("counterparty-details-pop");
    expect(detailsDiv).toBeInTheDocument();
  });
  test('should render CounterpartyDetails isbookdentity false', async () => {
    render(<CounterpartyDetailsV2 tradeDetails={tradeDetails} isBookingEntity={false}/>);
    const detailsDiv = await screen.findByTestId("counterparty-details-pop");
    expect(detailsDiv).toBeInTheDocument();
  });

  it("test isGSAMClient",()=>{
    const mockData = [
      {
        creditGradeCodeValue: "12A",
      },
      {
        creditGradeCodeValue: "test",
      },
    ];
    expect(isGSAMClient(mockData)).toBe(true);
  });
  it('test extractFromRegulatoryInfo case1',()=>{
    const mockData = [{
      regulatoryTypeValue: "MIFID",
      regulatoryFields: "LEI",
      regulatoryField2Value: "",
      regulatoryFieldText: "result_text",
    }]
    const resultData ={
        lei: "result_text",
        emirAssignment: "",
        emirClassification: "",
        emirClearing: "",
        hkClearing: "",
        masClassification: "",
    };

    const result = extractFromRegulatoryInfo(mockData);
    expect(result).toEqual(resultData);
  });
  it('test extractFromRegulatoryInfo case2',()=>{
    const mockData = [{
      regulatoryTypeValue: "EMIR",
      regulatoryFields: "ASSIGNFLAG",
      regulatoryField2Value: "result_emirAssignment",
      regulatoryFieldText: "",
    }]
    const resultData ={
        lei: "",
        emirAssignment: "result_emirAssignment",
        emirClassification: "",
        emirClearing: "",
        hkClearing: "",
        masClassification: "",
    };

    const result = extractFromRegulatoryInfo(mockData);
    expect(result).toEqual(resultData);
  });
  it('test extractFromRegulatoryInfo case3',()=>{
    const mockData = [{
      regulatoryTypeValue: "EMIR",
      regulatoryFields: "CLASSFICAT",
      regulatoryField2Value: "result_emirAssignment",
      regulatoryFieldText: "",
    }]
    const resultData ={
        lei: "",
        emirAssignment: "",
        emirClassification: "result_emirAssignment",
        emirClearing: "",
        hkClearing: "",
        masClassification: "",
    };

    const result = extractFromRegulatoryInfo(mockData);
    expect(result).toEqual(resultData);
  });
  it('test extractFromRegulatoryInfo case4',()=>{
    const mockData = [{
      regulatoryTypeValue: "EMIR",
      regulatoryFields: "EMIRCLRCAT",
      regulatoryField2Value: "result_emirAssignment",
      regulatoryFieldText: "",
    }]
    const resultData ={
        lei: "",
        emirAssignment: "",
        emirClassification: "",
        emirClearing: "result_emirAssignment",
        hkClearing: "",
        masClassification: "",
    };

    const result = extractFromRegulatoryInfo(mockData);
    expect(result).toEqual(resultData);
  });
  it('test extractFromRegulatoryInfo case5',()=>{
    const mockData = [{
      regulatoryTypeValue: "HKMA",
      regulatoryFields: "HKCLRCLS",
      regulatoryField2Value: "result_emirAssignment",
      regulatoryFieldText: "",
    }]
    const resultData ={
        lei: "",
        emirAssignment: "",
        emirClassification: "",
        emirClearing: "",
        hkClearing: "result_emirAssignment",
        masClassification: "",
    };

    const result = extractFromRegulatoryInfo(mockData);
    expect(result).toEqual(resultData);
  });
  it('test extractFromRegulatoryInfo case6',()=>{
    const mockData = [{
      regulatoryTypeValue: "MAS",
      regulatoryFields: "MASCL",
      regulatoryField2Value: "result_emirAssignment",
      regulatoryFieldText: "",
    }]
    const resultData ={
        lei: "",
        emirAssignment: "",
        emirClassification: "",
        emirClearing: "",
        hkClearing: "",
        masClassification: "result_emirAssignment",
    };

    const result = extractFromRegulatoryInfo(mockData);
    expect(result).toEqual(resultData);
  });
  it("test washData",()=>{
    const mockData = {
      fmEntity:{
        legalEntity:{
          legalEntityOrgDetails: [
            {
              clientTax: [{ taxId: "123" }],
              officialAddress: [{ address: "123 Street" }],
              empRelationship: [{ relationship: "Employee" }],
            },
          ],
        },
        fmSysContact: [
          { mediumUsage: "BIC", addrLine: "BIC Address" },
          { mediumUsage: "OTHER", addrLine: "Other Address" },
        ],
      }
    }
    const result = washData(mockData);

    expect(result.fmEntity.fmSysContact).toEqual({
      addrLine: "BIC Address",
    });
  });
});
