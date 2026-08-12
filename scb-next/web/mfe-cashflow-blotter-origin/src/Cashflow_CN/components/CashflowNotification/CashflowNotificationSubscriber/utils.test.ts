import { isCashflow,isCashflowUpdated } from "./utils";

afterAll(() => {
  vi.clearAllMocks();
});

describe("utils component", () => {
  it("isCashflowUpdated", async () => {
    const source = {
      Cashflow: {
        Cashflow_Version: 0,
        Cashflow_Minor_Version: 0,
        Cashflow_Business_Version: 0,
      },
    };
    const target = {
      Cashflow: {
        Cashflow_Version: 0,
        Cashflow_Minor_Version: 0,
        Cashflow_Business_Version: 2,
      },
    };
    const isUpdated = isCashflowUpdated(source, target);
    expect(isUpdated).toEqual(true);

    const isUpdated1 = isCashflowUpdated({}, {});
    expect(isUpdated1).toEqual(false);
  });
  it("isCashflow", async () => {
    const data = {
      Cashflow: {
        Cashflow_Id: "123456",
      },
    };
    const haveCashflowId = isCashflow(data);
    expect(haveCashflowId).toEqual(true);

    expect(isCashflow({})).toEqual(false);
  });
});
