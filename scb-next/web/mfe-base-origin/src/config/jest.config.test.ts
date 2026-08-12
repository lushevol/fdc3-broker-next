import config from "../../vi.config";

describe("Jest quality gates", () => {
  it("enforces at least 90% global line and branch coverage", () => {
    expect(config.coverageThreshold?.global).toMatchObject({
      lines: 90,
      branches: 90,
    });
  });
});
