import {
    NewSplitPreviewResponseItem,
} from "./interface";
import { splitPreviewDataExtracter,splitPreviewDataParser } from "./splitPreviewDataParser";

afterAll(() => {
    jest.clearAllMocks();
});

const sourceData: NewSplitPreviewResponseItem = {
    dataSourceSystem: "",
    cashflowId: "CF123",
    cashflowState: "READY",
    paymentDate: "2023-11-04",
    amount: 1000,
    currency: "USD",
    counterpartyFmid: "FMID001",
    bookingEntityFmid: "FMID002",
    eventType: "",
    payRec: "",
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
describe("Net Preview Data Parser", () => {
    it("should match logic", async () => {
        const result = splitPreviewDataParser(sourceData);
        expect(result.Cashflow?.Cashflow_State).toBe("READY");
    });
    it("should extract nested CNCashflow to flat CashflowNewSplittingParamsItem", () => {
        const input: any = {
            id: "CF123",
            Cashflow: {
                Cashflow_Id: "CF123",
                Cashflow_State: "READY",
                Payment_Date: "2023-11-04",
                Payment_Amount: 1000,
                Payment_Currency: "USD",
            },
            Entity: {
                Counterparty_SCI_FMID: "FMID001",
                Booking_Entity_SCI_FMID: "FMID002",
            },
        };

        const result = splitPreviewDataExtracter(input);

        expect(result.cashflowId).toBe("CF123");
        expect(result.paymentDate).toBe("2023-11-04");
        expect(result.amount).toBe(1000);
        expect(result.currency).toBe("USD");
        expect(result.counterpartyFmid).toBe("FMID001");
    });
});
