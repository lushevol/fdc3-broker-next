import { NewNetPreviewResponseItem } from "./common/interface";
import { netPreviewDataParser } from "./netPreviewDataParser";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Net Preview Data Parser", () => {
  it("should match logic", async () => {
    const source: NewNetPreviewResponseItem = {
      dataSourceSystem: "",
      cashflowId: "",
      cashflowState: "PROJECTED",
      eventType: "",
      paymentDate: "",
      amount: 1,
      currency: "",
      payRec: "",
      bookingEntityFmid: "",
      counterpartyFmid: "",
      allotment: "",
      cashflowSubState: "",
      cashflowSubStateType: "",
      cfiCode: "",
      businessVersion: "",
      cashflowVersion: "",
      minorVersion: "",
      paymentType: "",
      entryTime: "",
      bookingEntityFmCode: "",
      counterpartyFmCode: "",
      netId: "",
      taxonomy: ""
    };
    const result = netPreviewDataParser(source);
    expect(result.Cashflow?.Cashflow_State).toBe("PROJECTED");
  });
});
