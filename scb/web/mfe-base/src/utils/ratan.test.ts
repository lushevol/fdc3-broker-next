import { AxiosResponse } from "axios";
import { handleStandardResponse } from "./ratan";

describe("Ratan Util", () => {
  it("should be true", async () => {
    const data = await handleStandardResponse({ status: 200, data: { user: { id: "123" } }, headers: {} } as AxiosResponse)
    expect(data).toBeDefined();
    expect(data.user.id).toBe("123");

    try {
      const data0 = await handleStandardResponse({ status: 300, data: { user: { id: "123" } }, headers: {} } as AxiosResponse)
    } catch (e) {
      expect(e.user.id).toBe("123");
    }

  });
});
