import { act, renderHook } from "@testing-library/react";
import useController from "./useController";

const mockDispatchErrorMessage = vi.fn();
const mockLogin = vi.fn();
const mockLoginEntra = vi.fn();

vi.mock("../../../hooks/dispathcer", () => () => ({
  dispacthErrorMessage: mockDispatchErrorMessage,
  dispacthLoading: vi.fn(),
}));

vi.mock("../../../services", () => () => ({
  login: mockLogin,
  loginEntra: mockLoginEntra,
}));

vi.mock("../../../utils/common", () => ({
  getEnv: () => "LOCAL",
}));

describe("login controller validation", () => {
  beforeEach(() => {
    mockDispatchErrorMessage.mockReset();
    mockLogin.mockReset().mockResolvedValue(undefined);
    mockLoginEntra.mockReset().mockResolvedValue(undefined);
  });

  it("does not submit invalid credentials", async () => {
    const { result } = renderHook(() => useController());

    await act(() => result.current.onLogin({ username: "", password: "" }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockLoginEntra).not.toHaveBeenCalled();
    expect(mockDispatchErrorMessage).toHaveBeenCalledWith(
      "Enter valid login credentials."
    );
  });

  it("normalizes the username without changing password whitespace", async () => {
    const { result } = renderHook(() => useController());

    await act(() =>
      result.current.onLogin({ username: "  user  ", password: " secret " })
    );

    expect(mockLogin).toHaveBeenCalledWith({
      username: "user",
      password: " secret ",
    });
  });
});
