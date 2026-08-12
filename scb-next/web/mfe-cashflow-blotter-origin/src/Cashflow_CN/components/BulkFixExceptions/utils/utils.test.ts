import { ExceptionCategory,MultiExceptionsNames } from "../../CashflowDetails/MultiExceptions/common/interface";
import {
  convertAffirmationFormData2RatanAffirmation,
  getFeedbackType,
  handlePayload,
  submitResultFeedback,
} from "./utils";

describe('utils', () => {
  it("submitResultFeedback", () => {
    const res = submitResultFeedback([
        {
            cashflowId: "test_cashflow_id",
            status: 200,
            errorCode: "",
            errorMessage: "SUCCESS",
        },
        {
            cashflowId: "test_cashflow_id_2",
            status: 400,
            errorCode: "",
            errorMessage: "FAILED",
        },
    ]);
    expect(res.type).toBe("warning");
  });
  it("convertAffirmationFormData2RatanAffirmation", () => {
    const res = convertAffirmationFormData2RatanAffirmation({
        affirmedAt: "testAffirmedAt",
        affirmedBy: "testAffirmedBy",
        phone_email: "testPhoneEmail",
    });
    expect(res.Affirmed_At).toBe("testAffirmedAt");
    expect(res.Affirmed_By).toBe("testAffirmedBy");
    expect(res.Phone_Email).toBe("testPhoneEmail");
  });
  it("should handle payload with AFFIRMATION category", () => {
    const exceptions = [
      {
        Exception_Category: ExceptionCategory.AFFIRMATION,
        Stashing: {
          Maker_Request_Body: '{"key": "value"}',
        },
      },
    ];
    const formPayload = {
      comment: {
        comment: 'test',
      }
    };
    const result = handlePayload(exceptions, formPayload);
    expect(result[MultiExceptionsNames.Affirmation]).toEqual({ key: "value" });
  });

  it("should handle payload without AFFIRMATION category", () => {
    const exceptions = [
      {
        Exception_Category: ExceptionCategory.OTHER,
        Stashing: {
          Maker_Request_Body: '{"key": "value"}',
        },
      },
    ];
    const formPayload = {
      comment: {
        comment: 'test',
      }
    };
    const result = handlePayload(exceptions, formPayload);
    expect(result[MultiExceptionsNames.Affirmation]).toBeUndefined();
  });

  it("should handle payload with invalid JSON", () => {
    const exceptions = [
      {
        Exception_Category: ExceptionCategory.AFFIRMATION,
        Stashing: {
          Maker_Request_Body: '{"key": "value"',
        },
      },
    ];
    const formPayload = {
      comment: {
        comment: 'test',
      }
    };
    const result = handlePayload(exceptions, formPayload);
    expect(result[MultiExceptionsNames.Affirmation]).toBeUndefined();
  });
});


describe("BulkFixExceptions utils", () => {
  describe("getFeedbackType & submitResultFeedback", () => {
    it("returns error when no successes", () => {
      expect(getFeedbackType([], ["a"])) .toBe("error");
    });

    it("returns success when no failures", () => {
      expect(getFeedbackType(["a"], [])).toBe("success");
    });

    it("returns warning when both success and failed exist", () => {
      expect(getFeedbackType(["a"], ["b"])) .toBe("warning");
    });

    it("submitResultFeedback formats message and type correctly", () => {
      const results = [
        { status: 200, cashflowId: "c1" },
        { status: 500, cashflowId: "c2" },
      ];
      const msg = submitResultFeedback(results as any);
      expect(msg.type).toBe("warning");
      // content should include both parts
      expect(msg.content).toMatch(/1 cashflows succeed/);
      expect(msg.content).toMatch(/1 cashflows failed/);
    });

    it("submitResultFeedback when all failed returns error and only failed message", () => {
      const results = [{ status: 500, cashflowId: "f1" }];
      const msg = submitResultFeedback(results as any);
      expect(msg.type).toBe("error");
      expect(msg.content).toBe("1 cashflows failed !");
    });

    it("submitResultFeedback when all success returns success and only success message", () => {
      const results = [{ status: 200, cashflowId: "s1" }];
      const msg = submitResultFeedback(results as any);
      expect(msg.type).toBe("success");
      expect(msg.content).toBe("1 cashflows succeed !");
    });
  });

  describe("convertAffirmationFormData2RatanAffirmation", () => {
    it("maps null to object with undefined fields", () => {
      const r = convertAffirmationFormData2RatanAffirmation(null);
      expect(r).toEqual({ Affirmed_At: undefined, Affirmed_By: undefined, Phone_Email: undefined });
    });

    it("maps form data correctly", () => {
      const form = { affirmedAt: "2020-01-01", affirmedBy: "u1", phone_email: "p@e" } as any;
      const r = convertAffirmationFormData2RatanAffirmation(form);
      expect(r).toEqual({ Affirmed_At: "2020-01-01", Affirmed_By: "u1", Phone_Email: "p@e" });
    });
  });

  describe("handlePayload", () => {
    it("returns undefined when formPayload undefined", () => {
      const r = handlePayload([], undefined as any);
      expect(r).toBeUndefined();
    });

    it("parses affirmation stashing and injects into payload", () => {
      const exceptions = [
        {
          Exception_Category: ExceptionCategory.AFFIRMATION,
          Stashing: { Maker_Request_Body: JSON.stringify({ a: 1 }) },
        },
      ] as any;
      const payload = { other: true } as any;
      const r = handlePayload(exceptions, payload);
      expect(r).not.toBe(payload); // clone
      expect(r[MultiExceptionsNames.Affirmation]).toEqual({ a: 1 });
    });

    it("handles invalid JSON gracefully", () => {
      const exceptions = [
        {
          Exception_Category: ExceptionCategory.AFFIRMATION,
          Stashing: { Maker_Request_Body: "{ invalid json" },
        },
      ] as any;
      const payload = { other: true } as any;
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const r = handlePayload(exceptions, payload);
      expect(r).not.toBe(payload);
      expect(r[MultiExceptionsNames.Affirmation]).toBeUndefined();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});