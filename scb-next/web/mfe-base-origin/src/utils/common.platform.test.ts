import { getJWTPayload, uuidv4 } from "./common";

vi.mock("../hooks/HooksBase", () => ({
  getHooksBase: () => ({ baseDispatch: vi.fn() }),
}));

const toBase64Url = (value: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");

describe("Common platform utilities", () => {
  it("decodes UTF-8 JWT payloads encoded with base64url", () => {
    const expected = { sub: "user-123", displayName: "Jose Ramirez" };
    const payload = toBase64Url(JSON.stringify(expected));

    expect(getJWTPayload(`Bearer header.${payload}.signature`)).toEqual(expected);
  });

  it("uses the browser cryptography API to create UUIDs", () => {
    const expected = "e50c5c9c-b3ca-4e97-91f8-dbc62b5ee954";
    const randomUUID = vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(expected);

    expect(uuidv4()).toBe(expected);
    expect(randomUUID).toHaveBeenCalledOnce();
  });
});
