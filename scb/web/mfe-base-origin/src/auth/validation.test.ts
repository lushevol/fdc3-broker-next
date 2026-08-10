import {
  validateLoginRequest,
  validateOpenFinToken,
} from "./validation";

describe("authentication input validation", () => {
  it("accepts an opaque OpenFin token", () => {
    expect(validateOpenFinToken("opaque-token_123")).toEqual({
      success: true,
      data: "opaque-token_123",
    });
  });

  it.each([null, "", "   ", "token\nwith-control-character"])(
    "rejects an invalid OpenFin token",
    (token) => {
      expect(validateOpenFinToken(token).success).toBe(false);
    }
  );

  it("preserves password whitespace in credential requests", () => {
    expect(
      validateLoginRequest({ username: "  user  ", password: " secret " })
    ).toEqual({
      success: true,
      data: { username: "user", password: " secret " },
    });
  });

  it("accepts an authorization-code request", () => {
    expect(validateLoginRequest({ code: "code" }).success).toBe(true);
  });

  it.each([
    {},
    { username: "", password: "secret" },
    { username: "user", password: "" },
    { code: "" },
  ])("rejects an incomplete login request", (request) => {
    expect(validateLoginRequest(request).success).toBe(false);
  });
});
