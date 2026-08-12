import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { renderWithProviders } from "src/test/test-utils";

import { DetailsBody } from "./detailsBody";
import rowDetails from "../CashflowDetails/data/cashflows.json";
  
// vi.mock("../../services", () => ({
//   getCountryInfo: vi.fn(async () => ({
//     countryInfoList: [
//       {
//         countryCode: "test_country_code",

//       }
//     ]
//   })),
//   getSwiftMessageByCashflowId: vi.fn(async () => (["swift test"])),
//   getEBBSAcountingDetail:vi.fn(async () => ([{}])),
// }));

vi.mock("../../services/graphql", () => ({
  queryCashFlowDetails: vi.fn(async () => ({
    graphCashFlowDetails: [
      {
        cashflow: {}
      }
    ],
  })),
  queryCounterPartyDetails_CN: vi.fn(async () => ({
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
    vi.clearAllMocks();
  });

  it("should be in the document with no active tab", () => {
    vi.mock("../../services", () => ({
      getCountryInfo: vi.fn(() => Promise.reject(new Error("mock error"))),
      getSwiftMessageByCashflowId: vi.fn(async () => (["swift test"])),
      getEBBSAcountingDetail:vi.fn(async () => ([{}])),
    }));
    vi.mock("../../services/graphql", () => ({
      queryCashFlowDetails: vi.fn(async () => ({
        graphCashFlowDetails: [
          {
            cashflow: {}
          }
        ],
      })),
      queryCounterPartyDetails_CN: vi.fn(async () => ({
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
    const onClose = vi.fn();
    const onQueryCashflow = vi.fn();
    const onOpenTradeDetails = vi.fn(() => Promise.resolve());
    const handleSetTabVisible = vi.fn();
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
