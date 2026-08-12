import { NotificationCashflow } from "src/Cashflow_CN/test/mockData/cashflow";

import { areAllNotifiedCashflows, isNotifiedCashflow } from "./interface";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Cashflow Notification Interface", () => {
    it("Judging Functions", async () => {
        expect(isNotifiedCashflow(NotificationCashflow)).toBeTruthy();
        expect(areAllNotifiedCashflows([NotificationCashflow])).toBeTruthy();
    });
  });