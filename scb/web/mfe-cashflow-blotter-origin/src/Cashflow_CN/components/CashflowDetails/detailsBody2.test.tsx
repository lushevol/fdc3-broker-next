import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { renderWithProviders } from "src/test/test-utils";

import { DetailsBody } from "./detailsBody";
  
const rowDetails = require("../CashflowDetails/data/cashflows.json");

// jest.mock("../../services", () => ({
//   getCountryInfo: jest.fn(async () => ({
//     countryInfoList: [
//       {
//         countryCode: "test_country_code",

//       }
//     ]
//   })),
//   getSwiftMessageByCashflowId: jest.fn(async () => (["swift test"])),
//   getEBBSAcountingDetail:jest.fn(async () => ([{}])),
// }));

jest.mock("../../services/graphql", () => ({
  queryCashFlowDetails: jest.fn(async () => ({
    graphCashFlowDetails: [
      {
        cashflow: {}
      }
    ],
  })),
  queryCounterPartyDetails_CN: jest.fn(async () => ({
    fmEntity: {
      legalEntity: {
        registeredAddress: {
          line1: "test_line1_registered",
          line2: "test_line2_registered",
          city: "test_city_registered",
          country: "test_country_code_registered",
          postCode: "test_post_code_registered",
        }
      }
    },
  })),
}));

describe("DetailsBody", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be in the document with no active tab", () => {
    jest.mock("../../services", () => ({
      getCountryInfo: jest.fn(() => Promise.reject(new Error("mock error"))),
      getSwiftMessageByCashflowId: jest.fn(async () => (["swift test"])),
      getEBBSAcountingDetail:jest.fn(async () => ([{}])),
    }));
    jest.mock("../../services/graphql", () => ({
      queryCashFlowDetails: jest.fn(async () => ({
        graphCashFlowDetails: [
          {
            cashflow: {}
          }
        ],
      })),
      queryCounterPartyDetails_CN: jest.fn(async () => ({
        fmEntity: {
          legalEntity: {
            registeredAddress: {
              line1: "test_line1_registered",
              line2: "test_line2_registered",
              city: "test_city_registered",
              country: "test_country_code_registered",
              postCode: "test_post_code_registered",
            }
          }
        },
      })),
    }));
    const details = JSON.parse(
      JSON.stringify(rowDetails.data.cashflows.results[2])
    );
    const onClose = jest.fn();
    const onQueryCashflow = jest.fn();
    const onOpenTradeDetails = jest.fn(() => Promise.resolve());
    const handleSetTabVisible = jest.fn();
     renderWithProviders(
      <DetailsBody
        details={details}
        onQueryCashflow={onQueryCashflow}
        onOpenTradeDetails={onOpenTradeDetails}
        onTabVisibleChange={handleSetTabVisible}
        onClose={onClose}
      />,
       {
         preloadedState: {
          ...defaultPreloadedState
        }
      }
    );
    expect(screen).toBeDefined();
  });
});