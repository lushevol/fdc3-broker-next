import { Service } from "src/Root/import";

import {
  cashflowAmendSplit,
  cashflowManualSplit,
  cashflowUnSplit,
  getCurrencyRounding,
  uploadConfirmationFile,
} from "./index";

describe("cashflowManualSplit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("test cashflowmanualsplit", async () => {
    const mockPayload = { profile: "test", currency: "USD", limitation: 100 };
    const mockResponse = { ...mockPayload, status: "CREATED" };
    vi.spyOn(Service.service, 'post').mockResolvedValueOnce(mockResponse);

    const testData =
    {
      parentCashflow: {
        cashflowId: "123",
        amount: "100",
        currency: "USD",
      },
      childCashflows: [{
        amount: "50",
        currency: "USD"
      },
      {
        amount: "50",
        currency: "USD"
      }
      ],
      affirmationDetails: {
        affirmedBy: "test",
        phone_email: "test_Email",
        affirmedAt: "20250901"
      }
    }
    const result = await cashflowManualSplit(testData);
    expect(result).toStrictEqual(mockResponse);

  });
  it("test cashflowAmendSplit", async () => {
    const mockPayload = { profile: "test", currency: "USD", limitation: 100 };
    const mockResponse = { ...mockPayload, status: "ok" };
    vi.spyOn(Service.service, 'post').mockResolvedValueOnce(mockResponse);

    const testData =
    {
      splittingId: "123",
      requestList: [{
        cashflowId: "123",
        amount: "100"
      }]
    }
    const result = await cashflowAmendSplit(testData);
    expect(result).toStrictEqual(mockResponse);

  });
  it("test cashflowUnSplit", async () => {
    const mockPayload = { profile: "test", currency: "USD", limitation: 100 };
    const mockResponse = { ...mockPayload, status: "CREATED" };
    vi.spyOn(Service.service, 'post').mockResolvedValueOnce(mockResponse);

    const testData =
    {
      cashflowId: "123",
      minorVersion: "1",
      businessVersion: "1",
      splittingId: "1"
    }
    const result = await cashflowUnSplit(testData);
    expect(result).toStrictEqual(mockResponse);

  });
  it("test getCurrencyRounding", async () => {
    const mockPayload = { profile: "test", currency: "USD", limitation: 100 };
    const mockResponse = { ...mockPayload, status: "CREATED" };
    vi.spyOn(Service.service, 'get').mockResolvedValueOnce(mockResponse);

    const result = await getCurrencyRounding("currency");
    expect(result).toStrictEqual(mockResponse);

  });

  it("test uploadConfirmationFile", async () => {
    const mockResponse = { success: true, payload: {} };
    const postSpy = jest
      .spyOn(Service.service, "post")
      .mockResolvedValueOnce(mockResponse as any);
    postSpy.mockClear();
    const file = new File(["test-content"], "confirmation.txt", {
      type: "text/plain",
    });

    const result = await uploadConfirmationFile(file);

    expect(result).toStrictEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledTimes(1);

    const [url, data, config] = postSpy.mock.calls[0];
    expect(url).toBe("/api/ratan/v1/netting/confirmation/upload");
    expect(data).toBeInstanceOf(FormData);
    expect((data as FormData).get("file")).toBe(file);
    expect((data as FormData).get("topic")).toBe(
      "TDS3_Trade_Murex_Message_Process_In"
    );
    expect(config).toEqual({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });
});